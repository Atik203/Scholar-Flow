import request from 'supertest';
import app from '../index';
import prisma from '../app/shared/prisma';
import { emailService } from '../app/shared/emailService';
import { tokenService } from '../app/shared/tokenService';

// Mock email service
jest.mock('../app/shared/emailService');
jest.mock('../app/shared/tokenService');

const mockEmailService = emailService as jest.Mocked<typeof emailService>;
const mockTokenService = tokenService as jest.Mocked<typeof tokenService>;

describe('Password Reset and Email Verification API', () => {
  let testUser: any;
  let testToken: string;

  beforeAll(async () => {
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: 'RESEARCHER',
      },
    });

    testToken = 'test-token-123';
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.userToken.deleteMany({
      where: { userId: testUser.id },
    });
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    await prisma.$disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should initiate password reset for existing user', async () => {
      // Mock token service
      mockTokenService.createAndStoreToken.mockResolvedValue(testToken);
      
      // Mock email service
      mockEmailService.sendPasswordResetEmail.mockResolvedValue();

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('password reset link has been sent');
      
      expect(mockTokenService.createAndStoreToken).toHaveBeenCalledWith(
        testUser.id,
        'password-reset'
      );
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        token: testToken,
        type: 'password-reset',
      });
    });

    it('should return same message for non-existent user (security)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('password reset link has been sent');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require email field', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      // Mock token validation
      mockTokenService.validateToken.mockResolvedValue({
        valid: true,
        userId: testUser.id,
        email: testUser.email,
      });

      // Mock token marking as used
      mockTokenService.markTokenAsUsed.mockResolvedValue();

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: testToken,
          newPassword: 'newPassword123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password has been reset successfully');

      expect(mockTokenService.validateToken).toHaveBeenCalledWith(
        testToken,
        'password-reset'
      );
      expect(mockTokenService.markTokenAsUsed).toHaveBeenCalledWith(
        testToken,
        'password-reset'
      );
    });

    it('should reject invalid token', async () => {
      mockTokenService.validateToken.mockResolvedValue({
        valid: false,
      });

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'newPassword123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired reset token');
    });

    it('should validate password requirements', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: testToken,
          newPassword: '123', // Too short
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require token and newPassword', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('should verify email with valid token', async () => {
      // Mock token validation
      mockTokenService.validateToken.mockResolvedValue({
        valid: true,
        userId: testUser.id,
        email: testUser.email,
      });

      // Mock token marking as used
      mockTokenService.markTokenAsUsed.mockResolvedValue();

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: testToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Email verified successfully');

      expect(mockTokenService.validateToken).toHaveBeenCalledWith(
        testToken,
        'email-verification'
      );
      expect(mockTokenService.markTokenAsUsed).toHaveBeenCalledWith(
        testToken,
        'email-verification'
      );
    });

    it('should reject invalid verification token', async () => {
      mockTokenService.validateToken.mockResolvedValue({
        valid: false,
      });

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired verification token');
    });

    it('should require token', async () => {
      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/send-verification', () => {
    it('should send email verification', async () => {
      // Mock token service
      mockTokenService.createAndStoreToken.mockResolvedValue(testToken);
      
      // Mock email service
      mockEmailService.sendEmailVerificationEmail.mockResolvedValue();

      const response = await request(app)
        .post('/api/auth/send-verification')
        .send({ userId: testUser.id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification email sent successfully');

      expect(mockTokenService.createAndStoreToken).toHaveBeenCalledWith(
        testUser.id,
        'email-verification'
      );
      expect(mockEmailService.sendEmailVerificationEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        token: testToken,
        type: 'email-verification',
      });
    });

    it('should handle non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification')
        .send({ userId: 'non-existent-id' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should limit forgot password requests', async () => {
      // Make multiple requests to trigger rate limiting
      for (let i = 0; i < 4; i++) {
        await request(app)
          .post('/api/auth/forgot-password')
          .send({ email: 'test@example.com' })
          .expect(200);
      }

      // The 4th request should be rate limited
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Too many password reset attempts');
    });

    it('should limit email verification requests', async () => {
      // Make multiple requests to trigger rate limiting
      for (let i = 0; i < 4; i++) {
        await request(app)
          .post('/api/auth/verify-email')
          .send({ token: 'test-token' })
          .expect(400); // Will fail due to invalid token, but counts toward rate limit
      }

      // The 4th request should be rate limited
      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'test-token' })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Too many email verification attempts');
    });
  });
});
