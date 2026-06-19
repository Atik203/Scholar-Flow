/**
 * Admin API Keys Service
 *
 * Phase 7 admin view for managing integration API keys. Uses HMAC-SHA256
 * hashing with a server-side pepper; raw keys are returned only on creation.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { generateApiKey } from "../Webhooks/secrets";

export const adminApiKeysService = {
  async listKeys() {
    return prisma.apiKey.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async getKey(id: string) {
    const key = await prisma.apiKey.findFirst({
      where: { id, isDeleted: false },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!key) throw new ApiError(404, "API key not found");
    return key;
  },

  async createKey(
    createdById: string,
    data: {
      name: string;
      description?: string;
      scopes?: string[];
      rateLimit?: number;
      expiresAt?: Date;
    }
  ) {
    const { raw, prefix, hash } = generateApiKey();
    const key = await prisma.apiKey.create({
      data: {
        name: data.name,
        description: data.description,
        scopes: data.scopes ?? [],
        rateLimit: data.rateLimit ?? 1000,
        expiresAt: data.expiresAt,
        keyHash: hash,
        keyPrefix: prefix,
        createdById,
      },
    });
    return { ...key, _secret: raw };
  },

  async updateKey(
    id: string,
    patch: {
      name?: string;
      description?: string;
      scopes?: string[];
      rateLimit?: number;
      status?: "ACTIVE" | "REVOKED" | "EXPIRED";
    }
  ) {
    const existing = await prisma.apiKey.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw new ApiError(404, "API key not found");

    const data: Prisma.ApiKeyUpdateInput = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.scopes !== undefined) data.scopes = patch.scopes;
    if (patch.rateLimit !== undefined) data.rateLimit = patch.rateLimit;
    if (patch.status !== undefined) data.status = patch.status;

    return prisma.apiKey.update({ where: { id }, data });
  },

  async revokeKey(id: string) {
    const existing = await prisma.apiKey.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw new ApiError(404, "API key not found");
    return prisma.apiKey.update({
      where: { id },
      data: { status: "REVOKED" },
    });
  },

  async deleteKey(id: string) {
    const existing = await prisma.apiKey.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw new ApiError(404, "API key not found");
    await prisma.apiKey.update({
      where: { id },
      data: { isDeleted: true, status: "REVOKED" },
    });
    return { success: true, id };
  },
};

