import assert from 'node:assert/strict';
import test from 'node:test';
import { buildEmailHtml, buildEmailText, sendResendEmail } from '../src/lib/server/email-delivery.ts';

const configuration = {
  apiKey: 're_test_not_a_real_key',
  senderEmail: 'forms@notify.aetas.ai',
  recipientEmail: 'info@aetas.ai',
};
const submission = {
  formType: 'contact', subject: 'New AGI contact request',
  reference: '815a209d-61e3-4a38-a2cd-8468d3093594', receivedAt: '2026-10-12T15:00:00.000Z',
  labels: { 'first-name': 'First name', 'last-name': 'Last name', email: 'Work email', company: 'Company', intent: 'Operational focus area', message: 'Requirements' },
  values: { 'first-name': 'Test', 'last-name': 'Visitor', email: 'visitor@example.com', company: 'Test Company', intent: 'security', message: 'Please discuss our cybersecurity requirements.' },
};

test('sends one internal Resend notification with fixed routing and visitor Reply-To', async () => {
  const calls = [];
  assert.deepEqual(await sendResendEmail(configuration, { ...submission, values: {
    ...submission.values, to: 'attacker@example.com', sender: 'attacker@example.com',
  } }, async (url, options) => {
    calls.push({ url, options, payload: JSON.parse(options.body) });
    return new Response(JSON.stringify({ id: 'test-message' }), { status: 200 });
  }), { ok: true });
  assert.equal(calls.length, 1);
  const { url, options, payload } = calls[0];
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(options.redirect, 'error');
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(options.headers.Authorization, `Bearer ${configuration.apiKey}`);
  assert.equal(options.headers['Idempotency-Key'], `aetas-form/${submission.reference}`);
  assert.equal(payload.from, `AGI Website <${configuration.senderEmail}>`);
  assert.deepEqual(payload.to, [configuration.recipientEmail]);
  assert.equal(payload.reply_to, 'visitor@example.com');
  assert.match(payload.subject, /Cybersecurity/);
  assert.ok(payload.subject.includes(submission.reference));
  for (const value of [submission.reference, submission.receivedAt, submission.values.company, submission.values.message]) {
    assert.ok(payload.text.includes(value));
    assert.ok(payload.html.includes(value));
  }
});

test('encodes every user-controlled HTML field and preserves a plain-text version', () => {
  const malicious = { ...submission, subject: '<script>subject</script>', labels: { message: '<img src=x onerror=alert(1)>' }, values: { message: '<script>alert("x")</script> & test' } };
  const html = buildEmailHtml(malicious);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&quot;x&quot;/);
  assert.match(html, /&amp; test/);
  assert.ok(buildEmailText(malicious).includes(malicious.values.message));
});

test('fails closed without sender, recipient, API key, or a safe Reply-To', async () => {
  let calls = 0;
  const fetcher = async () => { calls++; return new Response(JSON.stringify({ id: 'test-message' }), { status: 200 }); };
  for (const key of ['apiKey', 'senderEmail', 'recipientEmail']) {
    assert.deepEqual(await sendResendEmail({ ...configuration, [key]: '' }, submission, fetcher), { ok: false, reason: 'config' });
  }
  assert.equal((await sendResendEmail({ ...configuration, apiKey: 'xsmtpsib-smtp-key' }, submission, fetcher)).reason, 'config');
  assert.equal((await sendResendEmail(configuration, { ...submission, values: { ...submission.values, email: 'visitor@example.com\r\nBcc: attacker@example.com' } }, fetcher)).reason, 'config');
  assert.equal(calls, 0);
});

test('rejects provider errors without reading or logging sensitive response bodies', async (t) => {
  const logs = [];
  t.mock.method(console, 'error', (...args) => logs.push(args));
  for (const status of [201, 400, 401, 403, 429, 500, 503]) {
    let attempts = 0;
    assert.deepEqual(await sendResendEmail(configuration, submission, async () => {
      attempts++;
      return { status, text: () => { throw new Error('must not read provider body'); } };
    }), { ok: false, reason: 'http', status });
    assert.equal(attempts, 1);
  }
  assert.deepEqual(logs, []);
});

test('network failures and ambiguous timeouts do not retry or fail over', async (t) => {
  const logs = [];
  t.mock.method(console, 'error', (...args) => logs.push(args));
  for (const [error, reason] of [[new Error('secret network details'), 'network'], [new DOMException('sensitive timeout details', 'TimeoutError'), 'timeout']]) {
    let attempts = 0;
    assert.deepEqual(await sendResendEmail(configuration, submission, async () => { attempts++; throw error; }), { ok: false, reason });
    assert.equal(attempts, 1);
  }
  assert.deepEqual(logs, []);
});

test('AI consultation and readiness brief notifications share the routing and safe templates', async () => {
  for (const formType of ['ai-consultation', 'readiness-brief']) {
    const data = { ...submission, formType, values: { ...submission.values, intent: undefined, interest: 'global' } };
    assert.deepEqual(await sendResendEmail(configuration, data, async (_url, options) => {
      const payload = JSON.parse(options.body);
      assert.deepEqual(payload.to, [configuration.recipientEmail]);
      assert.ok(payload.subject.includes('Managed IT'));
      assert.deepEqual(payload.tags, [{ name: 'source', value: 'aetas-website' }, { name: 'form', value: formType }]);
      return new Response(JSON.stringify({ id: 'test-message' }), { status: 200 });
    }), { ok: true });
  }
});

test('does not report success for malformed or missing provider message IDs', async () => {
  for (const body of ['not-json', '{}', '{"id":null}', '{"id":42}', '{"id":""}', '{"id":"   "}']) {
    assert.deepEqual(await sendResendEmail(configuration, submission, async () => new Response(body, { status: 200 })), { ok: false, reason: 'invalid-response', status: 200 });
  }
});

test('notifications use the same choice wording visitors saw in each form', async () => {
  const subjects = [];
  const fetcher = async (_url, options) => {
    const payload = JSON.parse(options.body);
    subjects.push(payload.subject);
    assert.ok(payload.text.includes(subjects.length === 1 ? 'Primary interest: Managed IT / Business Processes / Help Desk' : 'Operational focus area: General inquiry'));
    return new Response(JSON.stringify({ id: 'test-message' }), { status: 200 });
  };
  const brief = { ...submission, formType: 'readiness-brief', labels: { email: 'Work email', interest: 'Primary interest' }, values: { email: 'visitor@example.com', interest: 'global' } };
  assert.deepEqual(await sendResendEmail(configuration, brief, fetcher), { ok: true });
  assert.deepEqual(await sendResendEmail(configuration, { ...submission, values: { ...submission.values, intent: 'general' } }, fetcher), { ok: true });
  assert.ok(subjects[0].includes('— Managed IT / Business Processes / Help Desk ['));
  assert.ok(subjects[1].includes('— General inquiry ['));
});
