import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import config from '../config';
import prisma from './prisma';

export interface TokenPayload {
  userId: string;
  type: 'password-reset' | 'email-verification';
  email: string;
}

export interface TokenData {
  token: string;
  hashedToken: string;
  expiresAt: Date;
}

class TokenService {
  private readonly TOKEN_EXPIRY_MINUTES = 15; // 15 minutes
  private readonly SALT_ROUNDS = 12;

  /**
   * Generate a secure random token
   */
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash a token using bcrypt
   */
  async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain token with a hashed token
   */
  async compareToken(plainToken: string, hashedToken: string): Promise<boolean> {
    return bcrypt.compare(plainToken, hashedToken);
  }

  /**
   * Create token data with expiry
   */
  createTokenData(): TokenData {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY_MINUTES * 60 * 1000);
    
    return {
      token,
      hashedToken: '', // Will be set after hashing
      expiresAt,
    };
  }

  /**
   * Create and store a token in the database
   */
  async createAndStoreToken(
    userId: string,
    type: 'password-reset' | 'email-verification'
  ): Promise<string> {
    const tokenData = this.createTokenData();
    const hashedToken = await this.hashToken(tokenData.token);

    // Invalidate any existing tokens of the same type for this user
    await this.invalidateExistingTokens(userId, type);

    // Store the new token
    await prisma.userToken.create({
      data: {
        userId,
        token: hashedToken,
        type: type === 'password-reset' ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
        expiresAt: tokenData.expiresAt,
      },
    });

    return tokenData.token;
  }

  /**
   * Validate a token from the database
   */
  async validateToken(
    plainToken: string,
    type: 'password-reset' | 'email-verification'
  ): Promise<{ valid: boolean; userId?: string; email?: string }> {
    try {
      // Find the token in the database
      const tokenRecord = await prisma.userToken.findFirst({
        where: {
          type: type === 'password-reset' ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      if (!tokenRecord) {
        return { valid: false };
      }

      // Compare the plain token with the hashed token
      const isValid = await this.compareToken(plainToken, tokenRecord.token);

      if (!isValid) {
        return { valid: false };
      }

      return {
        valid: true,
        userId: tokenRecord.userId,
        email: tokenRecord.user.email,
      };
    } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false };
    }
  }

  /**
   * Mark a token as used
   */
  async markTokenAsUsed(token: string, type: 'password-reset' | 'email-verification'): Promise<void> {
    await prisma.userToken.updateMany({
      where: {
        token,
        type: type === 'password-reset' ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
      },
      data: {
        used: true,
      },
    });
  }

  /**
   * Invalidate all existing tokens of a specific type for a user
   */
  async invalidateExistingTokens(
    userId: string,
    type: 'password-reset' | 'email-verification'
  ): Promise<void> {
    await prisma.userToken.updateMany({
      where: {
        userId,
        type: type === 'password-reset' ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
        used: false,
      },
      data: {
        used: true,
      },
    });
  }

  /**
   * Clean up expired tokens (can be called by a cron job)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.userToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Get token expiry time in minutes
   */
  getTokenExpiryMinutes(): number {
    return this.TOKEN_EXPIRY_MINUTES;
  }
}

export const tokenService = new TokenService();
export default tokenService;
