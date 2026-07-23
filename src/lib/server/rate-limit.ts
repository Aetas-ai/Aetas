import { createHash } from 'node:crypto';

type RateLimitRecord = {
  expiresAt: number;
  timestamps: number[];
};

export type RateLimitOptions = {
  endpoint: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

type BoundedRateLimiterOptions = {
  maxEntries?: number;
  now?: () => number;
  pruneIntervalMs?: number;
};

export class BoundedRateLimiter {
  private readonly maxEntries: number;
  private readonly now: () => number;
  private readonly pruneIntervalMs: number;
  private readonly store = new Map<string, RateLimitRecord>();
  private nextPruneAt = 0;

  constructor({
    maxEntries = 10_000,
    now = Date.now,
    pruneIntervalMs = 60_000,
  }: BoundedRateLimiterOptions = {}) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) {
      throw new TypeError('maxEntries must be a positive safe integer.');
    }
    if (!Number.isSafeInteger(pruneIntervalMs) || pruneIntervalMs < 1) {
      throw new TypeError('pruneIntervalMs must be a positive safe integer.');
    }

    this.maxEntries = maxEntries;
    this.now = now;
    this.pruneIntervalMs = pruneIntervalMs;
  }

  take({ endpoint, identifier, limit, windowMs }: RateLimitOptions): RateLimitResult {
    if (!Number.isSafeInteger(limit) || limit < 1) {
      throw new TypeError('limit must be a positive safe integer.');
    }
    if (!Number.isSafeInteger(windowMs) || windowMs < 1) {
      throw new TypeError('windowMs must be a positive safe integer.');
    }

    const now = this.now();
    this.pruneExpired(now);

    const anonymizedIdentifier = createHash('sha256').update(identifier).digest('base64url');
    const key = `${endpoint}:${anonymizedIdentifier}`;
    const cutoff = now - windowMs;
    const existing = this.store.get(key)?.timestamps.filter((timestamp) => timestamp > cutoff) ?? [];

    if (existing.length >= limit) {
      this.touch(key, {
        expiresAt: existing.at(-1)! + windowMs,
        timestamps: existing,
      });
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((existing[0] + windowMs - now) / 1_000)),
      };
    }

    existing.push(now);
    this.makeRoomFor(key);
    this.touch(key, {
      expiresAt: now + windowMs,
      timestamps: existing,
    });

    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - existing.length),
      retryAfterSeconds: 0,
    };
  }

  size() {
    return this.store.size;
  }

  private makeRoomFor(key: string) {
    if (this.store.has(key)) return;

    while (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (typeof oldestKey !== 'string') break;
      this.store.delete(oldestKey);
    }
  }

  private pruneExpired(now: number) {
    if (now < this.nextPruneAt) return;

    for (const [key, record] of this.store) {
      if (record.expiresAt <= now) this.store.delete(key);
    }
    this.nextPruneAt = now + this.pruneIntervalMs;
  }

  private touch(key: string, record: RateLimitRecord) {
    this.store.delete(key);
    this.store.set(key, record);
  }
}
