// Generates the 1200x630 social share images in public/og/ from a code-built
// template (brand background, approved page title, single brand accent, AGI logo).
// Run manually after changing a page title: `npm run og:generate`.
// Uses headless Edge over CDP, the same approach as check-form-browser.mjs.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'public', 'og');
const browserPath = process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = (path) => pathToFileURL(join(root, path)).href;

// Duotone: neutrals plus the single brand accent (src/styles/global.css).
const accent = '#7c80f0';

// Titles are the approved page headings (HANDOFF.md / page heroes).
const pages = [
  { key: 'default', label: 'Aetas Global Innovation', title: 'AI & Automation, Cybersecurity, and Managed IT.' },
  { key: 'home', label: 'Aetas Global Innovation', title: 'Make complex operations easier to run.' },
  { key: 'ai', label: 'AI & Automation', title: 'Put Human Led AI to work inside your Business Processes.' },
  { key: 'security', label: 'Cybersecurity', title: 'Detect threats. Test defenses. Strengthen resilience.' },
  { key: 'managed-it', label: 'Managed IT', title: 'Keep IT support and outsourced operations moving.' },
  { key: 'about', label: 'About AGI', title: 'Specialized expertise for intelligent, secure operations.' },
  { key: 'resources', label: 'Insights and resources', title: 'Practical thinking for modern operations.' },
  { key: 'contact', label: 'Contact AGI', title: 'Start with the AGI service that fits your need.' },
  { key: 'brief', label: 'AGI Operations Readiness Brief', title: 'A practical starting point for your next operations decision.' },
  { key: 'work', label: 'Client work', title: 'Case studies are being prepared for publication.' },
  { key: 'careers', label: 'Careers at AGI', title: 'Build the systems behind modern service delivery.' },
];

const escapeHtml = (value) => value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

function template(page) {
  const line = `background:${accent}`;
  const glow = accent;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Inter";src:url("${fileUrl('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}") format("woff2");font-weight:100 900}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{position:relative;overflow:hidden;background:#08090a;color:#fff;font-family:Inter,sans-serif;padding:72px 80px}
.glow{position:absolute;inset:0;background:radial-gradient(700px 420px at 88% 18%,${glow}30,transparent 70%),radial-gradient(500px 300px at 0% 100%,${glow}14,transparent 70%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 70% 20%,#000,transparent 75%)}
.content{position:relative;display:flex;height:100%;flex-direction:column}
.logo{height:64px;width:auto;object-fit:contain;object-position:left}
.label{margin-top:auto;display:flex;align-items:center;gap:14px;color:#d0d3d8;font-size:22px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.label i{width:12px;height:12px;border-radius:999px;${line}}
h1{margin-top:22px;max-width:980px;font-family:Inter,sans-serif;font-size:70px;font-weight:600;line-height:1.04;letter-spacing:-.045em;background:linear-gradient(180deg,#f7f8f8 40%,rgba(247,248,248,.64));-webkit-background-clip:text;background-clip:text;color:transparent}
.bar{position:absolute;left:0;right:0;bottom:0;height:8px;${line}}
.url{position:absolute;right:80px;top:84px;color:#8a8f98;font-size:22px;font-weight:500}
</style></head><body><div class="glow"></div><div class="grid"></div>
<div class="content"><img class="logo" src="${fileUrl('public/aetasBrand.webp')}" alt="">
<p class="label"><i></i>${escapeHtml(page.label)}</p><h1>${escapeHtml(page.title)}</h1></div>
<span class="url">aetas.ai</span><div class="bar"></div></body></html>`;
}

const work = await mkdtemp(join(tmpdir(), 'agi-og-'));
const port = 9335;
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
  '--allow-file-access-from-files', `--remote-debugging-port=${port}`, `--user-data-dir=${join(work, 'profile')}`,
], { windowsHide: true, stdio: 'ignore' });

let socket;
let sequence = 0;
let sessionId;
const callbacks = new Map();
const command = (method, params = {}, session = sessionId) => new Promise((resolvePromise, reject) => {
  const id = ++sequence;
  const timer = setTimeout(() => { callbacks.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20_000);
  callbacks.set(id, { resolve: resolvePromise, reject, timer });
  socket.send(JSON.stringify({ id, method, params, ...(session ? { sessionId: session } : {}) }));
});

try {
  let version;
  for (let attempt = 0; attempt < 150 && !version; attempt++) {
    try { version = await fetch(`http://127.0.0.1:${port}/json/version`).then((response) => response.json()); } catch { await delay(100); }
  }
  if (!version) throw new Error('Browser did not start. Set BROWSER_PATH to a Chromium-based browser.');
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => { socket.addEventListener('open', resolveOpen, { once: true }); socket.addEventListener('error', reject, { once: true }); });
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
  await command('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await mkdir(outDir, { recursive: true });

  for (const page of pages) {
    const htmlPath = join(work, `${page.key}.html`);
    await writeFile(htmlPath, template(page), 'utf8');
    await command('Page.navigate', { url: pathToFileURL(htmlPath).href });
    for (let attempt = 0; attempt < 100; attempt++) {
      const { result } = await command('Runtime.evaluate', {
        expression: "document.readyState === 'complete' && document.fonts.status === 'loaded' && [...document.images].every((image) => image.complete)",
        returnByValue: true,
      });
      if (result.value) break;
      await delay(100);
    }
    const { data } = await command('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
    await writeFile(join(outDir, `${page.key}.png`), Buffer.from(data, 'base64'));
    console.log(`og/${page.key}.png`);
  }
} finally {
  socket?.close();
  browser.kill();
  await delay(300);
  await rm(work, { recursive: true, force: true }).catch(() => {});
}
