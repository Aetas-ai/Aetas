import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

// Real-browser checks with intercepted form responses; no email is sent.
const profile = await mkdtemp(join(tmpdir(), 'agi-form-browser-'));
// Set BROWSER_PATH to use another Chromium-based browser or install location.
const browserPath = process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
// Astro dev may listen only on IPv6 localhost, so avoid hardcoding 127.0.0.1.
const siteOrigin = process.env.SITE_ORIGIN || 'http://localhost:4321';
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=9223', `--user-data-dir=${profile}`,
], { windowsHide: true, stdio: 'ignore' });
let socket;
const callbacks = new Map();
let sequence = 0;
let sessionId;

async function until(check, label) {
  const end = Date.now() + 15_000;
  while (Date.now() < end) {
    try { if (await check()) return; } catch { /* Navigation may replace the execution context. */ }
    await delay(100);
  }
  throw new Error(`Browser check timed out: ${label}`);
}
function command(method, params = {}, session = sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { callbacks.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15_000);
    callbacks.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(session ? { sessionId: session } : {}) }));
  });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error('Browser evaluation failed.');
  return result.result.value;
}
const mock = String.raw`
  (() => {
    const originalFetch = window.fetch.bind(window);
    window.__formTestMode = 'pending';
    window.__formPosts = 0;
    window.fetch = async (url, options) => {
      const pathname = new URL(typeof url === 'string' ? url : url.url, location.href).pathname;
      if (pathname === '/api/forms/csrf') return new Response(JSON.stringify({ok:true,token:'browser-mock-token'}), {status:200});
      if (pathname.startsWith('/api/forms/')) {
        window.__formPosts++;
        if (window.__formTestMode === 'accepted') return new Response(JSON.stringify({ok:true,redirect:'/contact/thanks'}), {status:200});
        return new Promise(resolve => { window.__finishFormTest = () => resolve(new Response(JSON.stringify({ok:false,message:'Please try again later.'}), {status:503})); });
      }
      return originalFetch(url, options);
    };
  })();
`;
const fill = String.raw`
  (() => {
    const values = {'first-name':'Browser','last-name':'Test',email:'visitor@example.com',company:'Example',intent:'general',message:'Controlled browser test of website form loading feedback.'};
    const form = document.querySelector('form[data-secure-form]');
    for (const [name,value] of Object.entries(values)) form.elements.namedItem(name).value=value;
    form.querySelector('button[type=submit]').scrollIntoView({block:'center'});
    form.requestSubmit();
  })();
`;
const state = String.raw`
  (() => {
    const form=document.querySelector('form[data-secure-form]');
    const button=form.querySelector('button[type=submit]');
    const pending=button.querySelector('[data-submit-pending]');
    const spinner=button.querySelector('.form-submit-spinner');
    return {disabled:button.disabled,pending:!pending.hidden,labelHidden:button.querySelector('[data-submit-label]').hidden,
      busy:form.getAttribute('aria-busy'),text:pending.textContent.trim(),
      message:form.elements.namedItem('message').value,status:form.querySelector('[data-form-status]').textContent,
      overflow:document.documentElement.scrollWidth>innerWidth,
      buttonWidth:button.getBoundingClientRect().width,formWidth:form.getBoundingClientRect().width,
      animation:getComputedStyle(spinner).animationName,posts:window.__formPosts};
  })();
`;
try {
  let version;
  await until(async () => { version = await fetch('http://127.0.0.1:9223/json/version').then(r => r.json()); return Boolean(version.webSocketDebuggerUrl); }, 'browser startup');
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const callback = callbacks.get(message.id);
    if (!callback) return;
    clearTimeout(callback.timer);
    callbacks.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result);
  });
  const { targetId } = await command('Target.createTarget', { url: 'about:blank' }, null);
  ({ sessionId } = await command('Target.attachToTarget', { targetId, flatten: true }, null));
  await command('Page.enable');
  await command('Runtime.enable');
  await command('Page.addScriptToEvaluateOnNewDocument', { source: mock });
  await mkdir('.astro/form-checks', { recursive: true });
  for (const width of [390, 768, 1440]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 });
    await command('Page.navigate', { url: `${siteOrigin}/contact` });
    await until(() => evaluate("document.querySelector('form[data-secure-form]')?.elements.namedItem('csrf-token').value === 'browser-mock-token'"), 'form initialization');
    await until(() => evaluate("document.readyState === 'complete' && document.getElementById('site-loading-overlay')?.hidden === true"), 'initial page loading');
    await evaluate(fill);
    await until(() => evaluate('typeof window.__finishFormTest === "function"'), 'pending request');
    const pending = await evaluate(state);
    assert.equal(pending.disabled, true);
    assert.equal(pending.pending, true);
    assert.equal(pending.labelHidden, true);
    assert.equal(pending.busy, 'true');
    assert.match(pending.text, /Sending/);
    assert.equal(pending.overflow, false);
    assert.ok(Math.abs(pending.buttonWidth - pending.formWidth) < 2);
    await evaluate("document.querySelector('form[data-secure-form]').requestSubmit()");
    assert.equal(await evaluate('window.__formPosts'), 1);
    await evaluate("document.querySelector('button[type=submit]').scrollIntoView({block:'center',behavior:'instant'})");
    await until(() => evaluate("document.querySelector('button[type=submit]').getBoundingClientRect().bottom <= innerHeight"), 'visible submit button');
    const screenshot = await command('Page.captureScreenshot', { format: 'png' });
    await writeFile(`.astro/form-checks/contact-loading-${width}.png`, Buffer.from(screenshot.data, 'base64'));
    await evaluate('window.__finishFormTest()');
    await until(async () => !(await evaluate(state)).disabled, 'failure recovery');
    const recovered = await evaluate(state);
    assert.equal(recovered.pending, false);
    assert.equal(recovered.labelHidden, false);
    assert.equal(recovered.message, pending.message);
    assert.match(recovered.status, /try again/);
    console.info(`Browser ${width}px: spinner, disabled button, no double send, error recovery, retained fields and no overflow passed.`);
  }
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate(fill);
  assert.equal((await evaluate(state)).animation, 'none');
  await evaluate('window.__finishFormTest()');
  await until(async () => !(await evaluate(state)).disabled, 'reduced-motion recovery');
  await evaluate("window.__formTestMode='accepted'; document.querySelector('form[data-secure-form]').requestSubmit()");
  await until(() => evaluate("location.pathname === '/contact/thanks' && document.querySelector('h1')?.textContent.includes('Thank you')"), 'thank-you navigation');
  console.info('Reduced-motion and thank-you navigation passed. All provider responses were mocked; no email sent.');
} finally {
  socket?.close();
  for (const callback of callbacks.values()) clearTimeout(callback.timer);
  browser.kill();
  // The browser may hold profile files briefly after exit; cleanup is best effort.
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
}
