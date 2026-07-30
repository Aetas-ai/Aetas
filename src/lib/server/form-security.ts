import { randomBytes } from 'node:crypto';
import { FORM_CSRF_SECRET } from 'astro:env/server';
import {
  CSRF_MAX_AGE_SECONDS,
  issueSignedCsrfToken,
  verifySignedCsrfToken,
} from './csrf';
import {
  BoundedRateLimiter,
  type RateLimitOptions,
  type RateLimitResult,
} from './rate-limit';

const CSRF_COOKIE = import.meta.env.PROD ? '__Host-aetas-csrf' : 'aetas-csrf';
const rateLimiter = new BoundedRateLimiter();
const developmentSecret = import.meta.env.DEV ? randomBytes(32).toString('base64url') : undefined;

function getCsrfSecret() {
  return FORM_CSRF_SECRET || developmentSecret;
}

export function issueCsrfToken() {
  const secret = getCsrfSecret();
  if (!secret) return null;
  return issueSignedCsrfToken(secret);
}

export function verifyCsrfToken(formToken: string, cookieToken: string | undefined) {
  const secret = getCsrfSecret();
  if (!secret) return { valid: false, reason: 'invalid' as const };
  return verifySignedCsrfToken(formToken, cookieToken, secret);
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
  return rateLimiter.take({ endpoint, identifier, limit, windowMs });
}

export function rateLimitHeaders(result: RateLimitResult) {
  const headers: Record<string, string> = {
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
  };

  if (!result.allowed) headers['Retry-After'] = String(result.retryAfterSeconds);
  return headers;
}
