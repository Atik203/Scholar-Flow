-- Phase 10 — Admin-managed AI provider catalog.
-- Add-only: creates AIProvider table, does not modify any existing data.
-- Backwards-compatible: existing code paths keep working via the static
-- PROVIDER_MODEL_MAP fallback in ai.service.ts (Phase C.3) until an admin
-- seeds the new table.

CREATE TABLE "AIProvider" (
    "id"            TEXT NOT NULL,
    "provider"      TEXT NOT NULL,
    "model"         TEXT NOT NULL,
    "displayName"   TEXT NOT NULL,
    "enabled"       BOOLEAN NOT NULL DEFAULT true,
    "isDefault"     BOOLEAN NOT NULL DEFAULT false,
    "description"   TEXT,
    "apiKeyEnvName" TEXT,
    "displayOrder"  INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "isDeleted"     BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AIProvider_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AIProvider_provider_model_key" ON "AIProvider"("provider", "model");
CREATE INDEX "AIProvider_enabled_displayOrder_idx" ON "AIProvider"("enabled", "displayOrder");
CREATE INDEX "AIProvider_isDefault_idx" ON "AIProvider"("isDefault");
