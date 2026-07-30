import { readFile } from 'node:fs/promises';
import { CANONICAL_ORIGIN } from './security-policy.mjs';

export const requiredEnvironment = [
  {
    name: 'FORM_CSRF_SECRET',
    valid: (value) => typeof value === 'string' && value.length >= 32,
  },
  {
    name: 'FORM_DELIVERY_URL',
    valid: (value) => {
      if (typeof value !== 'string') return false;

      try {
        const url = new URL(value);
        return url.protocol === 'https:' && !url.username && !url.password;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'FORM_DELIVERY_BEARER_TOKEN',
    valid: (value) => typeof value === 'string' && value.length >= 20,
  },
];

const REQUIRED_SECURITY_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'X-Frame-Options',
];

export function invalidEnvironmentVariables(environment) {
  const hasFormConfiguration = requiredEnvironment.some(({ name }) => (
    typeof environment[name] === 'string' && environment[name].trim().length > 0
  ));

  if (!hasFormConfiguration) return [];

  return requiredEnvironment
    .filter(({ name, valid }) => !valid(environment[name]))
    .map(({ name }) => name);
}

function firstHeaderValue(value) {
  if (Array.isArray(value)) return value[0]?.split(',', 1)[0].trim();
  return value?.split(',', 1)[0].trim();
}

function effectiveHost(request) {
  return (
    firstHeaderValue(request.headers['x-forwarded-host'])
    || firstHeaderValue(request.headers.host)
    || ''
  ).toLowerCase();
}

function effectiveProtocol(request) {
  return (
    firstHeaderValue(request.headers['x-forwarded-proto'])
    || (request.socket?.encrypted ? 'https' : 'http')
  ).toLowerCase();
}

export function shouldRedirectToCanonical(request) {
  const host = effectiveHost(request);
  const protocol = effectiveProtocol(request);
  return protocol !== 'https' || (host !== 'aetas.ai' && host !== 'aetas.ai:443');
}

export function canonicalLocation(requestTarget = '/') {
  try {
    const incoming = new URL(requestTarget, CANONICAL_ORIGIN);
    return new URL(`${incoming.pathname}${incoming.search}`, CANONICAL_ORIGIN).toString();
  } catch {
    return `${CANONICAL_ORIGIN}/`;
  }
}

export async function loadGeneratedSecurityHeaders(
  headersPath = new URL('../dist/client/_headers.json', import.meta.url),
) {
  const content = await readFile(headersPath, 'utf8');
  const entries = JSON.parse(content);
  if (!Array.isArray(entries)) throw new TypeError('Generated static headers must be an array.');

  const rootHeaders = entries.find((entry) => entry?.pathname === '/')?.headers;
  if (!Array.isArray(rootHeaders)) {
    throw new TypeError('Generated static headers do not contain the root route.');
  }

  const headers = Object.fromEntries(
    rootHeaders
      .filter((header) => typeof header?.key === 'string' && typeof header?.value === 'string')
      .map((header) => [header.key, header.value]),
  );

  const missing = REQUIRED_SECURITY_HEADERS.filter((name) => !headers[name]);
  if (missing.length > 0) {
    throw new TypeError(`Generated static headers are missing: ${missing.join(', ')}`);
  }

  return Object.fromEntries(
    REQUIRED_SECURITY_HEADERS.map((name) => [name, headers[name]]),
  );
}

export function createSecureRequestListener(
  astroHandler,
  securityHeaders,
  { enforceCanonical = true } = {},
) {
  return async (request, response) => {
    for (const [name, value] of Object.entries(securityHeaders)) {
      response.setHeader(name, value);
    }

    if (enforceCanonical && shouldRedirectToCanonical(request)) {
      response.statusCode = 308;
      response.setHeader('Cache-Control', 'public, max-age=3600');
      response.setHeader('Location', canonicalLocation(request.url));
      response.end();
      return;
    }

    try {
      await astroHandler(request, response);
    } catch {
      console.error('[server] request_failed');
      if (!response.headersSent) {
        response.statusCode = 500;
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('Internal Server Error');
      } else {
        response.destroy();
      }
    }
  };
}
