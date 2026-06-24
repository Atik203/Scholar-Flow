/**
 * AIProvider service
 *
 * CRUD over the AIProvider catalog table. Reads env-backed key presence
 * for the "key status" endpoint so admins can see which providers are
 * actually wired up (without exposing the keys themselves).
 */
import prisma from "../../shared/prisma";

export interface AIProviderKeyStatus {
  envName: string;
  configured: boolean;
}

// Catalog of well-known env-var names we surface in the admin UI. The
// admin AI Keys page lets the operator see at a glance which providers
// have credentials configured. We only check presence (not the value).
const TRACKED_ENV_KEYS: readonly string[] = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GOOGLE_API_KEY",
  "GEMINI_API_KEY",
  "DEEPSEEK_API_KEY",
  "MINIMAX_API_KEY",
] as const;

export const aiProviderService = {
  async list() {
    return prisma.aIProvider.findMany({
      where: { isDeleted: false },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });
  },

  async listEnabled() {
    return prisma.aIProvider.findMany({
      where: { isDeleted: false, enabled: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });
  },

  async getById(id: string) {
    return prisma.aIProvider.findFirst({
      where: { id, isDeleted: false },
    });
  },

  async create(input: {
    provider: string;
    model: string;
    displayName: string;
    description?: string | null;
    apiKeyEnvName?: string | null;
    enabled?: boolean;
    isDefault?: boolean;
    displayOrder?: number;
  }) {
    // If marking as default, clear any existing default first.
    if (input.isDefault) {
      await prisma.aIProvider.updateMany({
        where: { isDefault: true, isDeleted: false },
        data: { isDefault: false },
      });
    }
    return prisma.aIProvider.create({
      data: {
        provider: input.provider,
        model: input.model,
        displayName: input.displayName,
        description: input.description ?? null,
        apiKeyEnvName: input.apiKeyEnvName ?? null,
        enabled: input.enabled ?? true,
        isDefault: input.isDefault ?? false,
        displayOrder: input.displayOrder ?? 0,
      },
    });
  },

  async update(
    id: string,
    input: {
      displayName?: string;
      description?: string | null;
      apiKeyEnvName?: string | null;
      enabled?: boolean;
      displayOrder?: number;
    }
  ) {
    return prisma.aIProvider.update({
      where: { id },
      data: {
        ...(input.displayName !== undefined && { displayName: input.displayName }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.apiKeyEnvName !== undefined && {
          apiKeyEnvName: input.apiKeyEnvName,
        }),
        ...(input.enabled !== undefined && { enabled: input.enabled }),
        ...(input.displayOrder !== undefined && {
          displayOrder: input.displayOrder,
        }),
      },
    });
  },

  async setDefault(id: string) {
    // Atomic-ish swap: clear all defaults, set the new one.
    // Two-step because Prisma doesn't expose a SQL CASE update for
    // multi-row conditionals across a single column in one call.
    await prisma.$transaction([
      prisma.aIProvider.updateMany({
        where: { isDefault: true, isDeleted: false },
        data: { isDefault: false },
      }),
      prisma.aIProvider.update({
        where: { id },
        data: { isDefault: true, enabled: true },
      }),
    ]);
    return prisma.aIProvider.findUnique({ where: { id } });
  },

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    // Batch update in a single transaction.
    const operations = items.map(({ id, displayOrder }) =>
      prisma.aIProvider.update({
        where: { id },
        data: { displayOrder },
      })
    );
    await prisma.$transaction(operations);
    return this.list();
  },

  async softDelete(id: string) {
    // Refuse to delete the default. Caller should re-assign first.
    const target = await prisma.aIProvider.findUnique({ where: { id } });
    if (target?.isDefault) {
      throw new Error("Cannot delete the default provider. Set another provider as default first.");
    }
    await prisma.aIProvider.update({
      where: { id },
      data: { isDeleted: true },
    });
  },

  async getKeyStatuses(): Promise<AIProviderKeyStatus[]> {
    return TRACKED_ENV_KEYS.map((envName) => ({
      envName,
      configured: Boolean(process.env[envName] && process.env[envName]!.length > 0),
    }));
  },

  /**
   * Resolve the "default" model for a given provider. Used by the
   * AI conversation service when a user picks a model name from the
   * admin catalog and the floating assistant needs to know what to
   * pass to the SDK.
   *
   * Returns the model string (or null) so callers can fall back to
   * their own static map if no row is configured.
   */
  async resolveModelForProvider(provider: string, modelHint?: string) {
    if (modelHint) {
      const match = await prisma.aIProvider.findFirst({
        where: { provider, model: modelHint, isDeleted: false, enabled: true },
      });
      if (match) return match.model;
    }
    const fallback = await prisma.aIProvider.findFirst({
      where: { provider, isDeleted: false, enabled: true },
      orderBy: [{ isDefault: "desc" }, { displayOrder: "asc" }],
    });
    return fallback?.model ?? null;
  },
};
