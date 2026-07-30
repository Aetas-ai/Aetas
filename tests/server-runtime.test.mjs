import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canonicalLocation,
  createSecureRequestListener,
  invalidEnvironmentVariables,
  shouldRedirectToCanonical,
} from '../scripts/server-runtime.mjs';

const validEnvironment = {
  FORM_CSRF_SECRET: 'c'.repeat(32),
  FORM_DELIVERY_URL: 'https://forms.example.com/aetas',
  FORM_DELIVERY_BEARER_TOKEN: 't'.repeat(20),
};

function createResponse() {
  return {
    bodyEnded: false,
    headers: new Map(),
    headersSent: false,
    statusCode: 200,
    destroy() {
      this.destroyed = true;
    },
    end() {
      this.bodyEnded = true;
      this.headersSent = true;
    },
    setHeader(name, value) {
      this.headers.set(name, value);
    },
  };
}

test('allows form delivery to remain unconfigured', () => {
  assert.deepEqual(invalidEnvironmentVariables({}), []);
  assert.deepEqual(invalidEnvironmentVariables({
    FORM_CSRF_SECRET: '',
    FORM_DELIVERY_URL: '',
    FORM_DELIVERY_BEARER_TOKEN: '',
  }), []);
});

test('requires a complete valid configuration once form delivery is enabled', () => {
  assert.deepEqual(invalidEnvironmentVariables(validEnvironment), []);
  assert.deepEqual(
    invalidEnvironmentVariables({
      FORM_CSRF_SECRET: 'short',
      FORM_DELIVERY_URL: 'http://forms.example.com',
      FORM_DELIVERY_BEARER_TOKEN: '',
    }),
    ['FORM_CSRF_SECRET', 'FORM_DELIVERY_URL', 'FORM_DELIVERY_BEARER_TOKEN'],
  );
  assert.deepEqual(
    invalidEnvironmentVariables({
      FORM_CSRF_SECRET: 'c'.repeat(32),
    }),
    ['FORM_DELIVERY_URL', 'FORM_DELIVERY_BEARER_TOKEN'],
  );
});

test('accepts only the canonical HTTPS host', () => {
  assert.equal(shouldRedirectToCanonical({
    headers: {
      'x-forwarded-host': 'aetas.ai',
      'x-forwarded-proto': 'https',
    },
    socket: {},
  }), false);

  assert.equal(shouldRedirectToCanonical({
    headers: {
      host: 'attacker.example',
      'x-forwarded-proto': 'https',
    },
    socket: {},
  }), true);
});

test('canonical redirects cannot be influenced by a protocol-relative target', () => {
  assert.equal(
    canonicalLocation('//attacker.example/redirected?value=1'),
    'https://aetas.ai/redirected?value=1',
  );
});

test('the request wrapper applies security headers before delegating', async () => {
  let delegated = false;
  const response = createResponse();
  const listener = createSecureRequestListener(
    async () => {
      delegated = true;
    },
    {
      'Content-Security-Policy': "default-src 'self'",
      'X-Content-Type-Options': 'nosniff',
    },
  );

  await listener({
    headers: {
      'x-forwarded-host': 'aetas.ai',
      'x-forwarded-proto': 'https',
    },
    socket: {},
    url: '/',
  }, response);

  assert.equal(delegated, true);
  assert.equal(response.headers.get('Content-Security-Policy'), "default-src 'self'");
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('the request wrapper returns a fixed canonical redirect before Astro', async () => {
  let delegated = false;
  const response = createResponse();
  const listener = createSecureRequestListener(
    async () => {
      delegated = true;
    },
    { 'X-Content-Type-Options': 'nosniff' },
  );

  await listener({
    headers: {
      host: 'attacker.example',
      'x-forwarded-proto': 'https',
    },
    socket: {},
    url: '//attacker.example/contact?topic=security',
  }, response);

  assert.equal(delegated, false);
  assert.equal(response.statusCode, 308);
  assert.equal(response.headers.get('Location'), 'https://aetas.ai/contact?topic=security');
  assert.equal(response.bodyEnded, true);
});
