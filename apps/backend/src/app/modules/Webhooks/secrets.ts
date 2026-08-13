/**
 * Webhook secret hashing helpers.
 *
 * We never store the raw webhook secret. We store an HMAC-SHA256 of the
 * secret combined with a server-side pepper from env. To verify a delivery,
 * the receiver can also recompute the HMAC; we expose `sign` so the admin
 * UI can show the signature header for the most recent test delivery.
 */

import { createHmac, randomBytes } from "crypto";

// Fail fast in production when the pepper is missing: without it, every
// stored secret hash is salted with a publicly-known fallback key.
const PEPPER = (): string => {
  const env = process.env.WEBHOOK_PEPPER;
  if (env) return env;
  if (process.env.NODE_ENV === "production") {
    throw new Error("WEBHOOK_PEPPER is not configured");
  }
  return "scholarflow-dev-pepper";
};

export const hashWebhookSecret = (raw: string): string => {
  return createHmac("sha256", PEPPER()).update(raw).digest("hex");
};

export const signWebhookPayload = (
  rawSecret: string,
  payload: string
): string => {
  return createHmac("sha256", rawSecret).update(payload).digest("hex");
};

export const generateWebhookSecret = (): {
  raw: string;
  prefix: string;
  hash: string;
} => {
  // whsec_ + 40 hex chars (20 bytes) — looks like Stripe's prefix convention.
  // crypto.randomBytes — was Date.now()+Math.random() (predictable).
  const random = randomBytes(20).toString("hex");
  const raw = `whsec_${random}`;
  return {
    raw,
    prefix: raw.slice(0, 8),
    hash: hashWebhookSecret(raw),
  };
};

/**
 * Generate an API key in the same style.
 */
export const generateApiKey = (): {
  raw: string;
  prefix: string;
  hash: string;
} => {
  const random = randomBytes(20).toString("hex");
  const raw = `sf_live_${random}`;
  return {
    raw,
    prefix: raw.slice(0, 12),
    hash: hashApiKey(raw),
  };
};

export const hashApiKey = (raw: string): string => {
  return createHmac("sha256", PEPPER()).update(raw).digest("hex");
};
