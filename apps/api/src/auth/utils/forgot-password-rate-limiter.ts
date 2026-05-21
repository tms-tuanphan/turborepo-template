const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;

type Bucket = {
  count: number;
  windowStartedAt: number;
};

/**
 * In-memory rate limiter for forgot-password (per key, e.g. IP or email).
 */
export class ForgotPasswordRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxAttempts = DEFAULT_MAX_ATTEMPTS,
    private readonly windowMs = DEFAULT_WINDOW_MS,
  ) {}

  isLimited(key: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now - bucket.windowStartedAt >= this.windowMs) {
      this.buckets.set(key, { count: 1, windowStartedAt: now });
      return false;
    }

    bucket.count += 1;
    return bucket.count > this.maxAttempts;
  }
}
