"use client";

import Script from "next/script";
import React from "react";

interface StripePricingTableProps {
  pricingTableId: string;
  publishableKey: string;
  customerEmail?: string | null;
  clientReferenceId?: string | null;
  className?: string;
}

const STRIPE_PRICING_TABLE_SCRIPT_SRC =
  "https://js.stripe.com/v3/pricing-table.js";

export function StripePricingTable({
  pricingTableId,
  publishableKey,
  customerEmail,
  clientReferenceId,
  className,
}: StripePricingTableProps) {
  if (!pricingTableId || !publishableKey) {
    return null;
  }

  const elementProps: Record<string, string> = {
    "pricing-table-id": pricingTableId,
    "publishable-key": publishableKey,
  };

  if (customerEmail) {
    elementProps["customer-email"] = customerEmail;
  }

  if (clientReferenceId) {
    elementProps["client-reference-id"] = clientReferenceId;
  }

  return (
    <div
      className={
        className ?? "rounded-2xl border border-border/60 bg-card/40 p-4"
      }
    >
      <Script
        id="stripe-pricing-table-script"
        src={STRIPE_PRICING_TABLE_SCRIPT_SRC}
        strategy="lazyOnload"
      />
      {React.createElement("stripe-pricing-table", elementProps)}
    </div>
  );
}
