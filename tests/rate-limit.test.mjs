import assert from 'node:assert/strict';
import test from 'node:test';
import { BoundedRateLimiter } from '../src/lib/server/rate-limit.ts';

test('allows requests up to the limit and returns a retry time afterward', () => {
  let now = 10_000;
  const limiter = new BoundedRateLimiter({ now: () => now });
  const options = {
    endpoint: 'contact',
    identifier: '198.51.100.10',
    limit: 2,
    windowMs: 10_000,
  };

  assert.equal(limiter.take(options).allowed, true);
  assert.equal(limiter.take(options).remaining, 0);

  now += 1_000;
  const blocked = limiter.take(options);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 9);
});

test('never grows beyond its configured hard cap', () => {
  const limiter = new BoundedRateLimiter({
    maxEntries: 3,
    now: () => 10_000,
  });

  for (let index = 0; index < 100; index += 1) {
    limiter.take({
      endpoint: 'contact',
      identifier: `rotating-address-${index}`,
      limit: 8,
      windowMs: 600_000,
    });
    assert.ok(limiter.size() <= 3);
  }

  assert.equal(limiter.size(), 3);
});

test('evicts the least recently used record when the store is full', () => {
  const limiter = new BoundedRateLimiter({
    maxEntries: 2,
    now: () => 10_000,
  });
  const take = (identifier) => limiter.take({
    endpoint: 'contact',
    identifier,
    limit: 1,
    windowMs: 600_000,
  });

  assert.equal(take('oldest').allowed, true);
  assert.equal(take('recent').allowed, true);
  assert.equal(take('oldest').allowed, false);
  assert.equal(take('new').allowed, true);
  assert.equal(take('recent').allowed, true);
});

test('removes expired records during periodic maintenance', () => {
  let now = 10_000;
  const limiter = new BoundedRateLimiter({
    maxEntries: 10,
    now: () => now,
    pruneIntervalMs: 1_000,
  });

  limiter.take({
    endpoint: 'contact',
    identifier: 'expired',
    limit: 1,
    windowMs: 1_000,
  });
  assert.equal(limiter.size(), 1);

  now += 1_001;
  limiter.take({
    endpoint: 'contact',
    identifier: 'current',
    limit: 1,
    windowMs: 1_000,
  });
  assert.equal(limiter.size(), 1);
});
