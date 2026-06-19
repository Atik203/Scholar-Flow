/**
 * Webhook secret hashing helpers.
 *
 * We never store the raw webhook secret. We store an HMAC-SHA256 of the
 * secret combined with a server-side pepper from env. To verify a delivery,
 * the receiver can also recompute the HMAC; we expose `sign` so the admin
 * UI can show the signature header for the most recent test delivery.
 */

import { createHash, createHmac } from "crypto";

const PEPPER = () => process.env.WEBHOOK_PEPPER || "scholarflow-dev-pepper";

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
  // whsec_ + 40 hex chars (20 bytes) — looks like Stripe's prefix convention
  const random = createHash("sha256")
    .update(`${Date.now()}-${Math.random()}-${PEPPER()}`)
    .digest("hex")
    .slice(0, 40);
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
  const random = createHash("sha256")
    .update(`${Date.now()}-${Math.random()}-${PEPPER()}`)
    .digest("hex")
    .slice(0, 40);
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
