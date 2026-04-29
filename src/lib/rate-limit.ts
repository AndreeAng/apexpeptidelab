/**
 * Simple in-memory rate limiter for server actions.
 * Uses a sliding window per key. Resets on server restart.
 */

const store = new Map<string, number[]>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = store.get(key) ?? [];

  // Remove expired timestamps
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    store.set(key, valid);
    return { ok: false, remaining: 0 };
  }

  valid.push(now);
  store.set(key, valid);
  return { ok: true, remaining: maxRequests - valid.length };
}
