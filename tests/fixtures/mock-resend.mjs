import { randomUUID } from 'node:crypto';

if (process.env.AGI_EMAIL_TEST_MODE !== 'mock' || process.env.RESEND_API_KEY !== 're_mock_do_not_use_in_production') {
  throw new Error('Email mock must only run with isolated test settings.');
}

// Production integration tests cannot contact an external email service.
globalThis.fetch = async (url, options) => {
  if (String(url) !== 'https://api.resend.com/emails') throw new Error('External fetch blocked by test fixture.');
  const payload = JSON.parse(options.body);
  if (payload.from !== 'AGI Website <forms@notify.aetas.ai>' || payload.to?.[0] !== 'info@aetas.ai'
    || !payload.reply_to || !options.headers['Idempotency-Key']?.startsWith('aetas-form/')) {
    return new Response('{}', { status: 400 });
  }
  if (payload.text.includes('PROVIDER_REJECT_TEST')) return new Response('{}', { status: 503 });
  return new Response(JSON.stringify({ id: randomUUID() }), { status: 200 });
};
