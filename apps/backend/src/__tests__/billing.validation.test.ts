import { describe, expect, it } from "@jest/globals";
import { billingValidation } from "../app/modules/Billing/billing.validation";

describe("billing validation schemas", () => {
  it("requires a price id for checkout", () => {
    expect(billingValidation.createCheckoutSession.safeParse({}).success).toBe(
      false
    );

    const ok = billingValidation.createCheckoutSession.safeParse({
      priceId: "price_test_123",
      successUrl: "https://example.com/billing/success",
    });
    expect(ok.success).toBe(true);
  });

  it("restricts manage-plan actions to cancel or reactivate", () => {
    expect(
      billingValidation.managePlan.safeParse({ action: "cancel" }).success
    ).toBe(true);
    expect(
      billingValidation.managePlan.safeParse({ action: "reactivate" }).success
    ).toBe(true);
    expect(
      billingValidation.managePlan.safeParse({ action: "delete-everything" })
        .success
    ).toBe(false);
  });
});
