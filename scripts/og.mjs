// Genera public/og.png (1200 × 630) una sola vez, sin dependencias: Node 22 + Chrome por DevTools (spec 007).
// Uso: pnpm og   (ruta de Chrome configurable con CHROME_PATH)
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ANCHO = 1200;
const ALTO = 630;
const SALIDA = fileURLToPath(new URL('../public/og.png', import.meta.url));
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Carriles mínimos: solo cajas y conectores, sin texto.
const fila = (y, color, relleno, discontinuo) => {
  const xs = [0, 190, 380];
  const cajas = xs.map((x) => `<rect x="${x}" y="${y}" width="150" height="44" rx="6" fill="${relleno}" stroke="${color}" stroke-width="2" />`);
  const lineas = xs.slice(1).map((x) => `<line x1="${x - 40}" y1="${y + 22}" x2="${x}" y2="${y + 22}" stroke="${color}" stroke-width="2"${discontinuo ? ' stroke-dasharray="5 5"' : ''} />`);
  return lineas.join('') + cajas.join('');
};

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@700&display=block">
<style>
  html,body{margin:0;width:${ANCHO}px;height:${ALTO}px;overflow:hidden}
  body{background:#0B1220;color:#E8ECF2;position:relative;
    background-image:linear-gradient(#24314A 1px,transparent 1px),linear-gradient(90deg,#24314A 1px,transparent 1px);
    background-size:48px 48px;background-position:-1px -1px}
  body::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 40% 45%,rgba(11,18,32,.55) 0%,#0B1220 78%)}
  main{position:relative;z-index:1;height:100%;box-sizing:border-box;padding:56px 72px;display:flex;flex-direction:column}
  .top,.url{font-family:"IBM Plex Mono",monospace;font-size:36px;color:#93A0B4}
  .top b{color:#E8ECF2;font-weight:500}
  h1{font-family:"IBM Plex Sans Condensed",sans-serif;font-weight:700;font-size:96px;line-height:1.02;letter-spacing:-.01em;margin:42px 0 0}
  .ai{color:#8FA8FF} .det{color:#D9B66F}
  .pie{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end}
  .url{color:#D9B66F}
</style></head>
<body><main>
  <div class="top"><b>Mario Zarta</b> · Arquitecto de soluciones de IA</div>
  <h1>El modelo <span class="ai">conversa</span>.<br>El código <span class="det">decide</span>.</h1>
  <div class="pie">
    <div class="url">mariozarta.pages.dev</div>
    <svg width="530" height="128" viewBox="0 0 530 128" aria-hidden="true">
      ${fila(4, '#8FA8FF', '#1E2846', true)}
      ${fila(80, '#D9B66F', '#3A321F', false)}
    </svg>
  </div>
</main></body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const plantilla = join(dir, 'og.html');
writeFileSync(plantilla, html);
// Puerto aleatorio (--remote-debugging-port=0): Chrome escribe el que eligió en DevToolsActivePort del perfil temporal.
const perfil = join(dir, 'perfil');
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0',
  `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' });
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let puerto;

try {
  for (let i = 0; i < 50 && !puerto; i++) {
    // La primera línea del archivo es el puerto.
    try { puerto = readFileSync(join(perfil, 'DevToolsActivePort'), 'utf8').trim().split(/\s+/)[0]; } catch { /* aún no existe */ }
    if (!puerto) await esperar(200);
  }
  if (!puerto) throw new Error(`No se pudo abrir Chrome en ${CHROME}`);
  let pagina;
  for (let i = 0; i < 50 && !pagina; i++) {
    try { pagina = (await (await fetch(`http://127.0.0.1:${puerto}/json`)).json()).find((t) => t.type === 'page'); }
    catch { await esperar(200); }
  }
  if (!pagina) throw new Error('Chrome no expuso ninguna página');
  const ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pend = new Map();
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); pend.get(m.id)?.(m); pend.delete(m.id); });
  const cmd = (method, params = {}) => new Promise((r) => { const n = ++id; pend.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

  await cmd('Emulation.setDeviceMetricsOverride', { width: ANCHO, height: ALTO, deviceScaleFactor: 1, mobile: false });
  await cmd('Page.navigate', { url: pathToFileURL(plantilla).href });
  await esperar(1000);
  const fuentes = await cmd('Runtime.evaluate', {
    expression: `document.fonts.ready.then(() => ['IBM Plex Mono', 'IBM Plex Sans Condensed'].every((f) => document.fonts.check('700 40px "' + f + '"') || document.fonts.check('400 40px "' + f + '"')))`,
    awaitPromise: true, returnByValue: true,
  });
  if (!fuentes.result.result.value) throw new Error('Las fuentes IBM Plex no cargaron: revisa la conexión');
  const r = await cmd('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: ANCHO, height: ALTO, scale: 1 } });
  writeFileSync(SALIDA, Buffer.from(r.result.data, 'base64'));
  ws.close();
  console.log(`og.png: ${ANCHO}×${ALTO}, ${(statSync(SALIDA).size / 1024).toFixed(1)} KB`);
} finally {
  // Cierra el navegador entero (también sus procesos hijos, que retienen el perfil temporal en Windows).
  const salida = new Promise((r) => chrome.once('exit', r));
  try {
    const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${puerto}/json/version`)).json();
    const nav = new WebSocket(webSocketDebuggerUrl);
    await new Promise((r) => nav.addEventListener('open', r, { once: true }));
    nav.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
  } catch { chrome.kill(); }
  await Promise.race([salida, esperar(5000)]);
  try { rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); }
  catch { console.warn(`Aviso: no se pudo borrar la carpeta temporal ${dir}`); }
}
