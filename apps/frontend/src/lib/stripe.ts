import { loadStripe, Stripe } from "@stripe/stripe-js";

/**
 * Stripe client singleton
 * Lazy loads Stripe.js to keep initial bundle size small
 */

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe checkout will not work."
      );
      // Return a resolved null promise to prevent crashes
      stripePromise = Promise.resolve(null);
      return stripePromise;
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

/**
 * Redirect to Stripe Checkout URL
 * For newer Stripe versions, use direct URL redirect
 */
export const redirectToCheckout = async (checkoutUrl: string) => {
  // For modern Stripe Checkout, simply redirect to the session URL
  window.location.href = checkoutUrl;
};
