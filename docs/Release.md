# v1.0.6

Release date: 2025-09-19  
Authors: @Atik203

## Highlights

- **Week 4 Collections Management Complete**: Comprehensive permission-based sharing system
- **Real-Time Updates**: Live cache management with RTK Query optimization
- **Permission System**: OWNER/EDIT/VIEW roles with full backend/frontend enforcement
- **Collection Invitations**: Email-based sharing with role assignment
- **Bug Fixes**: Resolved AbortController errors and stale UI data issues

## What's New

### Permission-Based Collection Sharing

- Role-Based Access Control with OWNER, EDIT, and VIEW permission levels
- Invitation System for sharing collections via email
- Backend Security with full permission enforcement at all API levels
- Frontend Guards with dynamic UI adaptation based on user permissions

### Real-Time Updates

- Live Cache Management using RTK Query with granular cache invalidation
- Polling Support for optional background refresh of collection details
- Manual Refresh capability without page reload
- Optimistic Updates for instant UI feedback

### Technical Improvements

- Enhanced Database Schema with CollectionMember table and optimized indexes
- Improved Backend Architecture with feature-specific error classes and rate limiting
- Advanced Frontend Architecture with better RTK Query error handling and abort management
- Performance Enhancements including composite indexes and optimized SQL queries

## Fixes

- **AbortController Runtime Error**: Resolved RTK Query abort controller issues
- **Stale Collection UI**: Collections now update in real-time without page reload
- **Permission Edge Cases**: Proper handling of dynamic user permission changes
- **Cache Consistency**: Fixed issues with outdated collection data display

## Week 4 Status

**✅ Completed**: Create Collection flow, Add papers to collections, Collection listing page, Search & filter, Backend CRUD, Permission-based sharing, Invitation system, Real-time cache invalidation

**⏳ Pending for Week 4.5**: Extract text content from uploaded PDFs

## Upgrade Notes

- Backward compatible with v1.0.5
- New database migrations will run automatically
- RTK Query cache improvements require no client changes

---
