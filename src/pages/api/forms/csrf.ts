import { randomUUID } from 'node:crypto';
import type { APIRoute } from 'astro';
import {
  csrfCookieName,
  csrfCookieOptions,
  issueCsrfToken,
  rateLimitHeaders,
  takeRateLimit,
} from '../../../lib/server/form-security';

export const prerender = false;

export const GET: APIRoute = ({ clientAddress, cookies, request }) => {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') {
    return new Response(JSON.stringify({ ok: false, message: 'The secure form session could not be started.' }), {
      status: 403,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  const rateLimit = takeRateLimit({
    endpoint: 'csrf',
    identifier: clientAddress || 'unknown-client',
    limit: 30,
    windowMs: 10 * 60 * 1_000,
  });

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      ok: false,
      message: 'Too many requests were sent. Please wait a few minutes and try again.',
    }), {
      status: 429,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        ...rateLimitHeaders(rateLimit),
      },
    });
  }

  const token = issueCsrfToken();
  if (!token) {
    console.error(`[forms] csrf_configuration_unavailable request=${randomUUID()}`);
    return new Response(JSON.stringify({
      ok: false,
      message: 'The secure form session could not be started. Please try again later.',
    }), {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        ...rateLimitHeaders(rateLimit),
      },
    });
  }

  cookies.set(csrfCookieName(), token, csrfCookieOptions());

  return new Response(JSON.stringify({ ok: true, token }), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, private',
      'Content-Type': 'application/json; charset=utf-8',
      Pragma: 'no-cache',
      Vary: 'Cookie',
      'X-Content-Type-Options': 'nosniff',
      ...rateLimitHeaders(rateLimit),
    },
  });
};
