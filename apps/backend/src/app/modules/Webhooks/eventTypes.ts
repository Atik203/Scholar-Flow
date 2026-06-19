/**
 * Registry of webhook event types that admins can subscribe to.
 * The list is intentionally short and stable; new event types are added
 * here in code (no DB lookup).
 */

export interface WebhookEventDescriptor {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const WEBHOOK_EVENT_TYPES: WebhookEventDescriptor[] = [
  {
    id: "user.created",
    name: "User Created",
    description: "Fired when a new user registers",
    category: "user",
  },
  {
    id: "user.updated",
    name: "User Updated",
    description: "Fired when a user profile is updated",
    category: "user",
  },
  {
    id: "user.deleted",
    name: "User Deleted",
    description: "Fired when a user is soft-deleted",
    category: "user",
  },
  {
    id: "paper.uploaded",
    name: "Paper Uploaded",
    description: "Fired when a paper is uploaded",
    category: "paper",
  },
  {
    id: "paper.processed",
    name: "Paper Processed",
    description: "Fired when paper extraction finishes",
    category: "paper",
  },
  {
    id: "collection.created",
    name: "Collection Created",
    description: "Fired when a collection is created",
    category: "collection",
  },
  {
    id: "workspace.member_joined",
    name: "Workspace Member Joined",
    description: "Fired when a user joins a workspace",
    category: "workspace",
  },
  {
    id: "subscription.created",
    name: "Subscription Created",
    description: "Fired when a subscription is created",
    category: "billing",
  },
  {
    id: "subscription.cancelled",
    name: "Subscription Cancelled",
    description: "Fired when a subscription is cancelled",
    category: "billing",
  },
  {
    id: "payment.failed",
    name: "Payment Failed",
    description: "Fired when a payment attempt fails",
    category: "billing",
  },
  {
    id: "system.alert",
    name: "System Alert",
    description: "Fired when a system alert is created",
    category: "system",
  },
];

export const getEventById = (id: string): WebhookEventDescriptor | undefined =>
  WEBHOOK_EVENT_TYPES.find((e) => e.id === id);

export const groupEventsByCategory = (): Record<
  string,
  WebhookEventDescriptor[]
> => {
  const grouped: Record<string, WebhookEventDescriptor[]> = {};
  for (const e of WEBHOOK_EVENT_TYPES) {
    if (!grouped[e.category]) grouped[e.category] = [];
    grouped[e.category].push(e);
  }
  return grouped;
};
