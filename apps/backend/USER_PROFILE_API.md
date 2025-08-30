# User Profile API Documentation

## Overview
This document describes the implementation of the User Profile Update API for Scholar-Flow backend. The API allows authenticated users to view and update their profile information.

## Features Implemented

### ✅ Completed Features
- [x] **Profile Retrieval**: GET `/api/user/me` - Get current user profile
- [x] **Profile Update**: PUT `/api/user/update-profile` - Update user profile fields
- [x] **Password Change**: POST `/api/user/change-password` - Change user password
- [x] **Input Validation**: Zod schema validation for all inputs
- [x] **Authentication**: JWT-based authentication middleware
- [x] **Error Handling**: Comprehensive error handling and validation
- [x] **Swagger Documentation**: Complete API documentation
- [x] **Type Safety**: Full TypeScript implementation

## API Endpoints

### 1. Get User Profile
```http
GET /api/user/me
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully!",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Dr. John Smith",
    "firstName": "John",
    "lastName": "Smith",
    "institution": "Stanford University",
    "fieldOfStudy": "Computer Science",
    "image": "https://example.com/avatar.jpg",
    "role": "RESEARCHER",
    "createdAt": "2025-08-29T18:00:00.000Z",
    "updatedAt": "2025-08-29T18:00:00.000Z"
  }
}
```

### 2. Update User Profile
```http
PUT /api/user/update-profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "firstName": "John",
  "lastName": "Smith",
  "institution": "Stanford University",
  "fieldOfStudy": "Computer Science",
  "image": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully!",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Dr. John Smith",
    "firstName": "John",
    "lastName": "Smith",
    "institution": "Stanford University",
    "fieldOfStudy": "Computer Science",
    "image": "https://example.com/avatar.jpg",
    "role": "RESEARCHER",
    "createdAt": "2025-08-29T18:00:00.000Z",
    "updatedAt": "2025-08-29T18:00:00.000Z"
  }
}
```

### 3. Change Password
```http
POST /api/user/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully!",
  "data": null
}
```

## Database Schema

### User Model Fields
```prisma
model User {
  id           String  @id @default(uuid())
  email        String  @unique
  name         String?
  firstName    String?
  lastName     String?
  institution  String?
  fieldOfStudy String?
  image        String?
  password     String?
  role         Role    @default(RESEARCHER)
  emailVerified DateTime?
  emailVerificationToken String?
  
  // Timestamps
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  isDeleted    Boolean @default(false)
  
  // Relations
  accounts     Account[]
  sessions     Session[]
  // ... other relations
}
```

## Implementation Details

### File Structure
```
src/app/modules/User/
├── user.controller.ts      # Request/response handling
├── user.service.ts         # Business logic & database operations
├── user.routes.ts          # Route definitions & Swagger docs
└── user.validation.ts      # Zod validation schemas
```

### Key Components

#### 1. User Controller (`user.controller.ts`)
- Handles HTTP requests and responses
- Implements proper error handling
- Uses service layer for business logic

#### 2. User Service (`user.service.ts`)
- Database operations using Prisma
- Field filtering and validation
- Proper error handling for database operations

#### 3. User Routes (`user.routes.ts`)
- Route definitions with middleware
- Comprehensive Swagger documentation
- Input validation using Zod schemas

#### 4. Validation Schemas (`user.validation.ts`)
- Zod-based input validation
- Type-safe validation rules
- Custom error messages

## Validation Rules

### Profile Update Validation
```typescript
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  firstName: z.string().min(1, "First name is required").max(50, "First name too long").optional(),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long").optional(),
  institution: z.string().max(200, "Institution name too long").optional(),
  fieldOfStudy: z.string().max(200, "Field of study too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
});
```

### Password Change Validation
```typescript
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});
```

## Security Features

### Authentication
- JWT-based authentication required for all endpoints
- Token validation in auth middleware
- User context injection into request object

### Authorization
- Role-based access control (RBAC)
- User can only update their own profile
- Admin endpoints protected with role middleware

### Input Validation
- Zod schema validation for all inputs
- SQL injection prevention through Prisma ORM
- XSS protection through input sanitization

## Error Handling

### Error Types
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server-side errors

### Error Response Format
```json
{
  "success": false,
  "message": "Validation failed: name: Name is required",
  "errorSources": [
    {
      "path": "name",
      "message": "Name is required"
    }
  ]
}
```

## Testing

### Manual Testing
```bash
# Test profile retrieval (requires auth)
curl -X GET http://localhost:5000/api/user/me \
  -H "Authorization: Bearer <jwt_token>"

# Test profile update (requires auth)
curl -X PUT http://localhost:5000/api/user/update-profile \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Dr. John Smith", "institution": "Stanford University"}'
```

### Automated Testing
```bash
# Run type checking
yarn type-check

# Run linting
yarn lint

# Run tests
yarn test

# Build project
yarn build
```

## Dependencies

### Core Dependencies
- **Express.js**: Web framework
- **Prisma**: Database ORM
- **Zod**: Schema validation
- **JWT**: Authentication
- **Swagger**: API documentation

### Development Dependencies
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Jest**: Testing framework
- **ts-node-dev**: Development server

## Environment Variables

### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scholarflow"
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/scholarflow"

# JWT
NEXTAUTH_SECRET="your-jwt-secret-key"
JWT_SECRET="your-jwt-secret-key"

# Server
PORT=5000
NODE_ENV=development
```

## Deployment

### Production Build
```bash
# Install dependencies
yarn install

# Build project
yarn build

# Start production server
yarn start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

## Performance Considerations

### Database Optimization
- Indexed fields: `id`, `email`, `role`
- Efficient queries using Prisma
- Connection pooling for database connections

### Caching Strategy
- User profile caching (future implementation)
- Redis integration for session management
- Response compression using gzip

## Monitoring & Logging

### Logging
- Request/response logging with Morgan
- Error logging with Winston
- Performance monitoring with custom middleware

### Health Checks
- Database connectivity checks
- API endpoint health monitoring
- System resource monitoring

## Future Enhancements

### Planned Features
- [ ] Profile image upload to cloud storage
- [ ] Profile privacy settings
- [ ] Profile verification system
- [ ] Bulk profile operations
- [ ] Profile analytics and insights

### Technical Improvements
- [ ] Redis caching for user profiles
- [ ] GraphQL API support
- [ ] Real-time profile updates
- [ ] Advanced search and filtering
- [ ] Profile export functionality

## Troubleshooting

### Common Issues

#### 1. Route Not Found
- Ensure backend is restarted after route changes
- Check route registration in main routes file
- Verify middleware order and configuration

#### 2. Validation Errors
- Check Zod schema definitions
- Verify input data format
- Review validation error messages

#### 3. Authentication Issues
- Verify JWT token format
- Check token expiration
- Ensure proper middleware order

#### 4. Database Errors
- Verify database connection
- Check Prisma schema
- Review database permissions

### Debug Mode
```bash
# Enable debug logging
DEBUG=* yarn dev

# Enable Prisma query logging
DEBUG=prisma:query yarn dev
```

## Support & Maintenance

### Code Quality
- ESLint configuration for consistent code style
- Prettier for code formatting
- Husky hooks for pre-commit validation

### Documentation
- Swagger UI available at `/docs`
- OpenAPI specification at `/docs.json`
- Inline code documentation with JSDoc

### Version Control
- Semantic versioning for API changes
- Changelog maintenance
- Backward compatibility considerations

---

**Last Updated**: August 29, 2025  
**Version**: 1.0.0  
**Maintainer**: Scholar-Flow Team
