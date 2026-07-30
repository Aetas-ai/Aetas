import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createContentSecurityPolicy,
  createSecurityHeaders,
} from '../scripts/security-policy.mjs';
import {
  createHtaccess,
  createNodeStaticHeaders,
} from '../scripts/security-headers-integration.mjs';

test('CSP authorizes only the external resources currently used by the site', () => {
  const policy = createContentSecurityPolicy(
    ["'sha256-script'"],
    ["'sha256-style'"],
  );

  assert.match(policy, /script-src 'self' 'sha256-script'/);
  assert.match(policy, /style-src 'self' https:\/\/fonts\.googleapis\.com 'sha256-style'/);
  assert.match(policy, /font-src 'self' data: https:\/\/fonts\.gstatic\.com/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /frame-src 'none'/);
  assert.doesNotMatch(policy, /wasm-unsafe-eval|unsafe-eval|unpkg|webflow/);
});

test('Node static route headers and LiteSpeed rules use the same policy', () => {
  const policy = createContentSecurityPolicy([], []);
  const routeHeaders = createNodeStaticHeaders(
    ['/contact', '/', '/contact', 'invalid'],
    policy,
  );

  assert.deepEqual(routeHeaders.map(({ pathname }) => pathname), ['/', '/contact']);
  for (const route of routeHeaders) {
    const headers = Object.fromEntries(route.headers.map(({ key, value }) => [key, value]));
    assert.equal(headers['Content-Security-Policy'], policy);
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.equal(headers['X-Frame-Options'], 'DENY');
    assert.equal(headers['Cache-Control'], 'public, max-age=0, must-revalidate');
  }

  const htaccess = createHtaccess(policy);
  assert.ok(htaccess.includes(`Content-Security-Policy "${policy}"`));
});

test('the shared policy exposes all required response headers', () => {
  const headers = createSecurityHeaders(createContentSecurityPolicy([], []));

  assert.deepEqual(
    Object.keys(headers).sort(),
    [
      'Content-Security-Policy',
      'Permissions-Policy',
      'Referrer-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
    ],
  );
});
