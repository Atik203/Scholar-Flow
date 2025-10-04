import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "pricing-table-id": string;
        "publishable-key": string;
        "customer-email"?: string;
        "client-reference-id"?: string;
      };
    }
  }
}

export {};
