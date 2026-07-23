import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const CSRF_MAX_AGE_SECONDS = 30 * 60;
export const MINIMUM_FORM_TIME_MS = 1_500;

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function issueSignedCsrfToken(secret: string, issuedAt = Date.now()) {
  const payload = `${issuedAt}.${randomBytes(24).toString('base64url')}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySignedCsrfToken(
  formToken: string,
  cookieToken: string | undefined,
  secret: string,
  now = Date.now(),
) {
  if (!cookieToken || !safeEqual(formToken, cookieToken)) {
    return { valid: false, reason: 'invalid' as const };
  }

  const parts = formToken.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'invalid' as const };

  const [issuedAtValue, nonce, suppliedSignature] = parts;
  const issuedAt = Number(issuedAtValue);
  const payload = `${issuedAtValue}.${nonce}`;

  if (!Number.isSafeInteger(issuedAt) || !safeEqual(sign(payload, secret), suppliedSignature)) {
    return { valid: false, reason: 'invalid' as const };
  }

  const age = now - issuedAt;
  if (age < 0 || age > CSRF_MAX_AGE_SECONDS * 1_000) {
    return { valid: false, reason: 'expired' as const };
  }

  if (age < MINIMUM_FORM_TIME_MS) {
    return {
      valid: false,
      reason: 'too-fast' as const,
      retryAfterSeconds: Math.max(1, Math.ceil((MINIMUM_FORM_TIME_MS - age) / 1_000)),
    };
  }

  return { valid: true, issuedAt } as const;
}
