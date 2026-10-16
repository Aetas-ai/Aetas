import { readFile } from 'node:fs/promises';
import { CANONICAL_ORIGIN } from './security-policy.mjs';

const REQUIRED_SECURITY_HEADERS = [
  'Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options',
  'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options',
];

export function formDeliveryEnabled(value) {
  return value === true || value === 'true';
}

export function invalidEnvironmentVariables(environment) {
  const flag = environment.FORM_DELIVERY_ENABLED;
  if (flag !== undefined && flag !== '' && flag !== true && flag !== false && flag !== 'true' && flag !== 'false') {
    return ['FORM_DELIVERY_ENABLED'];
  }
  // Preparation is intentionally allowed without credentials. Never infer
  // activation from saved credentials or the presence of a recipient.
  if (!formDeliveryEnabled(flag)) return [];

  const present = (name) => typeof environment[name] === 'string' && environment[name].trim().length > 0;
  const invalid = new Set();
  if (typeof environment.FORM_CSRF_SECRET !== 'string' || environment.FORM_CSRF_SECRET.trim().length < 32) {
    invalid.add('FORM_CSRF_SECRET');
  }
  for (const name of ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL']) {
    if (present(name)) invalid.add(name);
  }
  const resend = ['RESEND_API_KEY', 'FORM_SENDER_EMAIL'].some(present);
  const webhook = ['FORM_DELIVERY_URL', 'FORM_DELIVERY_BEARER_TOKEN'].some(present);

  if (resend || !webhook) {
    if (typeof environment.RESEND_API_KEY !== 'string' || !/^re_[^\s]+$/.test(environment.RESEND_API_KEY)) {
      invalid.add('RESEND_API_KEY');
    }
    for (const name of ['FORM_SENDER_EMAIL', 'CONTACT_RECIPIENT_EMAIL']) {
      const value = environment[name];
      if (typeof value !== 'string' || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)) invalid.add(name);
    }
  }
  if (webhook) {
    try {
      const url = new URL(environment.FORM_DELIVERY_URL);
      if (url.protocol !== 'https:' || url.username || url.password) invalid.add('FORM_DELIVERY_URL');
    } catch {
      invalid.add('FORM_DELIVERY_URL');
    }
    if (typeof environment.FORM_DELIVERY_BEARER_TOKEN !== 'string' || environment.FORM_DELIVERY_BEARER_TOKEN.trim().length < 20) {
      invalid.add('FORM_DELIVERY_BEARER_TOKEN');
    }
  }
  if (resend && webhook) {
    invalid.add('RESEND_API_KEY');
    invalid.add('FORM_DELIVERY_URL');
    invalid.add('FORM_DELIVERY_BEARER_TOKEN');
  }
  return [...invalid];
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
  headersPath = new URL('../dist/_headers.json', import.meta.url),
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
