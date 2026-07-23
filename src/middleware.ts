import { randomUUID } from 'node:crypto';
import { defineMiddleware } from 'astro:middleware';

const CANONICAL_ORIGIN = 'https://aetas.ai';
const RESERVED_NOINDEX_PATHS = ['/admin', '/cms-preview', '/preview'];

function isWithin(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isReservedNoIndexPath(pathname: string) {
  return RESERVED_NOINDEX_PATHS.some((prefix) => isWithin(pathname, prefix));
}

function genericApiError(requestId: string) {
  return new Response(JSON.stringify({
    ok: false,
    message: 'The request could not be completed. Please try again later.',
    requestId,
  }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const isApiRequest = isWithin(url.pathname, '/api');
  const isSensitiveRoute = isApiRequest || isReservedNoIndexPath(url.pathname);

  if (import.meta.env.PROD && url.origin !== CANONICAL_ORIGIN) {
    const destination = new URL(`${url.pathname}${url.search}`, CANONICAL_ORIGIN);
    const headers = new Headers({
      'Cache-Control': 'public, max-age=3600',
      Location: destination.toString(),
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
    });
    if (url.protocol === 'https:') {
      headers.set('Strict-Transport-Security', 'max-age=31536000');
    }
    return new Response(null, { status: 308, headers });
  }

  let response: Response;
  let requestId: string | undefined;

  if (isApiRequest) {
    requestId = randomUUID();
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) {
      response = new Response(JSON.stringify({
        ok: false,
        message: 'Cross-origin requests are not allowed.',
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    } else if (request.method === 'OPTIONS') {
      response = new Response(null, {
        status: 405,
        headers: { Allow: 'GET, POST' },
      });
    } else {
      try {
        response = await next();
      } catch (error) {
        const errorType = error instanceof Error ? error.name : 'UnknownError';
        console.error(JSON.stringify({
          level: 'error',
          event: 'api_request_failed',
          requestId,
          method: request.method,
          path: url.pathname,
          errorType,
        }));
        response = genericApiError(requestId);
      }
    }
    response.headers.set('X-Request-ID', requestId);
  } else {
    response = await next();
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');

  if (import.meta.env.PROD && url.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  }

  if (isApiRequest) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    );
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    const vary = new Set(
      (response.headers.get('Vary') ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    );
    vary.add('Origin');
    response.headers.set('Vary', [...vary].join(', '));
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  } else if (isSensitiveRoute) {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
});
