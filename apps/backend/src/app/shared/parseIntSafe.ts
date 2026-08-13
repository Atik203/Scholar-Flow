/**
 * Safe integer coercion for query params.
 *
 * parseFloat/parseInt of arbitrary user input yields NaN, which flows
 * into Prisma take/skip or raw SQL LIMIT/OFFSET and turns into 500s.
 * All query parsing must go through this helper.
 */
export const toInt = (value: unknown, fallback: number): number => {
  const n = typeof value === "string" ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n;
};

export const toPositiveInt = (
  value: unknown,
  fallback: number,
  min = 1
): number => {
  const n = toInt(value, fallback);
  return Math.max(min, n);
};

export const toBoundedInt = (
  value: unknown,
  fallback: number,
  max: number,
  min = 1
): number => {
  const n = toPositiveInt(value, fallback, min);
  return Math.min(max, n);
};
