# Scholar-Flow Changelog

## v1.1.7 (2025-10-03) – Real-Time Subscription Sync & Role Management Fixes

Author: @Atik203

### Critical Fixes – v1.1.7

#### 🐛 Subscription Cancellation Role Downgrade

- **Issue**: When users canceled subscriptions from Stripe portal, their roles remained premium (e.g., TEAM_LEAD) instead of downgrading to RESEARCHER
- **Root Cause**: Webhook handler only checked subscription `status === ACTIVE` but ignored `cancel_at_period_end` flag
- **Fix**: Immediately downgrade user role to RESEARCHER when `cancel_at_period_end = true`, even if subscription is still active until period end
- **Impact**: Users now see correct free-tier role immediately after cancellation

#### 🔄 Real-Time UI Updates After Subscription Changes

- **Issue**: After managing subscriptions in Stripe portal, UI showed stale data (old role, subscription status) requiring manual page refresh
- **Root Cause**: No polling mechanism to detect changes made outside the app; cached Redux state not invalidated
- **Fix**: Implemented smart subscription sync system with multiple layers:
  1. **Polling Hook** (`useSubscriptionSync`): Auto-detects changes with 10-attempt limit and 2s intervals
  2. **Visibility Detection**: ManageSubscriptionButton listens for page focus/visibility to trigger refresh
  3. **Role Change Detection**: AuthProvider polls every 30s and force-invalidates cache on role changes
  4. **Optimistic Updates**: RTK Query mutations update UI instantly, rollback on error

### New Features – v1.1.7

#### 🎯 Smart Subscription Polling

- Custom `useSubscriptionSync` hook with intelligent stop conditions
- Captures initial snapshot, compares on each poll, stops when changes detected
- Prevents infinite loops with ref-based state management and proper cleanup
- Visual sync indicator shows polling progress (attempt count)
- Success/timeout toast notifications for user feedback

#### 🔔 Enhanced AuthProvider

- Background polling every 30 seconds for subscription changes
- Automatic role change detection with cache invalidation
- Version-based user sync prevents duplicate updates
- Includes role in version key for immediate detection

#### 💡 Optimistic UI Updates

- Cancel/reactivate subscription updates UI instantly
- Automatic rollback on server errors
- Proper cache invalidation strategy with 60s retention
- Enhanced error handling with retry logic

### Technical Implementation – v1.1.7

#### Backend Webhook Improvements

```typescript
// BEFORE: Only checked status
if (status === SUBSCRIPTION_STATUS.ACTIVE) {
  updateRole(userRole); // Premium role
} else {
  // Don't update role
}

// AFTER: Check cancellation flag
const shouldDowngradeToFree =
  subscription.cancel_at_period_end || status !== SUBSCRIPTION_STATUS.ACTIVE;

if (shouldDowngradeToFree) {
  updateRole("RESEARCHER"); // Immediate downgrade
} else {
  updateRole(userRole); // Premium role
}
```

#### Frontend Smart Polling

- **Hook**: `useSubscriptionSync` - Polling with snapshot comparison
- **Trigger Points**: URL sessionId, page visibility, window focus
- **Stop Conditions**: Changes detected, max attempts (10), timeout
- **Cleanup**: Proper ref management, no memory leaks

#### Files Updated

**Backend:**

- `apps/backend/src/app/modules/Billing/webhook.controller.ts`
  - Enhanced `handleSubscriptionUpdated` with cancellation detection
  - Immediate role downgrade on `cancel_at_period_end = true`
  - Improved logging for subscription state changes

**Frontend:**

- `apps/frontend/src/hooks/useSubscriptionSync.ts` (NEW)
  - Smart polling hook with snapshot comparison
  - Automatic stop on change detection or timeout
  - Comprehensive error handling and cleanup
- `apps/frontend/src/app/dashboard/billing/page.tsx`
  - Integrated `useSubscriptionSync` hook
  - Visual polling indicator with attempt counter
  - Success/timeout toast notifications
  - URL cleanup after sync completion
- `apps/frontend/src/components/billing/ManageSubscriptionButton.tsx`
  - Visibility change detection for portal returns
  - Window focus event listener (fallback)
  - Automatic cache invalidation on return
- `apps/frontend/src/components/providers/AuthProvider.tsx`
  - Background polling every 30 seconds
  - Role change detection with logging
  - Force cache invalidation on role changes
  - Version key includes role for instant detection
- `apps/frontend/src/redux/api/billingApi.ts`
  - Optimistic updates for plan management
  - Enhanced cache invalidation strategy
  - Reduced cache retention (60s for subscriptions)
  - Proper rollback on mutation errors

### Testing & Validation – v1.1.7

- ✅ Manual testing: Cancel Team Lead trial in Stripe portal → Role immediately downgrades to RESEARCHER
- ✅ Return from portal: Page focus triggers refresh, UI updates within 2-4 seconds
- ✅ Subscription upgrade: Checkout session completion updates role in real-time
- ✅ Optimistic updates: Cancel/reactivate shows instant feedback, correct rollback on error
- ✅ No infinite loops: Proper ref management, cleanup verified
- ✅ Memory leaks: Event listeners properly removed on unmount
- ✅ Type checking: All TypeScript compilation successful

### Edge Cases Handled – v1.1.7

1. **Trial Cancellation**: User cancels during trial → Immediately RESEARCHER
2. **Rapid Portal Navigation**: Multiple visits don't trigger redundant polling
3. **Network Failures**: Polling continues, automatic retry with backoff
4. **Stale Cache**: Role changes force-invalidate all related caches
5. **Concurrent Updates**: Version-based sync prevents race conditions
6. **Browser Tab Switching**: Visibility API reliably detects returns
7. **Maximum Attempts**: Graceful timeout after 10 polling attempts (20s)

### Performance Impact – v1.1.7

- **Polling Overhead**: Negligible - only when `sessionId` present or portal opened
- **Network Requests**: Controlled - max 10 attempts with 2s intervals (20s window)
- **Cache Strategy**: Optimized - 60s retention for subscription data
- **Memory Usage**: Clean - proper cleanup, no event listener leaks
- **User Experience**: Excellent - 2-4s sync time vs previous manual refresh requirement

### Impact Summary – v1.1.7

- Users see correct role immediately after subscription cancellation
- No manual page refresh needed after Stripe portal interactions
- Real-time UI updates provide confidence in subscription state
- Optimistic updates make the app feel instant and responsive
- Proper error handling with automatic retries prevents data inconsistencies
- Production-ready with comprehensive edge case handling

---

## v1.1.6 (2025-10-03) – Billing & Subscription Launch

- Finalized Stripe checkout with reliable webhook processing and plan syncing
- Refreshed dashboard billing experience with real-time role updates and plan details
- Added universal Billing navigation entry and auth refresh to surface subscription status instantly
