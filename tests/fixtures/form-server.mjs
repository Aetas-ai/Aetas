import { spawn } from 'node:child_process';

export async function startFormServer(port, enabled = true) {
  const environment = {
    ...process.env, HOST: '127.0.0.1', PORT: String(port),
    FORM_DELIVERY_ENABLED: String(enabled),
    FORM_CSRF_SECRET: 'mock-csrf-secret-with-at-least-32-characters',
    RESEND_API_KEY: 're_mock_do_not_use_in_production',
    FORM_SENDER_EMAIL: 'forms@notify.aetas.ai', CONTACT_RECIPIENT_EMAIL: 'info@aetas.ai',
    AGI_EMAIL_TEST_MODE: 'mock',
  };
  for (const key of ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'FORM_DELIVERY_URL', 'FORM_DELIVERY_BEARER_TOKEN']) delete environment[key];
  const child = spawn(process.execPath, ['--import', './tests/fixtures/mock-resend.mjs', 'scripts/start-server.mjs'], {
    env: environment, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  });
  const exited = new Promise((resolve) => child.once('exit', resolve));
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Mock backend startup timed out.')), 10_000);
      child.stdout.on('data', (chunk) => {
        if (chunk.toString().includes('[server] listening')) { clearTimeout(timer); resolve(); }
      });
      child.once('error', (error) => { clearTimeout(timer); reject(error); });
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Mock backend failed to start. Run npm run build first.')); });
    });
  } catch (error) {
    child.kill();
    throw error;
  }
  return {
    origin: `http://127.0.0.1:${port}`,
    headers: { 'x-forwarded-host': 'aetas.ai', 'x-forwarded-proto': 'https' },
    async stop() { child.kill(); await exited; },
  };
}
