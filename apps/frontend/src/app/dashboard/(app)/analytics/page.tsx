"use client";

/**
 * Analytics default page
 *
 * Renders the personal analytics view directly so the AppSidebar entry
 * "Analytics" lands on a meaningful screen. The full figma page lives
 * under /dashboard/analytics/personal for direct deep-linking.
 */

import PersonalAnalyticsPage from "./personal/page";

export default function AnalyticsIndexPage() {
  return <PersonalAnalyticsPage />;
}
