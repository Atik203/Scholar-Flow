// Centralized access to UI feature flags.
// All flags must be prefixed with NEXT_PUBLIC_ in the example env to be readable on the client.

const bool = (value: string | undefined) => value === "true" || value === "1";

export const featureFlags = {
  semanticSearch: bool(process.env.NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH),
  annotations: bool(process.env.NEXT_PUBLIC_FEATURE_ANNOTATIONS),
  citationGraph: bool(process.env.NEXT_PUBLIC_FEATURE_CITATION_GRAPH),
  billing: bool(process.env.NEXT_PUBLIC_FEATURE_BILLING),
  usePgVector: bool(process.env.NEXT_PUBLIC_USE_PGVECTOR),
  aiFeatures: bool(process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES), // legacy grouping
  payments: bool(process.env.NEXT_PUBLIC_ENABLE_PAYMENTS),
};

export type FeatureFlagKey = keyof typeof featureFlags;

export function isFeatureEnabled(key: FeatureFlagKey) {
  return featureFlags[key];
}
