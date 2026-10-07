// Teste de fumaça do app no Chromium headless, com o simulador de window.claude.
// Uso: NODE_PATH=$(npm root -g) node app/test/smoke.mjs [caminho-do-html]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const html = path.resolve(process.argv[2] || path.join(here, '../dist/caixa-andre-tattoo.html'));
const out = path.join(here, 'out'); fs.mkdirSync(out, { recursive: true });
const mock = fs.readFileSync(path.join(here, 'mock-claude.js'), 'utf8');

const ds = (off = 0) => { const d = new Date(); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); };
const seedScript = `(() => {
  const B = 'data/users/u_test', ds = ${ds.toString()};
  const mk = (m) => m;
  const hoje = ds(0), mes = hoje.slice(0,7);
  window.__mock.seed(B, {
    config: { meta: 20000, inicio:'09:00', fim:'22:00', dias:['seg','ter','qua','qui','sex','sáb'], duracao:3, custosFixos: 3500 },
    l1: { kind:'in', valor:1200, cliente:'Carlos Mendes', descricao:'Leão realismo', tipo:'Sessão', pagamento:'Pix', data:ds(-3), mes, criado:1 },
    l2: { kind:'in', valor:300, cliente:'Marina Alves', descricao:'Fine line', tipo:'Sinal', pagamento:'Pix', data:ds(-2), mes, criado:2 },
    l3: { kind:'out', valor:420, descricao:'Cartuchos e tinta', categoria:'Material', data:ds(-1), mes, criado:3 },
    l4: { kind:'in', valor:900, cliente:'Rafael Souza', descricao:'Urso', tipo:'Sessão', pagamento:'Cartão', data:ds(-40), mes: ds(-40).slice(0,7), criado:4 },
    l5: { kind:'out', valor:3500, descricao:'Aluguel', categoria:'Aluguel', data:ds(-40), mes: ds(-40).slice(0,7), criado:5 }
  });
  window.__mock.seed(B + '/agenda/itens', {
    a1: { cliente:'Marina Alves', tattoo:'Rosa fine line', estilo:'Fine line', data:ds(2), hora:'10:00', valor:600, sinal:100, concluida:false },
    a2: { cliente:'Pedro Lima', tattoo:'Leão braço', estilo:'Realismo P&C', data:ds(5), hora:'09:00', valor:1800, sinal:360, concluida:false },
    a3: { cliente:'Bruno Dias', tattoo:'Fechamento costas', estilo:'Fechamento', data:ds(5), hora:'14:00', valor:4000, sinal:800, concluida:false },
    a4: { cliente:'Carlos Mendes', tattoo:'Leão realismo', estilo:'Realismo P&C', data:ds(-3), hora:'10:00', valor:1200, sinal:0, concluida:true, concluidaEm: Date.now() }
  });
  window.__mock.seed(B + '/materiais/itens', { m1:{nome:'Agulha 5RL', agulha:'5RL', qtd:12, minimo:5, unidade:'unidades'}, m2:{nome:'Luvas', qtd:1, minimo:3, unidade:'caixas'} });
  window.__mock.seed(B + '/orcamentos/itens', { o1:{ cliente:'Julia Prado', ideia:'Leão antebraço', estilo:'Realismo P&C', tamanho:'25 cm', local:'antebraço', valor:1500, etapa:'orcamento', followups:0, criado: Date.now()-5*86400000, atualizado: Date.now()-5*86400000, ultimoContato: ds(-5) } });
  window.__mock.seed(B + '/clientes/itens', { 'carlos mendes': { nome:'Carlos Mendes', nasc: ds(2).slice(5), notas:'Prefere sessões de manhã', indicacao:'Rafael' } });
  window.__mock.seed('aprendizado_sugestoes', { s1:{ titulo:'Perguntar a cor do realismo', regra:'Quando o pedido for realismo sem cor definida, perguntar se é preto e cinza ou colorido.', motivo:'Visto em 3 pedidos', confianca:3, status:'proposta', ts: Date.now() } });
  window.__mock.mcpHandlers['Google Calendar'] = {
    list_events: () => ({ payload: { events: [] } }),
    create_event: () => ({ payload: { id: 'ev' + Math.random().toString(36).slice(2, 8) } }),
    update_event: (a) => ({ payload: { id: a.eventId } })
  };
  window.__mock.mcpHandlers.METRICOOL = {
    getBrandSettings: () => ({ payload: { data: [{ id: 1, label: 't', timezone: 'America/Sao_Paulo', networksData: { instagramData: 't' } }] } }),
    getAnalyticsDataByMetrics: (a) => { const rows = []; for (let i = 0; i < 5; i++) { const r = a.metrics.map((m, j) => String((j + 1) * 10 + i) + '.0'); r.push('2026100' + (i + 1)); rows.push(r); } rows.push(a.metrics.map(() => null).concat(['20261009'])); return { payload: { rows } }; },
    getBestTimeToPostByNetwork: () => ({ payload: { data: [{ dayOfWeek: 4, bestTimesByHour: [{ hourOfDay: 10, value: 6000 }, { hourOfDay: 18, value: 5000 }] }, { dayOfWeek: 5, bestTimesByHour: [{ hourOfDay: 10, value: 6700 }] }] } })
  };
  window.__mock.sampleJson = (input) => JSON.stringify(input).includes('AGENTE DE MÍDIAS')
    ? ({ texto:'Plano da semana pronto.', acoes:[ {tipo:'post', data:'${ds(1)}', hora:'10:00', formato:'Reels', pilar:'Portfólio', ideia:'Leão preto e cinza finalizado', gancho:'Close no olhar', textoTela:'Realismo em preto e cinza', legenda:'Força e fé no mesmo braço.', hashtags:'#realismopretoecinza #tattooleao #tatuagemrealista #tattoosp #andretattoo'} ] })
    : ({ texto:'Olá! Segue a resposta de teste.', acoes:[ {tipo:'orcamento', cliente:'Teste Silva', ideia:'rosa', etapa:'novo'} ] });
})();`;

const results = []; let falhas = 0;
const ok = (nome, cond, extra = '') => { results.push((cond ? 'OK   ' : 'FALHA') + ' ' + nome + (extra ? ' | ' + extra : '')); if (!cond) falhas++; };

const browser = await chromium.launch({ args: ['--no-sandbox'] });
async function run(label, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource|net::/.test(m.text())) errs.push('console: ' + m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.addInitScript(mock);
  await page.addInitScript(`try{localStorage.setItem('andre-resumo','${ds(0)}')}catch(e){}`);
  await page.addInitScript(`window.addEventListener('DOMContentLoaded',()=>{ ${seedScript} });`);
  await page.goto('file://' + html);
  await page.waitForFunction(() => /nuvem/i.test(document.getElementById('sync')?.textContent || ''), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
  ok(label + ': conecta na nuvem simulada', /nuvem/i.test(await page.textContent('#sync')));
  const sx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(label + ': sem rolagem horizontal na Hoje', sx <= 1, 'excesso ' + sx + 'px');
  await page.screenshot({ path: path.join(out, label + '-01-hoje.png') });
  const hoje = await page.textContent('[data-view="hoje"]');
  ok(label + ': Hoje mostra saudação, KPIs e agenda', /André/.test(hoje) && /Sessões/.test(hoje) && /Marina/.test(hoje));
  ok(label + ': alerta de dois trabalhos grandes no mesmo dia', /Dois trabalhos grandes/.test(hoje));
  ok(label + ': alerta de orçamento para retomar', /orçamento para retomar/.test(hoje));
  ok(label + ': alerta de aniversário', /Aniversário/.test(hoje));
  ok(label + ': aviso de ajustes antigos aparece', /Ajustes da casa/.test(hoje) && /Aplicar padrões/.test(hoje));
  await page.click('[data-act="padroesOk"]'); await page.waitForTimeout(400);
  const cfg = await page.evaluate(() => window.__mock.dump('data/users/u_test').find(d => d.id === 'config'));
  ok(label + ': aplicar padrões grava meta, dias e horário', cfg.padraoV === 2 && cfg.meta === 20000 && cfg.dias.length === 6 && cfg.fim === '22:00' && cfg.custosFixos === 3500, JSON.stringify([cfg.meta, cfg.dias.length, cfg.fim, cfg.custosFixos]));
  ok(label + ': aviso some depois de aplicar', !/Ajustes da casa/.test(await page.textContent('#hAlerts')));
  const dotOn = (k) => page.evaluate((x) => !document.getElementById('dot-' + x).hidden, k);
  ok(label + ': pontos de aviso nos três agentes', (await dotOn('vendas')) && (await dotOn('financeiro')) && (await dotOn('midia')));
  await page.click('[data-view="hoje"] [data-act="agente"][data-k="vendas"]'); await page.waitForTimeout(400);
  const chatV = await page.textContent('#chatBody');
  ok(label + ': agente abre mostrando os avisos novos', /Aviso/.test(chatV) && /Julia/.test(chatV), chatV.replace(/\s+/g, ' ').slice(0, 100));
  await page.click('[data-act="closeChat"]'); await page.waitForTimeout(300);
  ok(label + ': ponto some depois de ver, e os outros continuam', !(await dotOn('vendas')) && (await dotOn('financeiro')) && (await dotOn('midia')));
  await page.click('[data-view="hoje"] [data-act="agente"][data-k="vendas"]'); await page.waitForTimeout(300);
  ok(label + ': reabrir não repete o aviso', (chatV.match(/Aviso novo|Avisos de hoje/g) || []).length === 1 && ((await page.textContent('#chatBody')).match(/Aviso novo|Avisos de hoje/g) || []).length === 1);
  await page.click('[data-act="closeChat"]'); await page.waitForTimeout(300);
  ok(label + ': sem WhatsApp/leads/Supabase na tela', !/Leads do WhatsApp|Supabase/i.test(await page.content()));
  // abas
  for (const [tab, re] of [['agenda', /Horários livres/], ['cli', /Clientes|Orçamentos/], ['caixa', /Relatórios/], ['mais', /Backup completo/]]) {
    await page.click('.tab[data-tab="' + tab + '"]'); await page.waitForTimeout(450);
    ok(label + ': aba ' + tab, re.test(await page.textContent('[data-view="' + tab + '"]')));
    await page.screenshot({ path: path.join(out, label + '-02-' + tab + '.png') });
  }
  const rel = await page.textContent('#relBox');
  ok(label + ': relatórios com ponto de equilíbrio', /custos fixos/i.test(rel) && /Gastos por categoria/.test(rel), rel.slice(0, 80).replace(/\s+/g, ' '));
  // Instagram (Metricool)
  await page.click('.tab[data-tab="mais"]'); await page.click('[data-act="openInsta"]'); await page.waitForTimeout(900);
  const ig = await page.textContent('#instaBox');
  ok(label + ': Instagram carrega seguidores, alcance e melhores horários', /Seguidores/.test(ig) && /Alcance/.test(ig) && /sexta, 10h/.test(ig) && /Visitas ao perfil e cliques/.test(ig), ig.replace(/\s+/g,' ').slice(0,110));
  const chamadas = await page.evaluate(() => window.__mock.calls.filter(c => c[0] === 'METRICOOL').map(c => c[1]));
  ok(label + ': usa só ferramentas de leitura do Metricool', chamadas.length >= 3 && chamadas.every(t => /^get/.test(t)), chamadas.join(','));
  await page.screenshot({ path: path.join(out, label + '-07-instagram.png') });
  await page.click('[data-act="instaDias"][data-d="7"]'); await page.waitForTimeout(700);
  ok(label + ': troca de período recarrega', (await page.evaluate(() => window.__mock.calls.filter(c => c[1] === 'getAnalyticsDataByMetrics').length)) >= 4);
  // Google Agenda automático
  const setData = (d) => page.evaluate((v) => { document.getElementById('f_data').value = v; }, d);
  const gcalls = (tool) => page.evaluate((tl) => window.__mock.calls.filter(c => c[0] === 'Google Calendar' && c[1] === tl).map(c => c[2]), tool);
  await page.click('.tab[data-tab="hoje"]'); await page.waitForTimeout(300);
  ok(label + ': avisa sessões que ainda não estão no Google', /ainda não estão no Google Agenda/.test(await page.textContent('#hAlerts')));
  const antes = (await gcalls('create_event')).length;
  await page.click('#hAlerts button:has-text("Google Agenda")'); await page.waitForTimeout(1500);
  const criados = (await gcalls('create_event')).slice(antes);
  ok(label + ': enviar pendentes cria os eventos com horário, fuso e endereço', criados.length === 3 && criados.every(c => /-03:00$/.test(c.startTime) && c.timeZone === 'America/Sao_Paulo' && /Melchert/.test(c.location) && /Tattoo/.test(c.summary)), criados.length + ' eventos');
  const ag1 = await page.evaluate(() => window.__mock.dump('data/users/u_test/agenda/itens'));
  ok(label + ': sessões passam a ter googleId', ag1.filter(x => x.googleId).length === 3);
  await page.click('.tab[data-tab="agenda"]'); await page.waitForTimeout(300);
  await page.click('.actionbar [data-act="addAgenda"]'); await page.waitForTimeout(300);
  await page.fill('#f_cliente', 'Teste Google');
  ok(label + ': campo de data é um botão que abre o calendário', (await page.textContent('.datebtn')).length > 5);
  await page.click('.datebtn'); await page.waitForTimeout(350);
  ok(label + ': calendário abre', await page.evaluate(() => document.getElementById('cal').classList.contains('open')));
  const irPara = async (d) => { for (let i = 0; i < 3 && !(await page.$('#cal [data-d="' + d + '"]')); i++) { await page.click('[data-act="calNext"]'); await page.waitForTimeout(150); } await page.click('#cal [data-d="' + d + '"]'); await page.waitForTimeout(200); };
  await irPara(ds(5));
  const infoCal = await page.textContent('#cal .cal-info');
  ok(label + ': dia com dois trabalhos grandes é marcado e avisa a regra', (await page.$$('#cal [data-d="' + ds(5) + '"] .dots b.big')).length >= 1 && /trabalho grande/.test(infoCal) && /Pedro/.test(infoCal), infoCal.replace(/\s+/g, ' ').slice(0, 100));
  await page.screenshot({ path: path.join(out, label + '-09-calendario.png') });
  await irPara(ds(10));
  ok(label + ': dia livre mostra horários livres', /Horários livres|Fora dos seus dias/.test(await page.textContent('#cal .cal-info')));
  await page.click('[data-act="calOk"]'); await page.waitForTimeout(300);
  ok(label + ': escolher o dia preenche o campo', (await page.evaluate(() => document.getElementById('f_data').value)) === ds(10) && !(await page.evaluate(() => document.getElementById('cal').classList.contains('open'))));
  await page.click('#save'); await page.waitForTimeout(250);
  ok(label + ': sem horário não salva (precisa para o Google)', /horário para criar no Google/.test(await page.textContent('#err')));
  await page.fill('#f_hora', '15:00'); await page.click('#save'); await page.waitForTimeout(900);
  const c2 = (await gcalls('create_event')).at(-1);
  ok(label + ': nova sessão cria evento no Google automaticamente', /Teste Google/.test(c2.summary) && c2.startTime === (ds(10) + 'T15:00:00-03:00') && c2.endTime === (ds(10) + 'T18:00:00-03:00'), c2.startTime);
  const nova = (await page.evaluate(() => window.__mock.dump('data/users/u_test/agenda/itens'))).find(x => x.cliente === 'Teste Google');
  ok(label + ': sessão guarda o googleId e o fim', !!nova.googleId && nova.fim === '18:00');
  await page.locator('[data-view="agenda"] .card', { hasText: 'Teste Google' }).locator('[data-act="editAgenda"]').click(); await page.waitForTimeout(300);
  await page.fill('#f_hora', '16:30'); await page.click('#save'); await page.waitForTimeout(900);
  const up = (await gcalls('update_event')).at(-1);
  ok(label + ': remarcar atualiza o evento no Google', up && up.eventId === nova.googleId && up.startTime === (ds(10) + 'T16:30:00-03:00') && up.endTime === (ds(10) + 'T19:30:00-03:00'), JSON.stringify(up && [up.eventId, up.startTime, up.endTime]));
  await page.evaluate(() => { window.__mock.mcpHandlers['Google Calendar'].list_events = (a) => ({ payload: { events: [{ id: 'evDEDUP', status: 'confirmed', summary: 'Dedup Cliente Tattoo', start: { dateTime: a.startTime.slice(0, 10) + 'T17:00:00-03:00' }, end: { dateTime: a.startTime.slice(0, 10) + 'T20:00:00-03:00' } }] } }); });
  const n0 = (await gcalls('create_event')).length;
  await page.click('.actionbar [data-act="addAgenda"]'); await page.waitForTimeout(300);
  await page.fill('#f_cliente', 'Dedup Cliente'); await setData(ds(11)); await page.fill('#f_hora', '17:00'); await page.click('#save'); await page.waitForTimeout(900);
  const dd = (await page.evaluate(() => window.__mock.dump('data/users/u_test/agenda/itens'))).find(x => x.cliente === 'Dedup Cliente');
  ok(label + ': evento que já existe no Google é adotado, sem duplicar', (await gcalls('create_event')).length === n0 && dd.googleId === 'evDEDUP', dd.googleId);
  await page.evaluate(() => { window.__mock.mcpHandlers['Google Calendar'].list_events = () => ({ payload: { events: [] } }); });
  // orçamentos: parado + novo + enviar mensagem
  await page.click('.tab[data-tab="cli"]'); await page.click('[data-view="cli"] [data-act="segCli"][data-v="funil"]'); await page.waitForTimeout(400);
  const funil = await page.textContent('#funilList');
  ok(label + ': funil lista orçamento parado com sinal de 20%', /Julia/.test(funil) && /retomar/.test(funil) && /300/.test(funil), funil.replace(/\s+/g, ' ').slice(0, 120));
  await page.screenshot({ path: path.join(out, label + '-03-funil.png') });
  await page.click('#funilList [data-act="orcMsg"]'); await page.waitForTimeout(300);
  const msg = await page.inputValue('#f_texto');
  ok(label + ': mensagem de retomada sem desconto/urgência', /Julia/.test(msg) && !/desconto|últimas vagas|promoção/i.test(msg), msg.slice(0, 90));
  await page.click('#txSent'); await page.waitForTimeout(400);
  const orc = await page.evaluate(() => window.__mock.dump('data/users/u_test/orcamentos/itens'));
  ok(label + ': retomada registrada (followups=1)', orc.find(o => o.cliente === 'Julia Prado')?.followups === 1);
  await page.click('.actionbar [data-act="addOrc"]'); await page.waitForTimeout(300);
  await page.fill('#f_cliente', 'Nova Cliente'); await page.fill('#f_ideia', 'rosa fine line'); await page.fill('#f_valor', '1200');
  await page.click('#save'); await page.waitForTimeout(400);
  ok(label + ': novo orçamento salvo', (await page.evaluate(() => window.__mock.dump('data/users/u_test/orcamentos/itens'))).some(o => o.cliente === 'Nova Cliente' && o.valor === 1200));
  // ficha do cliente
  await page.click('[data-view="funil"] [data-act="segCli"][data-v="cli"]'); await page.waitForTimeout(500);
  await page.click('#cliList [data-act="cliente"] >> nth=0'); await page.waitForTimeout(300);
  ok(label + ': ficha do cliente abre', (await page.textContent('#sheet')).includes('Editar ficha'));
  await page.screenshot({ path: path.join(out, label + '-04-ficha.png') });
  await page.click('#cancel');
  // assistente + aprendizado
  await page.click('.tab[data-tab="hoje"]'); await page.waitForTimeout(300);
  await page.click('#askBar'); await page.waitForTimeout(400);
  await page.fill('#chatIn', 'Responder este orçamento: oi quero uma rosa'); await page.click('#chatSend'); await page.waitForTimeout(900);
  const log = await page.evaluate(() => window.__mock.dump('aprendizado_log'));
  ok(label + ': conversa gravada no log de aprendizado', log.length === 1 && /rosa/.test(log[0].pergunta));
  const inp = await page.evaluate(() => JSON.stringify(window.__mock.sampleInputs.at(-1)));
  ok(label + ': regras novas no prompt (R$ 250, 20%, não reembolsado)', /R\$ 250/.test(inp) && /20%/.test(inp) && /não é reembolsado/.test(inp) && !/R\$ 200/.test(inp));
  ok(label + ': snapshot inclui orçamentos e política', /orcamentos/.test(inp) && /politica/.test(inp));
  await page.click('.fb [data-fb="errou"]'); await page.waitForTimeout(300);
  await page.fill('#f_nota', 'Faltou perguntar a cor'); await page.click('#save'); await page.waitForTimeout(400);
  const log2 = await page.evaluate(() => window.__mock.dump('aprendizado_log'));
  ok(label + ': feedback "errou" com nota gravado', log2[0].feedback === 'errou' && /cor/.test(log2[0].nota));
  await page.screenshot({ path: path.join(out, label + '-05-chat.png') });
  await page.click('[data-act="closeChat"]'); await page.waitForTimeout(300);
  await page.click('.tab[data-tab="mais"]'); await page.click('[data-act="goTab"][data-tab-go="aprend"]'); await page.waitForTimeout(400);
  ok(label + ': tela Aprendizado mostra sugestão pendente', /Perguntar a cor do realismo/.test(await page.textContent('#aprendBox')));
  await page.click('[data-act="sugOk"]'); await page.waitForTimeout(400);
  const regras = await page.evaluate(() => window.__mock.dump('aprendizado_cfg'));
  ok(label + ': regra aprovada gravada (versão 1)', regras[0]?.versao === 1 && /cor/.test(regras[0].texto));
  await page.screenshot({ path: path.join(out, label + '-06-aprendizado.png') });
  // agentes
  const inp2 = () => page.evaluate(() => JSON.stringify(window.__mock.sampleInputs.at(-1)));
  const falar = async (k, txt) => { await page.click('.tab[data-tab="hoje"]'); await page.waitForTimeout(250); await page.click('[data-view="hoje"] [data-act="agente"][data-k="' + k + '"]'); await page.waitForTimeout(350); await page.fill('#chatIn', txt); await page.click('#chatSend'); await page.waitForTimeout(800); };
  await falar('financeiro', 'Como estou na meta?');
  let i2 = await inp2();
  ok(label + ': agente financeiro com regras e 6 meses de histórico', /AGENTE FINANCEIRO/.test(i2) && /ultimosMeses/.test(i2) && /custosFixos/.test(i2) && /contador/.test(i2));
  ok(label + ': título do chat vira Financeiro', /Financeiro/.test(await page.textContent('.chat-h .ttl')));
  await page.click('[data-act="closeChat"]'); await page.waitForTimeout(250);
  await falar('vendas', 'Orçamentos parados');
  i2 = await inp2();
  ok(label + ': agente de vendas vê o funil e não recebe o caixa inteiro', /AGENTE DE VENDAS/.test(i2) && /orcamentos/.test(i2) && !/lancamentosCaixa/.test(i2) && /máximo de 2|no máximo 2/.test(i2));
  await page.click('[data-act="closeChat"]'); await page.waitForTimeout(250);
  await falar('midia', 'Plano da semana');
  i2 = await inp2();
  ok(label + ': agente de mídias recebe semana e Instagram, sem nomes de clientes', /AGENTE DE MÍDIAS/.test(i2) && /conteudoSemana/.test(i2) && /instagram/.test(i2) && !/Marina Alves|Carlos Mendes|Pedro Lima/.test(i2));
  await page.click('.act .btn.primary >> nth=-1'); await page.waitForTimeout(500);
  const cont = await page.evaluate(() => window.__mock.dump('data/users/u_test/conteudo/itens'));
  ok(label + ': plano de posts salvo no calendário', cont.length === 1 && cont[0].formato === 'Reels' && cont[0].status === 'ideia' && /olhar|Close/.test(cont[0].gancho), JSON.stringify(cont[0] || {}).slice(0, 90));
  const logA = await page.evaluate(() => window.__mock.dump('aprendizado_log').map(l => l.agente));
  ok(label + ': log registra qual agente respondeu', logA.includes('financeiro') && logA.includes('vendas') && logA.includes('midia'), logA.join(','));
  await page.click('[data-act="closeChat"]'); await page.waitForTimeout(250);
  await page.click('.tab[data-tab="mais"]'); await page.click('[data-act="goTab"][data-tab-go="semana"] >> nth=0'); await page.waitForTimeout(400);
  ok(label + ': tela Conteúdo lista o post com legenda copiável', /Leão preto e cinza finalizado/.test(await page.textContent('#semanaList')) && /Copiar legenda/.test(await page.textContent('#semanaList')));
  await page.screenshot({ path: path.join(out, label + '-08-conteudo.png') });
  await page.click('[data-act="postNext"]'); await page.waitForTimeout(400);
  ok(label + ': avançar etapa do post', (await page.evaluate(() => window.__mock.dump('data/users/u_test/conteudo/itens')))[0].status === 'gravar');
  // exportar
  await page.click('.tab[data-tab="mais"]'); await page.waitForTimeout(300);
  await page.click('[data-act="exportJson"]'); await page.waitForTimeout(400);
  await page.click('[data-act="exportCsv"]'); await page.waitForTimeout(400);
  const dls = await page.evaluate(() => window.__mock.downloads.map(d => d.filename));
  ok(label + ': exporta JSON e CSV', dls.length === 2 && /\.json$/.test(dls[0]) && /\.csv$/.test(dls[1]), dls.join(', '));
  const dj = await page.evaluate(() => JSON.parse(window.__mock.downloads[0].data));
  ok(label + ': backup contém caixa, agenda e orçamentos', dj.caixa.length >= 5 && dj.agenda.length >= 4 && dj.orcamentos.length >= 2);
  // dados antigos preservados: lançamentos continuam nos mesmos caminhos e campos
  const caixa = await page.evaluate(() => window.__mock.dump('data/users/u_test').filter(d => d.kind));
  ok(label + ': dados antigos do caixa intactos', caixa.length === 5 && caixa.find(c => c.id === 'l1').valor === 1200);
  ok(label + ': sem erros de JS', errs.length === 0, errs.slice(0, 3).join(' || '));
  await ctx.close();
}
for (const [l, v] of [['celular', { width: 390, height: 844 }], ['desktop', { width: 1100, height: 900 }]]) {
  try { await run(l, v); } catch (e) { ok(l + ': execução completa', false, String(e.message).split('\n')[0]); }
}
{ // sem nuvem: abre fora do Claude, usa só o aparelho
  const ctx = await browser.newContext({ viewport:{width:390,height:844} }); const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + html); await page.waitForTimeout(600);
  ok('offline: avisa que está só neste aparelho', /neste aparelho/i.test(await page.textContent('#sync')));
  for (const t of ['agenda','cli','caixa','mais','hoje']) { await page.click('.tab[data-tab="'+t+'"]'); await page.waitForTimeout(250); }
  await page.click('.tab[data-tab="mais"]'); await page.click('[data-act="regras"]'); await page.waitForTimeout(250);
  ok('offline: regras da casa abrem', /R\$\s250/.test(await page.textContent("#sheet")));
  ok('offline: sem erros de JS', errs.length === 0, errs.slice(0,2).join(' || ')); await ctx.close();
}
await browser.close();
console.log(results.join('\n')); console.log(falhas ? '\n' + falhas + ' FALHA(S)' : '\nTUDO OK');
process.exit(falhas ? 1 : 0);
