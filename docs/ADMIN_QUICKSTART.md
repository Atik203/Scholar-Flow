# Admin Dashboard - Quick Start Guide

## 🎯 Overview

The Admin Dashboard is now fully implemented on the frontend with a complete UI for managing users, papers, analytics, system health, and settings. Backend API integration is pending.

## 🚀 Access the Admin Dashboard

### 1. Login as Admin User

You need a user account with `ADMIN` role. Update your user role in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 2. Navigate to Admin Panel

Once logged in as admin, you'll see the "Administrator" section in the sidebar:

- **Desktop**: Look for the "Administration" section at the bottom of the main sidebar
- **Mobile**: Access via the hamburger menu

### 3. Admin Routes

- **Overview**: `/admin` - Main dashboard with system stats
- **Users**: `/admin/users` - User management
- **Papers**: `/admin/papers` - Paper management
- **Analytics**: `/admin/analytics` - Platform analytics
- **System**: `/admin/system` - System health monitoring
- **Settings**: `/admin/settings` - Platform settings

## 📊 Google Analytics

Google Analytics is now integrated and tracking all pages. The tracking ID is configured in your environment:

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS="G-CP2X8ZW8H0"
```

## 🔧 Current Status

### ✅ Frontend Complete

- Admin navigation in sidebar
- Dedicated admin layout
- 6 admin pages with full UI
- Role-based access control
- Mock data for development

### 🚧 Backend Pending

All admin pages currently use mock data. Next steps:

1. Create Admin module in backend (`apps/backend/src/app/modules/Admin/`)
2. Implement API endpoints (see `docs/ADMIN_DASHBOARD.md`)
3. Connect frontend to real APIs
4. Add audit logging

## 🎨 Admin Features

### User Management (`/admin/users`)

- View all users with search
- User statistics (Total, Active, Pro, Admin)
- Edit/Delete user actions (UI only)
- Role badges and status indicators

### Paper Management (`/admin/papers`)

- View all papers with search
- Paper statistics (Total, Views, Downloads, Storage)
- View/Download/Delete actions (UI only)

### Analytics (`/admin/analytics`)

- Platform-wide metrics
- Usage trends (placeholder for charts)
- Top papers and active users

### System Health (`/admin/system`)

- Real-time health indicators
- Performance metrics with progress bars
- System information panel
- Maintenance actions

### Settings (`/admin/settings`)

- General settings
- Security configuration
- Notification preferences
- Database settings

## 🔐 Security

- All routes protected with `ProtectedRoute` requiring ADMIN role
- Backend auth middleware will verify role on all endpoints
- Audit logging planned for all admin actions

## 📱 Responsive Design

- Desktop: Full sidebar with detailed navigation
- Mobile: Hamburger menu with mobile-optimized views
- All admin pages are fully responsive

## 🎯 Next Development Steps

1. **Backend Setup** (Priority 1)
   - Create Admin module structure
   - Implement user management endpoints
   - Add audit logging middleware

2. **API Integration** (Priority 2)
   - Replace mock data with real API calls
   - Add loading/error states
   - Implement pagination

3. **Advanced Features** (Priority 3)
   - Real-time analytics charts
   - WebSocket for live updates
   - Email notifications
   - Scheduled reports

## 📚 Documentation

- Full implementation details: `docs/ADMIN_DASHBOARD.md`
- Backend API specs: See "TODO: Backend Implementation" section
- Architecture decisions: See "Architecture Decisions" section

---

**Ready to use**: Yes (Frontend only)  
**Production ready**: No (Backend integration required)  
**Last updated**: September 30, 2025
