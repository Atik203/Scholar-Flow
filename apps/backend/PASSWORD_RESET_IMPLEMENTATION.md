# Password Reset & Email Verification Implementation

This document describes the secure password reset, email verification, and forgot password flow implemented in the ScholarFlow backend.

## Overview

The implementation provides a complete, secure authentication flow for:
- **Forgot Password**: Users can request password reset via email
- **Password Reset**: Secure token-based password reset
- **Email Verification**: Email verification for new user accounts
- **Rate Limiting**: Protection against abuse and brute force attacks

## Architecture

### Database Schema

#### New Tables
- **`user_tokens`**: Stores secure tokens for password reset and email verification
- **Updated `users`**: Added email verification fields

#### UserToken Model
```prisma
model UserToken {
  id        String     @id @default(uuid())
  userId    String
  token     String     @unique // Hashed token
  type      TokenType
  expiresAt DateTime
  used      Boolean    @default(false)
  createdAt DateTime   @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([type])
  @@index([expiresAt])
}

enum TokenType {
  PASSWORD_RESET
  EMAIL_VERIFICATION
}
```

#### Updated User Model
```prisma
model User {
  // ... existing fields ...
  emailVerified DateTime? // When email was verified
  emailVerificationToken String? // For email verification
  
  // Token relations
  tokens UserToken[]
}
```

### Core Services

#### 1. Email Service (`src/app/shared/emailService.ts`)
- **Nodemailer Integration**: Uses Gmail SMTP for email delivery
- **HTML Templates**: Professional, responsive email templates
- **Security**: App-specific passwords for Gmail authentication
- **Fallback**: Plain text versions for email clients that don't support HTML

#### 2. Token Service (`src/app/shared/tokenService.ts`)
- **Secure Generation**: Cryptographically secure random tokens (32 bytes)
- **Token Hashing**: Bcrypt hashing with 12 salt rounds
- **Expiry Management**: 15-minute token expiration
- **Token Invalidation**: Automatic cleanup of old tokens
- **Database Storage**: Secure token storage with proper indexing

#### 3. Auth Service (`src/app/modules/Auth/auth.service.ts`)
- **Business Logic**: Orchestrates the complete flow
- **Security**: Implements security best practices
- **Error Handling**: Comprehensive error handling and logging
- **User Management**: Updates user records appropriately

## API Endpoints

### 1. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Security Features:**
- Rate limited to 3 attempts per hour per IP
- Same response for existing/non-existing users (prevents email enumeration)
- Secure token generation and storage

### 2. Password Reset
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Security Features:**
- Token validation with expiry check
- Strong password requirements
- Automatic token invalidation after use
- Rate limited to 3 attempts per hour per IP

### 3. Email Verification
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Security Features:**
- Token validation with expiry check
- Automatic token invalidation after use
- Rate limited to 3 attempts per 15 minutes per IP

### 4. Send Email Verification
```http
POST /api/auth/send-verification
Content-Type: application/json

{
  "userId": "user-uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

**Security Features:**
- Rate limited to 5 attempts per 15 minutes per IP
- User validation before sending

## Security Features

### 1. Token Security
- **Cryptographic Strength**: 32-byte random tokens (256 bits of entropy)
- **Secure Hashing**: Bcrypt with 12 salt rounds
- **Time-Limited**: 15-minute expiration
- **Single-Use**: Tokens are invalidated after use
- **Database Storage**: Secure storage with proper indexing

### 2. Rate Limiting
- **Forgot Password**: 3 attempts per hour per IP
- **Password Reset**: 3 attempts per hour per IP
- **Email Verification**: 3 attempts per 15 minutes per IP
- **General Auth**: 5 attempts per 15 minutes per IP
- **Registration**: 3 attempts per hour per IP

### 3. Email Security
- **App-Specific Passwords**: Gmail app passwords for SMTP
- **Secure Templates**: No sensitive data in email content
- **Professional Design**: Reduces phishing risk
- **Plain Text Fallback**: Accessibility and compatibility

### 4. Password Requirements
- **Minimum Length**: 8 characters
- **Complexity**: At least one lowercase letter and one number
- **Secure Hashing**: Bcrypt with 12 salt rounds

## Configuration

### Environment Variables
```bash
# Email Configuration
EMAIL=your-email@gmail.com
APP_PASS=your-gmail-app-password

# Frontend URL for reset links
RESET_PASS_LINK=https://yourdomain.com/reset-password

# JWT Secrets (if using JWT approach)
RESET_PASS_TOKEN=your-reset-token-secret
RESET_PASS_TOKEN_EXPIRES_IN=15m
```

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for ScholarFlow
3. Use the app password in the `APP_PASS` environment variable

## Email Templates

### Password Reset Email
- **Subject**: "Password Reset Request - ScholarFlow"
- **Design**: Professional blue theme
- **Content**: Clear instructions with security warnings
- **Button**: Prominent reset button
- **Security Note**: 15-minute expiration notice

### Email Verification Email
- **Subject**: "Verify Your Email - ScholarFlow"
- **Design**: Professional green theme
- **Content**: Welcome message with verification instructions
- **Button**: Prominent verify button
- **Security Note**: 15-minute expiration notice

## Testing

### Test Coverage
- **Unit Tests**: Service layer testing with mocked dependencies
- **Integration Tests**: API endpoint testing with real database
- **Security Tests**: Rate limiting and token validation
- **Edge Cases**: Invalid tokens, expired tokens, non-existent users

### Running Tests
```bash
# Run all tests
yarn test

# Run specific test file
yarn test auth-password-reset.test.ts

# Run with coverage
yarn test --coverage
```

## Deployment Considerations

### 1. Database Migration
```bash
# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Verify schema
yarn db:studio
```

### 2. Email Service Verification
```bash
# Test email configuration
# The service includes a verifyConnection method
```

### 3. Environment Setup
- Ensure all required environment variables are set
- Configure Gmail app passwords
- Set appropriate frontend URLs for production

### 4. Monitoring
- Monitor email delivery rates
- Track failed authentication attempts
- Monitor rate limiting triggers
- Log security events

## Best Practices Implemented

### 1. Security
- **Token Expiry**: Short-lived tokens (15 minutes)
- **Secure Hashing**: Bcrypt for password and token hashing
- **Rate Limiting**: Comprehensive rate limiting for all endpoints
- **Input Validation**: Zod schema validation for all inputs
- **Error Handling**: Secure error messages (no information leakage)

### 2. User Experience
- **Clear Messages**: Informative success/error messages
- **Professional Emails**: Beautiful, responsive email templates
- **Fast Response**: Efficient token validation and processing
- **Accessibility**: Plain text email fallbacks

### 3. Maintainability
- **Modular Design**: Separate services for different concerns
- **Type Safety**: Full TypeScript implementation
- **Comprehensive Testing**: High test coverage
- **Documentation**: Detailed API documentation
- **Error Logging**: Comprehensive error tracking

## Troubleshooting

### Common Issues

#### 1. Email Not Sending
- Verify Gmail app password is correct
- Check Gmail 2FA is enabled
- Verify environment variables are set
- Check SMTP connection with `verifyConnection()`

#### 2. Token Validation Failing
- Check token expiration (15 minutes)
- Verify token hasn't been used
- Check database connection
- Verify token type matches endpoint

#### 3. Rate Limiting Issues
- Check IP address restrictions
- Verify rate limit configuration
- Check for proxy/load balancer issues

#### 4. Database Errors
- Verify Prisma schema is up to date
- Check database connection
- Verify migrations have been applied

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=prisma:*
NODE_ENV=development
```

## Future Enhancements

### 1. Additional Security
- **IP Whitelisting**: Allow trusted IPs to bypass rate limits
- **Device Fingerprinting**: Track suspicious device patterns
- **Audit Logging**: Comprehensive security event logging

### 2. Email Enhancements
- **Multiple Providers**: Support for SendGrid, AWS SES
- **Template Engine**: Dynamic email template generation
- **Email Analytics**: Track email open rates and clicks

### 3. User Experience
- **Password Strength Indicator**: Real-time password validation
- **Remember Me**: Extended session management
- **Multi-Factor Authentication**: SMS/authenticator app support

## Support

For questions or issues with this implementation:
1. Check the test files for usage examples
2. Review the API documentation
3. Check the logs for error details
4. Verify environment configuration
5. Test with the provided test suite

---

**Implementation Date**: August 28, 2024  
**Version**: 1.0.0  
**Security Level**: Production-Ready  
**Test Coverage**: Comprehensive
