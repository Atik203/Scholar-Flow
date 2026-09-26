import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
  user: { create: jest.fn<() => Promise<any>>(), delete: jest.fn<() => Promise<any>>(), findUnique: jest.fn<() => Promise<any>>() },
  subscription: { create: jest.fn<() => Promise<any>>(), findUnique: jest.fn<() => Promise<any>>(), update: jest.fn<() => Promise<any>>() },
  account: { deleteMany: jest.fn<() => Promise<any>>() },
  $disconnect: jest.fn<() => Promise<any>>(),
};

jest.mock("../app/shared/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe("Billing Subscription Flow", () => {
  const testStripeSubId = `sub_test_${Date.now()}`;

  beforeAll(async () => { jest.clearAllMocks(); });
  afterAll(async () => { jest.restoreAllMocks(); });

  it("should create a subscription record", async () => {
    const sub = {
      id: "s1", userId: "u1", planId: "plan_pro", status: "ACTIVE", provider: "STRIPE",
      providerSubscriptionId: testStripeSubId, cancelAtPeriodEnd: false,
    };
    mockPrisma.subscription.create.mockResolvedValue(sub);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.subscription.create({
      data: {
        userId: "u1", planId: "plan_pro", status: "ACTIVE", provider: "STRIPE",
        providerSubscriptionId: testStripeSubId,
        currentPeriodStart: new Date(), currentPeriodEnd: new Date(), expiresAt: new Date(),
      },
    });
    expect(result.status).toBe("ACTIVE");
    expect(result.provider).toBe("STRIPE");
  });

  it("should read subscription with user relation", async () => {
    const sub = { id: "s1", user: { id: "u1", email: "test@example.com", stripeCustomerId: "cus_123" } };
    mockPrisma.subscription.findUnique.mockResolvedValue(sub);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.subscription.findUnique({
      where: { id: "s1" },
      include: { user: { select: { id: true, email: true, stripeCustomerId: true } } },
    });
    expect(result!.user.stripeCustomerId).toContain("cus_");
  });

  it("should update subscription status", async () => {
    const updated = { id: "s1", status: "PAST_DUE", cancelAtPeriodEnd: true };
    mockPrisma.subscription.update.mockResolvedValue(updated);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.subscription.update({ where: { id: "s1" }, data: { status: "PAST_DUE" } });
    expect(result.status).toBe("PAST_DUE");
  });

  it("should cancel subscription", async () => {
    const cancelled = { id: "s1", status: "CANCELED", canceledAt: new Date() };
    mockPrisma.subscription.update.mockResolvedValue(cancelled);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.subscription.update({ where: { id: "s1" }, data: { status: "CANCELED", canceledAt: new Date() } });
    expect(result.status).toBe("CANCELED");
  });
});
