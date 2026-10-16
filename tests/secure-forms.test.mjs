import assert from 'node:assert/strict';
import test from 'node:test';

test('quick submits share CSRF initialization, prevent double sends, and preserve entries on failure', async (t) => {
  class Element {
    constructor() { this.attributes = new Map(); this.dataset = {}; }
    setAttribute(key, value) { this.attributes.set(key, value); }
    removeAttribute(key) { this.attributes.delete(key); }
    focus() { this.focused = true; }
  }
  class Input extends Element { value = ''; }
  const csrfInput = new Input();
  const button = new Element();
  const label = new Element();
  label.hidden = false;
  const pending = new Element();
  pending.hidden = true;
  button.querySelector = (selector) => selector === '[data-submit-label]' ? label : pending;
  button.disabled = false;
  const status = new Element();
  const entries = { 'first-name': 'Test', 'last-name': 'Visitor', email: 'visitor@example.com', company: 'Example', intent: 'general', message: 'Please discuss our operational requirements.' };
  let submit;
  let pageshow;
  const form = Object.assign(new Element(), {
    action: 'http://127.0.0.1:4321/api/forms/contact',
    elements: { namedItem: (name) => name === 'csrf-token' ? csrfInput : null },
    querySelector: (selector) => selector === 'button[type="submit"]' ? button : status,
    querySelectorAll: () => [],
    addEventListener: (name, handler) => { if (name === 'submit') submit = handler; },
  });
  const replacements = {
    HTMLElement: Element, HTMLInputElement: Input,
    FormData: class { forEach(callback) { Object.entries({ ...entries, 'csrf-token': csrfInput.value }).forEach(([key, value]) => callback(value, key)); } },
    document: { addEventListener() {}, querySelectorAll: () => [form] },
    window: { location: { assign: (url) => redirects.push(url) }, addEventListener: (name, handler) => { if (name === 'pageshow') pageshow = handler; } },
  };
  const redirects = [];
  for (const [key, value] of Object.entries(replacements)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    t.after(() => { if (previous) Object.defineProperty(globalThis, key, previous); else delete globalThis[key]; });
  }
  const requests = [];
  let resolveCsrf;
  const pendingCsrf = new Promise((resolve) => { resolveCsrf = resolve; });
  let behavior = 'rejected';
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url, options });
    if (url === '/api/forms/csrf') return pendingCsrf;
    if (behavior === 'network-failure') throw new Error('connection failed');
    if (behavior === 'too-fast') {
      behavior = 'unavailable';
      return new Response(JSON.stringify({ ok: false, message: 'Please wait a moment.' }), { status: 400, headers: { 'Retry-After': '1' } });
    }
    if (behavior === 'unavailable') {
      return new Response(JSON.stringify({ ok: false, message: 'Please try again later.', reference: 'req-123' }), { status: 503 });
    }
    return behavior === 'accepted'
      ? new Response(JSON.stringify({ ok: true, redirect: '/contact/thanks' }), { status: 200 })
      : new Response(JSON.stringify({ ok: false, message: 'Please try again later.' }), { status: 503 });
  });

  await import('../src/scripts/secure-forms.ts');
  assert.equal(typeof submit, 'function'); // Handler exists before CSRF resolves.
  let prevented = 0;
  const event = { preventDefault() { prevented++; } };
  const first = submit(event);
  assert.equal(button.disabled, true);
  assert.equal(label.hidden, true);
  assert.equal(pending.hidden, false);
  assert.equal(status.textContent, 'Sending your request…');
  assert.equal(status.dataset.kind, 'info');
  assert.equal(status.attributes.has('role'), false); // Role lives in markup; never toggled.
  await submit(event);
  assert.equal(prevented, 2);
  assert.equal(requests.length, 1); // No second session request or POST.
  resolveCsrf(new Response(JSON.stringify({ ok: true, token: 'signed-token' })));
  await first;
  assert.equal(requests.length, 2);
  assert.equal(requests[1].options.body.get('csrf-token'), 'signed-token');
  assert.equal(requests[1].options.body.get('message'), entries.message);
  assert.equal(button.disabled, false);
  assert.equal(label.hidden, false);
  assert.equal(pending.hidden, true);
  assert.equal(form.attributes.has('aria-busy'), false);
  assert.equal(status.textContent, 'Please try again later.');
  assert.deepEqual(redirects, []);

  behavior = 'network-failure';
  await submit(event);
  assert.equal(requests.length, 3); // No automatic retry.
  assert.equal(button.disabled, false);
  assert.equal(entries.message, 'Please discuss our operational requirements.');
  assert.match(status.textContent, /Check your connection/);

  behavior = 'too-fast';
  await submit(event);
  assert.equal(requests.length, 5); // One automatic resend after the short Retry-After.
  assert.equal(status.textContent, 'Please try again later. Reference: req-123.');
  assert.equal(status.dataset.kind, 'error');
  assert.equal(button.disabled, false);

  behavior = 'accepted';
  await submit(event);
  assert.equal(requests.length, 6);
  assert.equal(requests[5].options.body.get('message'), entries.message);
  assert.deepEqual(redirects, ['/contact/thanks']);
  assert.equal(button.disabled, true);
  assert.equal(pending.hidden, false);
  assert.equal(form.attributes.get('aria-busy'), 'true');
  await submit(event);
  assert.equal(requests.length, 6); // Navigation still blocks double submission.
  pageshow({ persisted: true });
  assert.equal(button.disabled, false);
  assert.equal(label.hidden, false);
  assert.equal(pending.hidden, true);
  assert.equal(form.attributes.has('aria-busy'), false);
});
