import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
  $queryRaw: jest.fn<() => Promise<any>>(),
  $executeRaw: jest.fn<() => Promise<any>>(),
};

const mockPrismaSql = {
  sql: jest.fn(() => ({ __prisma_sql: true }) as any),
  empty: { __prisma_empty: true } as any,
  join: jest.fn(() => ({ __prisma_sql: true }) as any),
  raw: jest.fn(() => ({ __prisma_sql: true }) as any),
};

jest.mock("../app/shared/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
  Prisma: mockPrismaSql,
}));

const mockStripeObject = {
  webhooks: { constructEvent: jest.fn<() => any>() },
  subscriptions: { retrieve: jest.fn<() => Promise<any>>() },
};

jest.mock("../app/shared/stripe", () => ({ __esModule: true, default: mockStripeObject }));
jest.mock("../app/modules/Billing/billing.constant", () => ({
  STRIPE_WEBHOOK_EVENTS: {
    CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
    CUSTOMER_SUBSCRIPTION_CREATED: "customer.subscription.created",
    CUSTOMER_SUBSCRIPTION_UPDATED: "customer.subscription.updated",
    CUSTOMER_SUBSCRIPTION_DELETED: "customer.subscription.deleted",
    INVOICE_PAID: "invoice.paid",
    INVOICE_PAYMENT_FAILED: "invoice.payment_failed",
  },
  SUBSCRIPTION_STATUS: { ACTIVE: "ACTIVE", PAST_DUE: "PAST_DUE", CANCELED: "CANCELED", EXPIRED: "EXPIRED" },
}));

process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

import { handleStripeWebhook } from "../app/modules/Billing/webhook.controller";

describe("handleStripeWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockReq = (overrides: Record<string, unknown> = {}) =>
    ({
      headers: {},
      body: Buffer.from("{}"),
      readableEnded: false,
      readable: false,
      ...overrides,
    }) as any;

  const createMockRes = () => {
    const res: Record<string, jest.Mock> = {};
    res.status = jest.fn<() => any>().mockReturnValue(res);
    res.json = jest.fn<() => any>().mockReturnValue(res);
    return res as any;
  };

  it("calls next with error when stripe-signature header is missing", async () => {
    const req = createMockReq({ headers: {} });
    const res = createMockRes();
    const next = jest.fn();
    await handleStripeWebhook(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("calls next with error when signature verification fails", async () => {
    mockStripeObject.webhooks.constructEvent.mockImplementationOnce(() => {
      throw new Error("Invalid signature");
    });

    const req = createMockReq({ headers: { "stripe-signature": "sig_bad" } });
    const res = createMockRes();
    const next = jest.fn();

    await handleStripeWebhook(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(mockStripeObject.webhooks.constructEvent).toHaveBeenCalledTimes(1);
  });

  it("detects duplicate events and returns 200 without processing (idempotency)", async () => {
    const mockEvent = { id: "evt_duplicate", type: "customer.subscription.created", data: { object: {} } };
    mockStripeObject.webhooks.constructEvent.mockReturnValueOnce(mockEvent);
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ id: "existing-we-1" }]);

    const req = createMockReq({ headers: { "stripe-signature": "sig_test" } });
    const res = createMockRes();
    const next = jest.fn();

    await handleStripeWebhook(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true, duplicate: true });
    expect(mockPrisma.$executeRaw).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("stores new event record via $executeRaw on first processing attempt", async () => {
    const mockSubscription = {
      id: "sub_1",
      status: "active",
      customer: "cus_1",
      cancel_at_period_end: false,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      items: {
        data: [
          {
            current_period_start: 1700000000,
            current_period_end: 1702600000,
            price: { id: "price_123" },
            plan: { interval: "month" },
          },
        ],
      },
    };

    const mockEvent = {
      id: "evt_new",
      type: "customer.subscription.updated",
      data: { object: mockSubscription },
    };

    mockStripeObject.webhooks.constructEvent.mockReturnValueOnce(mockEvent);
    mockPrisma.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    mockPrisma.$executeRaw.mockResolvedValueOnce(undefined);

    const req = createMockReq({ headers: { "stripe-signature": "sig_test" } });
    const res = createMockRes();
    const next = jest.fn();

    await handleStripeWebhook(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
    expect(mockPrisma.$executeRaw).toHaveBeenCalled();
  });
});
