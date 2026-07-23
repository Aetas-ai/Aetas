import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { FORM_CSRF_SECRET } from 'astro:env/server';

const CSRF_COOKIE = import.meta.env.PROD ? '__Host-aetas-csrf' : 'aetas-csrf';
const CSRF_MAX_AGE_SECONDS = 30 * 60;
const MINIMUM_FORM_TIME_MS = 1_500;

type RateLimitRecord = {
  timestamps: number[];
};

type RateLimitOptions = {
  endpoint: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();
const developmentSecret = import.meta.env.DEV ? randomBytes(32).toString('base64url') : undefined;

function getCsrfSecret() {
  return FORM_CSRF_SECRET || developmentSecret;
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function issueCsrfToken() {
  const secret = getCsrfSecret();
  if (!secret) return null;

  const issuedAt = Date.now();
  const payload = `${issuedAt}.${randomBytes(24).toString('base64url')}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyCsrfToken(formToken: string, cookieToken: string | undefined) {
  const secret = getCsrfSecret();
  if (!secret || !cookieToken || !safeEqual(formToken, cookieToken)) {
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

  const age = Date.now() - issuedAt;
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

export function csrfCookieName() {
  return CSRF_COOKIE;
}

export function csrfCookieOptions() {
  return {
    httpOnly: true,
    maxAge: CSRF_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'strict' as const,
    secure: import.meta.env.PROD,
  };
}

export function isSameOriginRequest(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const fetchSite = request.headers.get('sec-fetch-site');
  const allowedOrigins = new Set([requestUrl.origin, 'https://aetas.ai']);

  if (fetchSite === 'cross-site') return false;
  if (origin) return allowedOrigins.has(origin);

  if (referer) {
    try {
      return allowedOrigins.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return false;
}

export function takeRateLimit({ endpoint, identifier, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const anonymizedIdentifier = createHash('sha256').update(identifier).digest('base64url');
  const key = `${endpoint}:${anonymizedIdentifier}`;
  const existing = rateLimitStore.get(key)?.timestamps.filter((timestamp) => timestamp > cutoff) ?? [];

  if (existing.length >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing[0] + windowMs - now) / 1_000));
    rateLimitStore.set(key, { timestamps: existing });
    return { allowed: false, limit, remaining: 0, retryAfterSeconds };
  }

  existing.push(now);
  rateLimitStore.set(key, { timestamps: existing });

  // Bound memory even if a scanner rotates through many addresses.
  if (rateLimitStore.size > 10_000) {
    for (const [storedKey, record] of rateLimitStore) {
      if (record.timestamps.every((timestamp) => timestamp <= cutoff)) rateLimitStore.delete(storedKey);
      if (rateLimitStore.size <= 8_000) break;
    }
  }

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - existing.length),
    retryAfterSeconds: 0,
  };
}

export function rateLimitHeaders(result: RateLimitResult) {
  const headers: Record<string, string> = {
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
  };

  if (!result.allowed) headers['Retry-After'] = String(result.retryAfterSeconds);
  return headers;
}
