# Release Notes

## v1.1.3

Author: @Atik203

### Highlights – v1.1.3

- Role-aware dashboard routing (`/dashboard/{role}/…`) with shared module wrappers
- Admin overview workspace refreshed with unified DashboardLayout cards and metrics
- Middleware, verify-email, CTA, and hero flows redirect directly to role dashboards
- Workspace members tab fixed to display full name + email in refreshed layout
- Sidebar/navigation config aligned with new role-scoped URLs

### Technical Summary – v1.1.3

- Added `getRoleDashboardUrl` helper and propagated across auth + marketing entry points
- Wrapped admin pages (overview, users, settings, system, analytics) in `DashboardLayout`
- Updated AppSidebar + navigation rules to map roles to refreshed routes
- Patched workspace members query consumption to use flattened `name`/`email` response fields
- Hardened middleware redirects to derive role slug from session metadata
