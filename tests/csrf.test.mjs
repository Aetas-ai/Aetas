import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CSRF_MAX_AGE_SECONDS,
  issueSignedCsrfToken,
  MINIMUM_FORM_TIME_MS,
  verifySignedCsrfToken,
} from '../src/lib/server/csrf.ts';

const secret = 'a'.repeat(32);
const issuedAt = 1_000_000;

test('accepts a matching signed token after the minimum form time', () => {
  const token = issueSignedCsrfToken(secret, issuedAt);
  const result = verifySignedCsrfToken(
    token,
    token,
    secret,
    issuedAt + MINIMUM_FORM_TIME_MS,
  );

  assert.deepEqual(result, { valid: true, issuedAt });
});

test('rejects submissions that arrive before the minimum form time', () => {
  const token = issueSignedCsrfToken(secret, issuedAt);
  const result = verifySignedCsrfToken(
    token,
    token,
    secret,
    issuedAt + MINIMUM_FORM_TIME_MS - 1,
  );

  assert.equal(result.valid, false);
  assert.equal(result.reason, 'too-fast');
  assert.equal(result.retryAfterSeconds, 1);
});

test('rejects expired, future, mismatched, and tampered tokens', () => {
  const token = issueSignedCsrfToken(secret, issuedAt);

  assert.equal(
    verifySignedCsrfToken(
      token,
      token,
      secret,
      issuedAt + CSRF_MAX_AGE_SECONDS * 1_000 + 1,
    ).reason,
    'expired',
  );
  assert.equal(
    verifySignedCsrfToken(token, token, secret, issuedAt - 1).reason,
    'expired',
  );
  assert.equal(
    verifySignedCsrfToken(token, `${token}x`, secret, issuedAt + 2_000).reason,
    'invalid',
  );
  assert.equal(
    verifySignedCsrfToken(`${token}x`, `${token}x`, secret, issuedAt + 2_000).reason,
    'invalid',
  );
});
