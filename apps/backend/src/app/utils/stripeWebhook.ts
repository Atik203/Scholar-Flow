import type { Request, RequestHandler } from "express";

interface StripeRawBodyRequest extends Request {
  rawBody?: Buffer;
}

const STRIPE_WEBHOOK_PATHS = ["/webhooks/stripe", "/api/billing/webhook"];

export const isStripeWebhookPath = (req: Request): boolean => {
  const originalUrl = req.originalUrl || req.url;
  return STRIPE_WEBHOOK_PATHS.some((path) => originalUrl.startsWith(path));
};

export const captureStripeRawBody: RequestHandler = (req, _res, next) => {
  const body = req.body;

  if (Buffer.isBuffer(body)) {
    (req as StripeRawBodyRequest).rawBody = body;
  } else if (typeof body === "string") {
    (req as StripeRawBodyRequest).rawBody = Buffer.from(body, "utf8");
  }

  next();
};
