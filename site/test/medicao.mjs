/* =====================================================================
   TESTE DA MEDIÇÃO DO SITE
   Roda o site de verdade num navegador e confere três coisas:

     1. com os códigos VAZIOS no dados.js, o site não baixa nem envia nada
     2. com os códigos preenchidos, Analytics e Pixel carregam e os eventos
        de WhatsApp e de formulário saem, com o botão de origem junto
     3. o campo isca anti-robô continua invisível MESMO SEM CSS NENHUM

   Rodar:  node site/test/medicao.mjs
   Não toca em nada publicado: sobe um servidor local e serve a pasta site/.
   ===================================================================== */
import { createRequire } from 'module';
const require_ = createRequire(import.meta.url);

/* O Playwright vem instalado no ambiente, mas não dentro deste projeto, então
   não dá para só "import playwright". Procuro nos lugares conhecidos. */
let chromium;
for (const base of ['/opt/node22/lib/node_modules', '/opt/node-tools/node_modules', process.cwd()]) {
  try { ({ chromium } = require_(require_.resolve('playwright', { paths: [base] }))); break; }
  catch (e) { /* tenta o próximo */ }
}
if (!chromium) {
  console.error('Playwright não encontrado neste ambiente. Teste não rodou.');
  process.exit(2);
}
import http from 'http';
import fs from 'fs';
import path from 'path';

const RAIZ = '/home/user/Andre-Tattoo-Skill/site';
const TIPOS = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript',
                '.webp':'image/webp', '.png':'image/png', '.xml':'application/xml',
                '.mp4':'video/mp4', '.txt':'text/plain' };

// servidor local; permite injetar um dados.js alterado
let patchDados = null;
const srv = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  if (u === '/js/dados.js' && patchDados) {
    res.writeHead(200, {'Content-Type':'application/javascript'});
    return res.end(patchDados);
  }
  const f = path.join(RAIZ, u);
  if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end('nao achei');
  }
  res.writeHead(200, {'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => srv.listen(0, r));
const BASE = 'http://127.0.0.1:' + srv.address().port;

const falhas = [];
const ok = m => console.log('  ok   ' + m);
const mal = m => { falhas.push(m); console.log('  FALHA ' + m); };

async function abrir(browser) {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  const externos = [], erros = [];
  pg.on('request', r => { const h = new URL(r.url()).hostname;
    if (h !== '127.0.0.1') externos.push(h); });
  pg.on('pageerror', e => erros.push(String(e)));
  // bloqueia saida real para googletagmanager/facebook: so queremos saber se PEDIU
  await pg.route('**://*.googletagmanager.com/**', r => r.fulfill({status:200, body:'window.__ga_carregou=1;'}));
  await pg.route('**://connect.facebook.net/**',   r => r.fulfill({status:200, body:'window.__px_carregou=1;'}));
  return { ctx, pg, externos, erros };
}

const browser = await chromium.launch();

// ---------------------------------------------------------------- CENARIO 1
console.log('\n1) CODIGOS VAZIOS: o site nao pode baixar nem enviar nada');
{
  /* Zera os codigos de proposito: o teste tem que valer tambem depois que o
     Andre colar os dele de verdade no dados.js. */
  const orig0 = fs.readFileSync(path.join(RAIZ,'js/dados.js'),'utf8');
  patchDados = orig0.replace(/ga4:\s*"[^"]*"/, 'ga4:   ""')
                    .replace(/pixel:\s*"[^"]*"/, 'pixel: ""');

  const { ctx, pg, externos, erros } = await abrir(browser);
  await pg.goto(BASE + '/index.html', { waitUntil: 'networkidle' });

  const sujos = externos.filter(h => /googletagmanager|facebook|google-analytics/.test(h));
  sujos.length === 0 ? ok('nenhum pedido a Google/Meta')
                     : mal('pediu para: ' + [...new Set(sujos)].join(', '));

  const st = await pg.evaluate(() => ({ ga: !!window.gtag, px: !!window.fbq, dl: !!window.dataLayer }));
  (!st.ga && !st.px && !st.dl) ? ok('gtag, fbq e dataLayer nao existem')
                               : mal('criou objeto de medicao sem codigo: ' + JSON.stringify(st));

  // o site tem que continuar inteiro
  const g = await pg.locator('.work').count();
  g === 12 ? ok('galeria montou as 12 pecas') : mal('galeria com ' + g + ' pecas');
  const f = await pg.locator('#form').count();
  f === 1 ? ok('formulario presente') : mal('formulario sumiu');

  // clicar no WhatsApp nao pode estourar erro
  await pg.evaluate(() => {
    document.addEventListener('click', e => e.preventDefault());
    const a = document.querySelector('a[href*="wa.me"]');
    a.removeAttribute('target');
    a.click();
  });
  erros.length === 0 ? ok('clique no WhatsApp sem erro de JS')
                     : mal('erro de JS: ' + erros[0]);
  await ctx.close();
  patchDados = null;
}

// ---------------------------------------------------------------- CENARIO 2
console.log('\n2) CODIGOS PREENCHIDOS: tem que carregar e marcar os eventos');
{
  const orig = fs.readFileSync(path.join(RAIZ,'js/dados.js'),'utf8');
  patchDados = orig.replace(/ga4:\s*"[^"]*"/,   'ga4:   "G-TESTE12345"')
                   .replace(/pixel:\s*"[^"]*"/, 'pixel: "111122223333444"');
  if (!/G-TESTE12345/.test(patchDados) || !/111122223333444/.test(patchDados))
    mal('nao consegui injetar os codigos de teste');

  const { ctx, pg, externos, erros } = await abrir(browser);
  const eventos = [];
  await pg.addInitScript(() => { window.__ev = []; });
  await pg.goto(BASE + '/index.html', { waitUntil: 'networkidle' });

  externos.some(h => /googletagmanager/.test(h)) ? ok('pediu o Google Analytics')
                                                 : mal('nao pediu o Google Analytics');
  externos.some(h => /connect\.facebook\.net/.test(h)) ? ok('pediu o Pixel da Meta')
                                                       : mal('nao pediu o Pixel da Meta');

  // espiona as chamadas
  await pg.evaluate(() => {
    window.__ev = [];
    window.gtag = function(){ window.__ev.push(['ga', [].slice.call(arguments)]); };
    window.fbq  = function(){ window.__ev.push(['px', [].slice.call(arguments)]); };
  });

  // clique no WhatsApp
  await pg.evaluate(() => {
    document.addEventListener('click', e => e.preventDefault());
    const a = document.querySelector('a[href*="wa.me"][data-wa]');
    a.removeAttribute('target');
    a.click();
  });
  let ev = await pg.evaluate(() => window.__ev);
  const temWaGa = ev.some(x => x[0]==='ga' && x[1][1]==='whatsapp');
  const temWaPx = ev.some(x => x[0]==='px' && x[1][1]==='Contact');
  temWaGa ? ok('WhatsApp marcou no Analytics') : mal('WhatsApp nao marcou no Analytics');
  temWaPx ? ok('WhatsApp marcou no Pixel')     : mal('WhatsApp nao marcou no Pixel');
  const botao = ev.find(x => x[0]==='ga' && x[1][1]==='whatsapp');
  botao && botao[1][2] && botao[1][2].botao
    ? ok('registrou de qual botao saiu: "' + botao[1][2].botao + '"')
    : mal('nao registrou o botao de origem');

  // formulario
  await pg.evaluate(() => {
    const f = document.getElementById('form');
    f.elements.nome.value     = 'Teste';
    f.elements.whatsapp.value = '(11) 98271-3543';
    f.elements.ideia.value    = 'leao realismo antebraco';
    f.elements.idade.checked  = true;
    window.__ev = [];
    window.open = () => ({ opener: null });
    f.requestSubmit();
  });
  await pg.waitForTimeout(400);
  const msgErro = await pg.locator('#formErro').textContent();
  msgErro && msgErro.trim() ? mal('o formulario recusou: "' + msgErro.trim() + '"')
                            : ok('formulario aceitou os dados');
  ev = await pg.evaluate(() => window.__ev);
  ev.some(x => x[0]==='ga' && x[1][1]==='generate_lead') ? ok('formulario marcou no Analytics')
                                                         : mal('formulario nao marcou no Analytics');
  ev.some(x => x[0]==='px' && x[1][1]==='Lead') ? ok('formulario marcou no Pixel')
                                                : mal('formulario nao marcou no Pixel');

  erros.length === 0 ? ok('nenhum erro de JS na pagina') : mal('erro de JS: ' + erros[0]);
  await ctx.close();
  patchDados = null;
}

// ---------------------------------------------------------------- CENARIO 3
console.log('\n3) CAMPO ISCA: nao pode aparecer para ninguem');
{
  const { ctx, pg } = await abrir(browser);
  for (const pagina of ['/index.html', '/clube-15.html']) {
    await pg.goto(BASE + pagina, { waitUntil: 'domcontentloaded' });
    // mede SEM a folha de estilo, que é o cenario que quebrou no celular do Andre
    await pg.evaluate(() => {
      document.querySelectorAll('link[rel=stylesheet]').forEach(l => l.remove());
      document.querySelectorAll('style').forEach(l => l.remove());
    });
    await pg.waitForTimeout(150);
    const cx = await pg.locator('input[name=bot-field]').boundingBox();
    const visivel = cx && cx.x > -1000 && cx.y > -1000 && cx.width > 10;
    !visivel ? ok('sem CSS nenhum, segue escondido em ' + pagina)
             : mal('APARECE sem CSS em ' + pagina + ' ' + JSON.stringify(cx));
  }
  await ctx.close();
}

// ---------------------------------------------------------------- CENARIO 4
console.log('\n4) O QUE ESTA PUBLICADO DE VERDADE no dados.js');
{
  const real = fs.readFileSync(path.join(RAIZ,'js/dados.js'),'utf8');
  const vGa = (real.match(/ga4:\s*"([^"]*)"/)   || [,''])[1].trim();
  const vPx = (real.match(/pixel:\s*"([^"]*)"/) || [,''])[1].trim();
  console.log('   ga4="' + vGa + '"  pixel="' + vPx + '"');

  if (vGa && !/^G-[A-Z0-9]{6,}$/i.test(vGa)) mal('o codigo do GA4 nao tem a cara de um G-: "' + vGa + '"');
  if (vPx && !/^[0-9]{10,20}$/.test(vPx))    mal('o codigo do Pixel nao e so digitos: "' + vPx + '"');

  const { ctx, pg, externos, erros } = await abrir(browser);
  await pg.goto(BASE + '/index.html', { waitUntil: 'networkidle' });

  const pediuGa = externos.some(h => /googletagmanager/.test(h));
  const pediuPx = externos.some(h => /connect\.facebook\.net/.test(h));

  (vGa ? pediuGa : !pediuGa) ? ok(vGa ? 'Analytics ligado e carregando' : 'Analytics vazio e desligado')
                             : mal(vGa ? 'tem codigo de GA4 mas nao carregou' : 'sem codigo de GA4 e mesmo assim carregou');
  (vPx ? pediuPx : !pediuPx) ? ok(vPx ? 'Pixel ligado e carregando' : 'Pixel vazio e desligado')
                             : mal(vPx ? 'tem codigo de Pixel mas nao carregou' : 'sem codigo de Pixel e mesmo assim carregou');

  erros.length === 0 ? ok('nenhum erro de JS') : mal('erro de JS: ' + erros[0]);
  await ctx.close();
}

await browser.close();
srv.close();
console.log('\n' + (falhas.length ? 'FALHAS: ' + falhas.length : 'TUDO PASSOU'));
process.exit(falhas.length ? 1 : 0);
