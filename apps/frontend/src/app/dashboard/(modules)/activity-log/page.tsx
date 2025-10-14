"use client";

import { ActivityLog } from "@/components/activity/ActivityLog";

export default function ActivityLogPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground">
          Track and monitor all activities across your workspace
        </p>
      </div>

      <ActivityLog limit={100} />
    </div>
  );
}
