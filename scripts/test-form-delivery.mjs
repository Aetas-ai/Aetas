import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { invalidEnvironmentVariables } from './server-runtime.mjs';

// Explicit opt-in: one real notification to the server-configured recipient.
const args = process.argv.slice(2);
if (!args.includes('--send')) {
  console.info('After approval and DNS verification: node scripts/test-form-delivery.mjs --send --recipient=EXPECTED_INBOX --reply-to=YOUR_EMAIL');
  process.exit(0);
}
try {
  process.loadEnvFile();
} catch {
  console.error('[test] local_env_unavailable');
  process.exit(1);
}

const testMailbox = args.find((value) => value.startsWith('--recipient='))?.slice('--recipient='.length);
if (!testMailbox || process.env.CONTACT_RECIPIENT_EMAIL !== testMailbox || !process.env.RESEND_API_KEY
  || process.env.FORM_DELIVERY_ENABLED !== 'true'
  || invalidEnvironmentVariables(process.env).length > 0) {
  console.error('[test] Enable valid Resend settings and explicitly confirm the configured recipient with --recipient.');
  process.exit(1);
}
const replyTo = args.find((value) => value.startsWith('--reply-to='))?.slice('--reply-to='.length) ?? testMailbox;
if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(replyTo)) {
  console.error('[test] invalid_reply_to');
  process.exit(1);
}

const origin = 'http://127.0.0.1:4321';
const marker = randomUUID();
try {
  const csrfResponse = await fetch(`${origin}/api/forms/csrf`, { signal: AbortSignal.timeout(15_000) });
  const csrf = await csrfResponse.json();
  const cookie = csrfResponse.headers.get('set-cookie')?.split(';', 1)[0];
  if (!csrfResponse.ok || !csrf.ok || !csrf.token || !cookie) throw new Error('csrf-unavailable');
  await delay(1_600);
  const response = await fetch(`${origin}/api/forms/contact`, {
    method: 'POST',
    headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'csrf-token': csrf.token, website: '',
      'first-name': 'AGI', 'last-name': 'Delivery Test',
      email: replyTo, company: 'Aetas Global Innovation', intent: 'general',
      message: `Controlled AGI website email test. Marker: ${marker}. Check all fields, reference, timestamp and Reply-To. This is not a customer inquiry.`,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const result = await response.json();
  console.info(JSON.stringify({
    event: result.ok ? 'test_provider_accepted' : 'test_submission_failed',
    marker, status: response.status, redirect: result.redirect ?? null,
  }));
  if (!response.ok || !result.ok) process.exitCode = 1;
  else console.info('Check the recipient inbox/spam and Resend delivery logs. Acceptance is not proof of inbox delivery.');
} catch {
  console.error('[test] local_request_failed; no automatic retry');
  process.exitCode = 1;
}
