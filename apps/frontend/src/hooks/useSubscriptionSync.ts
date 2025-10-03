/**
 * useSubscriptionSync Hook
 *
 * Handles real-time subscription synchronization when user returns from Stripe portal.
 * This hook implements a smart polling mechanism with automatic stop conditions to:
 * 1. Detect when user returns from Stripe Billing Portal
 * 2. Poll backend for updated subscription/user data
 * 3. Stop polling when changes are detected or max attempts reached
 * 4. Prevent infinite loops with proper dependency management
 *
 * Edge Cases Handled:
 * - Subscription cancellation from Stripe portal
 * - Plan upgrades/downgrades
 * - Role changes not reflecting in real-time
 * - Multiple rapid navigation between billing and portal
 */

"use client";

import { apiSlice } from "@/redux/api/apiSlice";
import { useGetSubscriptionQuery } from "@/redux/api/billingApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useAuth } from "@/redux/auth/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { useCallback, useEffect, useRef } from "react";

interface UseSubscriptionSyncOptions {
  /**
   * Whether to enable polling (typically when sessionId is present in URL)
   */
  enabled: boolean;

  /**
   * Maximum number of polling attempts before giving up
   * @default 10
   */
  maxAttempts?: number;

  /**
   * Polling interval in milliseconds
   * @default 2000
   */
  pollingInterval?: number;

  /**
   * Callback when sync completes successfully
   */
  onSyncComplete?: () => void;

  /**
   * Callback when sync fails or times out
   */
  onSyncTimeout?: () => void;
}

interface SubscriptionSnapshot {
  role: string | null;
  subscriptionId: string | null;
  status: string | null;
  planId: string | null;
}

export function useSubscriptionSync({
  enabled = false,
  maxAttempts = 10,
  pollingInterval = 2000,
  onSyncComplete,
  onSyncTimeout,
}: UseSubscriptionSyncOptions) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  // Refs to prevent infinite loops
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const initialSnapshotRef = useRef<SubscriptionSnapshot | null>(null);
  const lastKnownSnapshotRef = useRef<SubscriptionSnapshot | null>(null);

  // Query hooks with manual control
  const { refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: true, // Skip automatic fetching, we'll trigger manually
  });

  const { data: subscription, refetch: refetchSubscription } =
    useGetSubscriptionQuery(
      {},
      {
        skip: true, // Skip automatic fetching
      }
    );

  /**
   * Capture initial snapshot of subscription state
   */
  const captureSnapshot = useCallback((): SubscriptionSnapshot => {
    return {
      role: user?.role || null,
      subscriptionId: user?.stripeSubscriptionId || null,
      status: subscription?.status || null,
      planId: subscription?.planId || null,
    };
  }, [user, subscription]);

  /**
   * Compare two snapshots to detect changes
   */
  const hasChanges = useCallback(
    (
      snapshot1: SubscriptionSnapshot | null,
      snapshot2: SubscriptionSnapshot | null
    ): boolean => {
      if (!snapshot1 || !snapshot2) return false;

      return (
        snapshot1.role !== snapshot2.role ||
        snapshot1.subscriptionId !== snapshot2.subscriptionId ||
        snapshot1.status !== snapshot2.status ||
        snapshot1.planId !== snapshot2.planId
      );
    },
    []
  );

  /**
   * Force refresh all subscription-related data
   */
  const forceRefresh = useCallback(async () => {
    try {
      // Invalidate all user-related cache
      dispatch(apiSlice.util.invalidateTags(["User"]));

      // Force refetch profile and subscription in parallel
      await Promise.all([refetchProfile(), refetchSubscription()]);

      return true;
    } catch (error) {
      console.error("[useSubscriptionSync] Error during refresh:", error);
      return false;
    }
  }, [dispatch, refetchProfile, refetchSubscription]);

  /**
   * Stop polling and cleanup
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    attemptCountRef.current = 0;
  }, []);

  /**
   * Main polling logic
   */
  const poll = useCallback(async () => {
    // Don't poll if already completed
    if (hasCompletedRef.current) {
      stopPolling();
      return;
    }

    attemptCountRef.current += 1;

    // Check if we've exceeded max attempts
    if (attemptCountRef.current > maxAttempts) {
      console.warn(
        `[useSubscriptionSync] Max polling attempts (${maxAttempts}) reached. Stopping.`
      );
      stopPolling();
      hasCompletedRef.current = true;
      onSyncTimeout?.();
      return;
    }

    console.log(
      `[useSubscriptionSync] Polling attempt ${attemptCountRef.current}/${maxAttempts}`
    );

    // Refresh data
    const refreshSuccess = await forceRefresh();

    if (!refreshSuccess) {
      return; // Try again on next interval
    }

    // Capture current state after refresh
    const currentSnapshot = captureSnapshot();

    // Store initial snapshot on first poll
    if (!initialSnapshotRef.current) {
      initialSnapshotRef.current = currentSnapshot;
      lastKnownSnapshotRef.current = currentSnapshot;
      return;
    }

    // Check if subscription state has changed
    const changesDetected = hasChanges(
      lastKnownSnapshotRef.current,
      currentSnapshot
    );

    if (changesDetected) {
      console.log("[useSubscriptionSync] Subscription changes detected!", {
        before: lastKnownSnapshotRef.current,
        after: currentSnapshot,
      });

      // Update last known state
      lastKnownSnapshotRef.current = currentSnapshot;

      // Stop polling and mark as complete
      stopPolling();
      hasCompletedRef.current = true;
      onSyncComplete?.();
    }
  }, [
    maxAttempts,
    onSyncTimeout,
    onSyncComplete,
    stopPolling,
    forceRefresh,
    captureSnapshot,
    hasChanges,
  ]);

  /**
   * Start polling when enabled
   */
  useEffect(() => {
    if (!enabled) {
      // Cleanup if disabled
      stopPolling();
      hasCompletedRef.current = false;
      initialSnapshotRef.current = null;
      lastKnownSnapshotRef.current = null;
      attemptCountRef.current = 0;
      return;
    }

    // Only start if not already completed
    if (hasCompletedRef.current) {
      return;
    }

    console.log("[useSubscriptionSync] Starting subscription sync polling");

    // Do immediate poll
    poll();

    // Set up interval for subsequent polls
    pollingIntervalRef.current = setInterval(poll, pollingInterval);

    // Cleanup on unmount or when disabled
    return () => {
      stopPolling();
    };
  }, [enabled, poll, pollingInterval, stopPolling]);

  return {
    isPolling: enabled && !hasCompletedRef.current,
    attemptCount: attemptCountRef.current,
    maxAttempts,
    forceRefresh,
  };
}
