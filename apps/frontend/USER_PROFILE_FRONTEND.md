# User Profile Frontend Implementation

## Overview

This document describes the frontend implementation of the User Profile Update feature for Scholar-Flow. The implementation provides a modern, responsive interface for users to view and edit their profile information.

## Features Implemented

### ✅ Completed Features

- [x] **Profile Display**: View current profile information
- [x] **Profile Editing**: Inline form editing with validation
- [x] **Real-time Updates**: API integration with RTK Query
- [x] **Responsive Design**: Mobile-first responsive layout
- [x] **Form Validation**: Client-side and server-side validation with Zod schemas
- [x] **Loading States**: Proper loading indicators and states
- [x] **Error Handling**: User-friendly error messages and notifications
- [x] **Type Safety**: Full TypeScript implementation
- [x] **State Management**: Redux Toolkit integration
- [x] **Authentication**: Protected route implementation
- [x] **React Hook Form**: Enhanced form management with validation
- [x] **Delete Account**: Account deletion with confirmation dialog
- [x] **Toast Notifications**: Bottom-right positioned notifications
- [x] **Layout Optimization**: Improved responsive grid layout

## Technical Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: NextAuth.js integration
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: ShadCN UI with AlertDialog for confirmations

### File Structure

```
src/
├── app/profile/
│   └── page.tsx                    # Main profile page
├── components/
│   ├── auth/
│   │   └── RoleBadge.tsx          # User role display component
│   ├── providers/
│   │   └── ToastProvider.tsx      # Toast notifications
│   └── ui/                        # ShadCN UI components
├── hooks/
│   └── useAuthGuard.ts            # Route protection hook
├── lib/
│   └── auth/roles.ts              # Role definitions
├── redux/
│   ├── api/
│   │   ├── apiSlice.ts            # Base RTK Query setup
│   │   └── userApi.ts             # User API endpoints
│   └── auth/
│       └── useAuth.ts             # Auth state management
└── types/
    └── user.ts                    # User type definitions
```

## Components Overview

### 1. Profile Page (`page.tsx`)

The main profile page component that orchestrates the entire user profile experience.

**Key Features:**

- Protected route implementation
- Profile data fetching and display
- Edit mode toggle
- Form submission handling
- Responsive grid layout

**State Management:**

```typescript
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  firstName: "",
  lastName: "",
  institution: "",
  fieldOfStudy: "",
  image: "",
});
```

### 2. Role Badge Component

Displays user roles with appropriate styling and descriptions.

### 3. Toast Notifications

Provides user feedback for successful operations and errors.

## API Integration

### RTK Query Setup

The frontend uses RTK Query for efficient API communication with automatic caching and state management.

#### User API Endpoints

```typescript
export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<User, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete account
    deleteAccount: builder.mutation<
      DeleteAccountResponse,
      DeleteAccountRequest
    >({
      query: (data) => ({
        url: "/user/delete-account",
        method: "DELETE",
        body: data,
      }),
    }),

    // Change password
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/user/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
```

### API Response Types

```typescript
export interface UpdateProfileRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  institution?: string;
  fieldOfStudy?: string;
  image?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteAccountRequest {
  confirmDelete: boolean;
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    deletedAt: string;
  };
}
```

## User Interface Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Header Section                       │
│  Profile Title + Description                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────┐ ┌─────────────────────────────────────┐
│   Profile Card  │ │        Profile Information          │
│                 │ │                                     │
│ ┌─────────────┐ │ │ ┌─────────────────────────────────┐ │
│ │   Avatar    │ │ │ │ Personal Information Header     │ │
│ │             │ │ │ │ [Edit] Button                   │ │
│ └─────────────┘ │ │ └─────────────────────────────────┘ │
│                 │ │                                     │
│ User Details    │ │ ┌─────────────────────────────────┐ │
│ Role Badge      │ │ │ Form Fields (Edit Mode)         │ │
│ Account Info    │ │ │ or Display Fields (View Mode)   │ │
└─────────────────┘ │ └─────────────────────────────────┘ │
                    │                                     │
                    │ ┌─────────────────────────────────┐ │
                    │ │      Account Settings            │ │
                    │ │ Email, Privacy, Connections     │ │
                    │ └─────────────────────────────────┘ │
                    └─────────────────────────────────────┘
```

### Responsive Design

- **Mobile**: Single column layout with stacked cards
- **Tablet**: Two-column layout with profile card and information
- **Desktop**: Full layout with optimal spacing and readability

### Color Scheme

- **Primary**: OKLCH color system for consistent theming
- **Background**: Light gray (light mode) / Dark gray (dark mode)
- **Text**: High contrast for accessibility
- **Accents**: Primary color for interactive elements

## Form Handling

### Edit Mode Implementation

The profile page implements a toggle-based edit mode that switches between display and form views.

#### Form State Management

```typescript
const handleEdit = () => {
  setIsEditing(true);
};

const handleSave = async () => {
  try {
    const updateData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    await updateProfile(updateData).unwrap();

    showSuccessToast(
      "Profile Updated",
      "Your profile has been updated successfully"
    );
    setIsEditing(false);
    refetch();
  } catch (error) {
    showErrorToast(
      "Update Failed",
      "Failed to update profile. Please try again."
    );
  }
};

const handleCancel = () => {
  if (profileData) {
    setFormData({
      name: profileData.name || "",
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      institution: profileData.institution || "",
      fieldOfStudy: profileData.fieldOfStudy || "",
      image: profileData.image || "",
    });
  }
  setIsEditing(false);
};
```

### Form Validation

- **Client-side**: Basic validation for required fields
- **Server-side**: Comprehensive validation through API
- **Real-time**: Immediate feedback on form submission

## State Management

### Redux Store Structure

```typescript
// User slice state
interface UserState {
  user: User | null;
  accessToken: string | null;
}

// API state (managed by RTK Query)
interface ApiState {
  queries: Record<string, QueryState>;
  mutations: Record<string, MutationState>;
  provided: Record<string, TagDescription[]>;
  subscriptions: Record<string, SubscriptionState>;
}
```

### Data Flow

1. **Initial Load**: `useProtectedRoute` → `useGetProfileQuery`
2. **Form Update**: User input → `formData` state → `updateProfile` mutation
3. **Success**: API response → Toast notification → Cache invalidation → UI update
4. **Error**: API error → Error toast → Form remains in edit mode

## Authentication & Authorization

### Route Protection

The profile page is protected using the `useProtectedRoute` hook that ensures only authenticated users can access it.

```typescript
export default function ProfilePage() {
  const { isLoading: isAuthLoading, user: authUser } = useProtectedRoute();

  if (isAuthLoading || isProfileLoading) {
    return <LoadingSpinner />;
  }

  // ... rest of component
}
```

### User Context

- **Authentication State**: Managed by NextAuth.js
- **User Data**: Fetched from backend API
- **Role-based Access**: Display appropriate UI based on user role

## Error Handling

### Error Types

1. **Authentication Errors**: Redirect to login
2. **API Errors**: Display user-friendly error messages
3. **Validation Errors**: Show field-specific validation messages
4. **Network Errors**: Retry mechanisms and offline handling

### Error Display

```typescript
try {
  await updateProfile(updateData).unwrap();
  showSuccessToast(
    "Profile Updated",
    "Your profile has been updated successfully"
  );
} catch (error) {
  console.error("Profile update error:", error);
  showErrorToast(
    "Update Failed",
    "Failed to update profile. Please try again."
  );
}
```

## Performance Optimization

### Code Splitting

- **Dynamic Imports**: Lazy load non-critical components
- **Route-based Splitting**: Automatic code splitting by Next.js
- **Component Optimization**: React.memo for expensive components

### Data Fetching

- **RTK Query Caching**: Automatic cache management
- **Optimistic Updates**: Immediate UI feedback
- **Background Refetching**: Keep data fresh

### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Minification**: Compress production builds
- **Image Optimization**: Next.js Image component

## Accessibility Features

### ARIA Support

- **Form Labels**: Proper label associations
- **Error Messages**: Screen reader accessible
- **Loading States**: Announce loading status
- **Focus Management**: Logical tab order

### Keyboard Navigation

- **Tab Order**: Logical form flow
- **Enter Key**: Submit forms
- **Escape Key**: Cancel editing
- **Arrow Keys**: Navigate form fields

### Screen Reader Support

- **Semantic HTML**: Proper heading structure
- **Alt Text**: Descriptive image alternatives
- **Status Updates**: Announce dynamic content changes

## Testing Strategy

### Unit Testing

- **Component Testing**: Test individual components
- **Hook Testing**: Test custom hooks
- **Utility Testing**: Test helper functions

### Integration Testing

- **API Integration**: Test API calls and responses
- **State Management**: Test Redux store interactions
- **Form Submission**: Test complete user flows

### E2E Testing

- **User Journeys**: Test complete profile update flow
- **Cross-browser**: Test in multiple browsers
- **Mobile Testing**: Test responsive behavior

## Development Workflow

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run type checking
yarn type-check

# Run linting
yarn lint

# Build project
yarn build
```

### Code Quality Tools

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Pre-commit hooks

### Testing Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run E2E tests
yarn test:e2e
```

## Deployment

### Build Process

```bash
# Production build
yarn build

# Static export (if needed)
yarn export

# Start production server
yarn start
```

### Environment Configuration

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Feature Flags
NEXT_PUBLIC_ENABLE_PROFILE_UPDATES=true
```

### Vercel Deployment

- **Automatic Deployments**: Git-based deployment
- **Environment Variables**: Secure configuration
- **Preview Deployments**: Branch-based previews
- **Performance Monitoring**: Built-in analytics

## Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Webpack bundle analyzer
- **Runtime Performance**: React DevTools Profiler

### User Analytics

- **Page Views**: Profile page visits
- **User Actions**: Edit, save, cancel actions
- **Error Tracking**: User experience issues
- **Conversion Metrics**: Profile completion rates

## Future Enhancements

### Planned Features

- [ ] **Profile Image Upload**: Drag & drop image upload
- [ ] **Profile Templates**: Pre-defined profile layouts
- [ ] **Social Integration**: Link social media profiles
- [ ] **Profile Sharing**: Public profile URLs
- [ ] **Advanced Validation**: Real-time field validation

### Technical Improvements

- [ ] **Offline Support**: Service worker for offline editing
- [ ] **Real-time Updates**: WebSocket for live updates
- [ ] **Advanced Caching**: Intelligent cache invalidation
- [ ] **Performance Monitoring**: User experience metrics
- [ ] **A/B Testing**: Feature flag experimentation

## Troubleshooting

### Common Issues

#### 1. Profile Not Loading

- Check authentication status
- Verify API endpoint availability
- Review network requests in DevTools

#### 2. Form Submission Fails

- Validate form data format
- Check API response for errors
- Verify authentication token

#### 3. Styling Issues

- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts
- Verify responsive breakpoints

#### 4. Type Errors

- Run `yarn type-check` to identify issues
- Verify type definitions are up to date
- Check for missing dependencies

### Debug Tools

- **React DevTools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API request monitoring
- **Console Logs**: Error and debug information

## Support & Maintenance

### Code Maintenance

- **Regular Updates**: Keep dependencies current
- **Code Reviews**: Maintain code quality
- **Documentation**: Keep docs up to date
- **Testing**: Maintain test coverage

### User Support

- **Error Reporting**: Collect user feedback
- **Help Documentation**: User guides and FAQs
- **Support Channels**: Email, chat, or ticketing system

---

**Last Updated**: September 6, 2025  
**Version**: 1.1.0  
**Author**: Atik  
**Maintainer**: Scholar-Flow Team  
**Frontend Framework**: Next.js 15 + TypeScript
