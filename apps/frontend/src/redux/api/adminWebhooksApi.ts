/**
 * Admin Webhooks RTK Query slice
 */

import { apiSlice } from "./apiSlice";

export type WebhookEndpointStatus = "ACTIVE" | "INACTIVE" | "ERROR";
export type WebhookDeliveryStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  description: string | null;
  events: string[];
  status: WebhookEndpointStatus;
  lastTriggered: string | null;
  totalDeliveries: number;
  failedDeliveries: number;
  secretPrefix: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  endpointId: string;
  event: string;
  payload: Record<string, unknown>;
  status: WebhookDeliveryStatus;
  statusCode: number | null;
  responseBody: string | null;
  durationMs: number | null;
  attempts: number;
  createdAt: string;
  completedAt: string | null;
}

export interface WebhookEventDescriptor {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const adminWebhooksApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["AdminWebhook"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      listEventTypes: builder.query<
        {
          success: boolean;
          data: { events: WebhookEventDescriptor[]; grouped: Record<string, WebhookEventDescriptor[]> };
        },
        void
      >({
        query: () => "/admin/webhooks/event-types",
        providesTags: [{ type: "AdminWebhook", id: "EVENT_TYPES" }],
      }),

      listEndpoints: builder.query<
        { success: boolean; data: WebhookEndpoint[] },
        void
      >({
        query: () => "/admin/webhooks/endpoints",
        providesTags: [{ type: "AdminWebhook", id: "LIST" }],
      }),

      getEndpoint: builder.query<
        { success: boolean; data: WebhookEndpoint },
        string
      >({
        query: (id) => `/admin/webhooks/endpoints/${id}`,
        providesTags: (result, error, id) => [
          { type: "AdminWebhook", id },
        ],
      }),

      createEndpoint: builder.mutation<
        { success: boolean; data: WebhookEndpoint & { _secret: string } },
        {
          name: string;
          url: string;
          description?: string;
          events: string[];
          status?: "ACTIVE" | "INACTIVE";
        }
      >({
        query: (body) => ({
          url: "/admin/webhooks/endpoints",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "AdminWebhook", id: "LIST" }],
      }),

      updateEndpoint: builder.mutation<
        { success: boolean; data: WebhookEndpoint },
        {
          id: string;
          patch: {
            name?: string;
            url?: string;
            description?: string;
            events?: string[];
            status?: WebhookEndpointStatus;
          };
        }
      >({
        query: ({ id, patch }) => ({
          url: `/admin/webhooks/endpoints/${id}`,
          method: "PATCH",
          body: patch,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "AdminWebhook", id: arg.id },
          { type: "AdminWebhook", id: "LIST" },
        ],
      }),

      rotateSecret: builder.mutation<
        { success: boolean; data: { id: string; _secret: string } },
        string
      >({
        query: (id) => ({
          url: `/admin/webhooks/endpoints/${id}/rotate-secret`,
          method: "POST",
        }),
      }),

      deleteEndpoint: builder.mutation<
        { success: boolean; data: { id: string } },
        string
      >({
        query: (id) => ({
          url: `/admin/webhooks/endpoints/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "AdminWebhook", id: "LIST" }],
      }),

      testEndpoint: builder.mutation<
        { success: boolean; data: unknown },
        string
      >({
        query: (id) => ({
          url: `/admin/webhooks/endpoints/${id}/test`,
          method: "POST",
        }),
        invalidatesTags: [{ type: "AdminWebhook", id: "LIST" }],
      }),

      listDeliveries: builder.query<
        {
          success: boolean;
          data: WebhookDelivery[];
          meta: { page: number; limit: number; total: number; totalPage: number };
        },
        { endpointId: string; status?: WebhookDeliveryStatus; page?: number; limit?: number }
      >({
        query: ({ endpointId, ...params }) => ({
          url: `/admin/webhooks/endpoints/${endpointId}/deliveries`,
          params,
        }),
        providesTags: (result, error, arg) => [
          { type: "AdminWebhook", id: `DELIVERIES-${arg.endpointId}` },
        ],
      }),

      retryDelivery: builder.mutation<
        { success: boolean; data: WebhookDelivery },
        { deliveryId: string }
      >({
        query: ({ deliveryId }) => ({
          url: `/admin/webhooks/deliveries/${deliveryId}/retry`,
          method: "POST",
        }),
        invalidatesTags: [{ type: "AdminWebhook", id: "LIST" }],
      }),
    }),
  });

export const {
  useListEventTypesQuery,
  useListEndpointsQuery,
  useGetEndpointQuery,
  useCreateEndpointMutation,
  useUpdateEndpointMutation,
  useRotateSecretMutation,
  useDeleteEndpointMutation,
  useTestEndpointMutation,
  useListDeliveriesQuery,
  useRetryDeliveryMutation,
} = adminWebhooksApi;
