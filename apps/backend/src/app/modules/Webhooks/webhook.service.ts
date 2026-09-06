import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import {
  generateWebhookSecret,
  hashWebhookSecret,
  signWebhookPayload,
} from "./secrets";

export const webhookService = {
  async listEndpoints() {
    const items = await prisma.webhookEndpoint.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    return items;
  },

  async getEndpoint(id: string) {
    const ep = await prisma.webhookEndpoint.findFirst({
      where: { id, isDeleted: false },
    });
    if (!ep) throw new ApiError(404, "Webhook endpoint not found");
    return ep;
  },

  async createEndpoint(data: {
    name: string;
    url: string;
    description?: string;
    events: string[];
    status: "ACTIVE" | "INACTIVE";
  }) {
    const { raw, prefix, hash } = generateWebhookSecret();
    const ep = await prisma.webhookEndpoint.create({
      data: {
        name: data.name,
        url: data.url,
        description: data.description,
        events: data.events,
        status: data.status,
        secretHash: hash,
        secretPrefix: prefix,
      },
    });
    // Return the raw secret exactly once
    return { ...ep, _secret: raw };
  },

  async updateEndpoint(
    id: string,
    patch: {
      name?: string;
      url?: string;
      description?: string;
      events?: string[];
      status?: "ACTIVE" | "INACTIVE" | "ERROR";
    }
  ) {
    const existing = await prisma.webhookEndpoint.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw new ApiError(404, "Webhook endpoint not found");

    const data: Prisma.WebhookEndpointUpdateInput = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.url !== undefined) data.url = patch.url;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.events !== undefined) data.events = patch.events;
    if (patch.status !== undefined) data.status = patch.status;

    return prisma.webhookEndpoint.update({ where: { id }, data });
  },

  async rotateSecret(id: string) {
    const existing = await prisma.webhookEndpoint.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw new ApiError(404, "Webhook endpoint not found");

    const { raw, prefix, hash } = generateWebhookSecret();
    await prisma.webhookEndpoint.update({
      where: { id },
      data: { secretHash: hash, secretPrefix: prefix },
    });
    return { id, _secret: raw };
  },

  async deleteEndpoint(id: string) {
    const existing = await prisma.webhookEndpoint.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw new ApiError(404, "Webhook endpoint not found");

    await prisma.webhookEndpoint.update({
      where: { id },
      data: { isDeleted: true, status: "INACTIVE" },
    });
    return { success: true, id };
  },

  /**
   * Fire a test event. v1: stores a PENDING delivery record with a
   * stubbed response. Real outbound HTTP delivery is a future enhancement.
   */
  async testEndpoint(id: string) {
    const ep = await this.getEndpoint(id);
    const payload = {
      event: "webhook.test",
      sentAt: new Date().toISOString(),
      endpointId: id,
    };
    const body = JSON.stringify(payload);
    const signature = signWebhookSecretForStorage(ep.secretHash, body);

    const delivery = await prisma.webhookDelivery.create({
      data: {
        endpointId: id,
        event: "webhook.test",
        payload: payload as Prisma.InputJsonValue,
        status: "PENDING",
        attempts: 0,
        durationMs: 0,
      },
    });
    return { delivery, signature, payload };
  },

  async listDeliveries(
    endpointId: string,
    params: {
      page: number;
      limit: number;
      status?: "SUCCESS" | "FAILED" | "PENDING";
    }
  ) {
    const where: Prisma.WebhookDeliveryWhereInput = { endpointId };
    if (params.status) where.status = params.status;

    const [total, items] = await Promise.all([
      prisma.webhookDelivery.count({ where }),
      prisma.webhookDelivery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPage: Math.max(1, Math.ceil(total / params.limit)),
      },
    };
  },

  async retryDelivery(deliveryId: string) {
    const d = await prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
    });
    if (!d) throw new ApiError(404, "Delivery not found");

    return prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: { status: "PENDING", attempts: d.attempts + 1 },
    });
  },
};

export { webhookService as webhookServiceExport };

/**
 * Helper: sign a payload using the secret hash. The hash is not the secret,
 * but for v1 we sign with the hash so the signature is reproducible for
 * audit purposes. In a future iteration we'll need access to the raw secret
 * to provide a real signature to the receiver.
 */
function signWebhookSecretForStorage(
  secretHash: string,
  body: string
): string {
  return signWebhookPayload(secretHash, body);
}

export { hashWebhookSecret };
