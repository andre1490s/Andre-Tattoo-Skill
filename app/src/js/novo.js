
/* PARTE 2 do closure: módulos novos. Continua o closure aberto em base.js. */

// ---------- Regras da casa (fonte: contexto/marca.md) ----------
const POLITICA = { minimo:250, sinalFaixa:1000, sinalFixo:100, sinalPct:0.2, retoqueDias:40, maxFollowups:2, reativarDias:90, idadeMinima:18, grandesPorDia:1, metaMensal:20000 };
const sinalDe = v => (+v > POLITICA.sinalFaixa) ? Math.round(+v * POLITICA.sinalPct * 100) / 100 : POLITICA.sinalFixo;
const GRANDES = ['Realismo P&C','Fechamento'];
let DBREF = null;
const learn = { log:[], sug:[], regras:{ texto:'', versao:0 } };

// ---------- Orçamentos (funil) ----------
const ETAPAS = [
  {k:'novo', n:'Novo'}, {k:'qualificado', n:'Qualificado'}, {k:'orcamento', n:'Orçamento enviado'},
  {k:'decisao', n:'Aguardando decisão'}, {k:'sinal', n:'Sinal pago'}, {k:'agendado', n:'Agendado'}, {k:'perdido', n:'Perdido'}
];
const ATIVAS = ['novo','qualificado','orcamento','decisao'];
const etapaNome = k => (ETAPAS.find(e=>e.k===k)||{n:k}).n;
const msToDs = ms => { const d = new Date(ms||Date.now()); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };
const orcDias = o => daysSince(o.ultimoContato || msToDs(o.criado));
const orcParado = o => (o.etapa==='orcamento' || o.etapa==='decisao') && (+o.followups||0) < POLITICA.maxFollowups && orcDias(o) >= ((+o.followups||0) ? 7 : 3);
const orcEncerrar = o => ATIVAS.includes(o.etapa) && (+o.followups||0) >= POLITICA.maxFollowups && orcDias(o) >= 7;
let funilFiltro = 'ativos';
function orcSnapshot(){
  return data.orc.filter(o=>ATIVAS.includes(o.etapa) || orcDias(o)<=30).map(o=>({ id:o.id, cliente:o.cliente, etapa:o.etapa, ideia:o.ideia||undefined, estilo:o.estilo||undefined, valor:+o.valor||0, sessao:o.data?(o.data+(o.hora?' '+o.hora:'')):undefined, followups:+o.followups||0, ultimoContato:o.ultimoContato||msToDs(o.criado), diasSemContato:orcDias(o), parado:orcParado(o)||undefined }));
}
function orcTexto(o, tipo){
  const nome = firstName(o.cliente), ideia = o.ideia ? ' de '+o.ideia : '';
  if(tipo==='info') return 'Olá, '+nome+'! Obrigado pelo contato. Para avaliar o seu projeto'+ideia+' e te passar o valor, me envie por favor:\n• uma referência da ideia\n• uma foto da área onde vamos tatuar\nCom isso já te digo também como fica a sessão e a agenda.';
  if(tipo==='proposta'){
    const v = +o.valor||0, sn = sinalDe(v), pct = v > POLITICA.sinalFaixa ? ' ('+Math.round(POLITICA.sinalPct*100)+'%)' : '';
    return 'Olá, '+nome+'! Sobre o seu projeto'+ideia+': o valor do trabalho é '+brl.format(v)+'.\nPara reservar o horário, o sinal é de '+brl.format(sn)+pct+', abatido do valor final. O sinal não é reembolsado em caso de cancelamento ou reagendamento.\nSe estiver de acordo, me confirma por aqui que eu te passo os dados do sinal e confirmo a data.';
  }
  const f = +o.followups||0;
  if(f===0){ const sl = freeSlots(14)[0]; const dia = sl ? new Date(sl.data+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'numeric'}) : '';
    return 'Olá, '+nome+'! Tudo bem? Estive pensando no seu projeto'+ideia+'.'+(dia?' Tenho horário disponível em '+dia+'.':'')+' Se quiser seguir, me avisa que eu reservo para você.'; }
  if(f===1) return 'Olá, '+nome+'! Passando para saber se ficou alguma dúvida sobre o seu projeto'+ideia+'. Posso ajustar o que for preciso no desenho para você seguir com segurança.';
  return 'Olá, '+nome+'! Vou deixar o seu projeto'+ideia+' reservado por aqui. Fico à disposição quando quiser retomar.';
}
function renderFunil(){
  const el = $('funilList'); if(!el) return;
  const todos = data.orc;
  const ativos = todos.filter(o=>ATIVAS.includes(o.etapa));
  const parados = ativos.filter(o=>orcParado(o) || orcEncerrar(o));
  const potencial = ativos.reduce((s,o)=>s+(+o.valor||0),0);
  $('funilSub').innerHTML = ativos.length ? esc(ativos.length+(ativos.length===1?' orçamento em andamento':' orçamentos em andamento'))+(parados.length?', '+esc(parados.length)+' para retomar':'')+(potencial>0?'. Em aberto: ':'')+(potencial>0?money(potencial):'') : 'Nenhum orçamento em andamento.';
  const chips = [{k:'ativos',n:'Em andamento'},{k:'parados',n:'Para retomar'}].concat(ETAPAS.map(e=>({k:e.k,n:e.n})));
  $('funilChips').innerHTML = chips.map(c=>'<button class="chip" data-act="funilFiltro" data-f="'+c.k+'" aria-pressed="'+(funilFiltro===c.k)+'">'+esc(c.n)+'</button>').join('');
  let list = funilFiltro==='ativos' ? ativos : funilFiltro==='parados' ? parados : todos.filter(o=>o.etapa===funilFiltro);
  list = [...list].sort((a,b)=>(+orcParado(b)-+orcParado(a)) || (b.atualizado||0)-(a.atualizado||0));
  if(!list.length){ el.innerHTML = '<div class="empty">'+(todos.length?'Nada nesta etapa.':'Registre cada pedido de orçamento aqui para não perder ninguém.<br>Toque em <b>+ Novo orçamento</b>.')+'</div>'; return; }
  el.innerHTML = list.map(o=>{
    const dias = orcDias(o), v = +o.valor||0;
    const badge = orcParado(o) ? '<span class="pill warn">retomar</span>' : orcEncerrar(o) ? '<span class="pill bad">encerrar</span>' : '';
    const det = [o.ideia, o.tamanho, o.local, o.estilo].filter(Boolean).join(', ');
    const msgBtn = o.etapa==='novo'||o.etapa==='qualificado'&&!(v>0) ? ['info','Pedir infos'] : o.etapa==='qualificado' ? ['proposta','Proposta'] : (ATIVAS.includes(o.etapa) ? ['retomada', orcEncerrar(o)?'Encerrar':'Retomar'] : null);
    const next = ATIVAS.includes(o.etapa) && o.etapa!=='decisao' ? '<button class="mini" data-act="orcNext" data-id="'+esc(o.id)+'">Avançar</button>' : (o.etapa==='decisao'?'<button class="mini" data-act="orcAgendar" data-id="'+esc(o.id)+'">Fechou</button>':'');
    return '<div class="card col"><div class="rowtop"><div class="main"><div class="t">'+esc(o.cliente)+'</div><div class="s">'+esc(det||'sem detalhes')+'</div></div><span class="pill">'+esc(etapaNome(o.etapa))+'</span></div>'
      +'<div class="s" style="white-space:normal">'+badge+esc(dias===0?'contato hoje':dias+(dias===1?' dia':' dias')+' sem contato')+(+o.followups?', '+o.followups+(o.followups==1?' retomada':' retomadas'):'')+(v>0?' · '+(masked?'R$ ••••':esc(brl.format(v)))+', sinal '+(masked?'R$ ••••':esc(brl.format(sinalDe(v)))):'')+(o.data?' · sessão '+esc(shortDate(o.data)+(o.hora?' às '+o.hora:'')):'')+'</div>'
      +(o.notas?'<div class="note">'+esc(o.notas)+'</div>':'')
      +'<div class="acts">'+(msgBtn?'<button class="mini solid" data-act="orcMsg" data-id="'+esc(o.id)+'" data-t="'+msgBtn[0]+'">'+msgBtn[1]+'</button>':'')+next+(ATIVAS.includes(o.etapa)?'<button class="mini" data-act="orcAgendar" data-id="'+esc(o.id)+'">Marcar sessão</button>':'')+'<button class="mini" data-act="editOrc" data-id="'+esc(o.id)+'">Editar</button></div></div>';
  }).join('');
  const nOrc = parados.length; const bg = $('orcBadge'); if(bg){ bg.hidden = !nOrc; bg.textContent = nOrc; }
}
async function sessaoDoOrcamento(rec){
  const base = { cliente:rec.cliente, tattoo:rec.ideia||'', estilo:rec.estilo||null, data:rec.data, hora:rec.hora||'', valor:+rec.valor||0, telefone:rec.telefone||'', notas:rec.notas||'' };
  const ex = rec.agendaId ? find('agenda', rec.agendaId) : null;
  if(ex){
    const upd = Object.assign({}, ex, base);
    if(ex.hora !== upd.hora) upd.fim = '';
    if(ex.googleId && (ex.data!==upd.data || ex.hora!==upd.hora)) upd.remarcadoApp = true;
    await stores.agenda.save(upd);
    if(upd.googleId && mcp && upd.hora){ try{ await googleUpdate(upd); }catch(e){} }
    return upd.id;
  }
  const sinal = (+rec.valor>0 && (rec.etapa==='sinal' || rec.etapa==='agendado')) ? sinalDe(+rec.valor) : 0;
  const novo = Object.assign({ id:newId('a'), concluida:false, sinal }, base);
  await stores.agenda.save(novo);
  if(mcp && novo.hora){ try{ const r = await googleCreate(novo); if(r) await stores.agenda.save(Object.assign({}, novo, {googleId:r.id, fim:r.fim})); }catch(e){} }
  return novo.id;
}
function formOrc(o, preset){
  openForm({
    title: o?'Editar orçamento':'Novo orçamento',
    values: o ? o : Object.assign({etapa:'novo'}, preset||{}),
    fields:[
      {k:'cliente',label:'Cliente',ph:'Nome do cliente'},
      {k:'telefone',label:'WhatsApp (opcional)',ph:'(11) 90000-0000'},
      {k:'ideia',label:'Tattoo',ph:'Ex.: leão realismo no antebraço'},
      {k:'estilo',label:'Estilo',type:'chips',options:ESTILOS},
      {k:'tamanho',label:'Tamanho',ph:'Ex.: 25 cm'},
      {k:'local',label:'Local do corpo',ph:'Ex.: antebraço'},
      {k:'valor',label:'Valor definido por você',type:'money',ph:'R$ 0,00'},
      {hint:'Só você define o preço final. Mínimo da casa: R$ 250. Sinal: R$ 100 até R$ 1.000 de valor, 20% acima.'},
      {k:'data',label:'Data da sessão',type:'date'},
      {k:'hora',label:'Horário',type:'time'},
      {hint:'Com a etapa Sinal pago ou Agendado, a sessão entra sozinha na Agenda e no Google Agenda.'},
      {k:'etapa',label:'Etapa',type:'chips',options:ETAPAS.map(e=>e.k)},
      {k:'notas',label:'Observações',type:'textarea'}
    ].map(f=> f.k==='etapa' ? Object.assign({}, f, {options:ETAPAS.map(e=>e.k)}) : f),
    validate:v=> !v.cliente?'Digite o nome do cliente.': (v.data && (v.etapa==='sinal'||v.etapa==='agendado') && mcp && !v.hora)?'Informe o horário para criar no Google Agenda.':'',
    onSave: async v=>{
      const rec = Object.assign({}, o||{}, v, {id:o?o.id:newId('o'), valor:v.valor||0, followups:o?(+o.followups||0):0, criado:o?(o.criado||Date.now()):Date.now(), atualizado:Date.now(), ultimoContato:o?(o.ultimoContato||today()):today()});
      let marcou = false;
      if(rec.data && (rec.etapa==='sinal' || rec.etapa==='agendado')){ rec.agendaId = await sessaoDoOrcamento(rec); rec.etapa = 'agendado'; marcou = true; }
      await stores.orc.save(rec);
      return marcou ? 'Orçamento salvo e sessão na Agenda' : (o?'Orçamento salvo':'Orçamento criado');
    },
    onDelete: o ? ()=>stores.orc.remove(o.id) : null
  });
  // mostra o nome das etapas nas fichas (os valores guardados continuam as chaves)
  document.querySelectorAll('.chips[data-k="etapa"] .chip').forEach(c=>{ c.textContent = etapaNome(c.dataset.v); });
}
function openTexto(titulo, texto, tel, onSent, sentLabel){
  openForm({ title:titulo, noSave:true, noFocus:true, values:{texto},
    fields:[
      {k:'texto', label:'Mensagem (pode editar antes de enviar)', type:'textarea'},
      {html:'<button type="button" class="btn primary" id="txCopy" style="width:100%;margin-bottom:10px">Copiar mensagem</button>'+(tel!==false?'<a class="wa" id="txWa" href="#" target="_blank" rel="noopener" style="background:transparent;color:var(--gold);border:1px solid var(--line2)">Abrir no WhatsApp</a>':'')+(onSent?'<button type="button" class="btn ghost" id="txSent" style="width:100%;margin-bottom:10px">'+esc(sentLabel||'Marcar como enviada')+'</button>':'')}
    ]});
  $('txCopy').onclick = async()=>{ const ta=$('f_texto'); try{ await navigator.clipboard.writeText(ta.value); }catch(e){ ta.focus(); ta.select(); try{ document.execCommand('copy'); }catch(_){} } toast('Mensagem copiada'); };
  const wa = $('txWa'); if(wa) wa.onclick = ()=>{ wa.href = waLink({telefone:tel||''}, $('f_texto').value); };
  const sent = $('txSent'); if(sent) sent.onclick = async()=>{ try{ await onSent(); closeForm(); }catch(e){ toast('Não foi possível salvar.'); } };
}

// ---------- Hoje ----------
let hojeLoading = false;
const curMes = () => today().slice(0,7);
function mesFech(m){
  const src = (m===mes) ? data.caixa : (caixaCache||[]);
  return fechamento(src, m);
}
function renderHoje(){
  const el = $('hGreet'); if(!el) return;
  renderAvisos();
  const now = new Date(), h = now.getHours();
  $('hGreet').textContent = (h<12?'Bom dia':h<18?'Boa tarde':'Boa noite')+', André';
  $('hKick').textContent = now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
  const cur = curMes();
  if(mes!==cur && !caixaCache && !hojeLoading){ hojeLoading = true; loadCaixaAll(true).then(()=>{ hojeLoading=false; renderHoje(); }).catch(()=>{ hojeLoading=false; }); }
  const f = mesFech(cur), ant = mesFech(prevMonth(cur));
  const nomeMes = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('pt-BR',{month:'long'});
  $('hLucroLbl').textContent = 'Lucro de '+nomeMes;
  const lu = $('hLucro'); lu.classList.toggle('neg', f.lucro<0 && !masked);
  lu.innerHTML = masked ? '<span class="cur">R$</span><span class="mval">••••</span>' : lucroHTML(f.lucro); fit(lu);
  $('hEye').setAttribute('aria-pressed', String(masked)); $('hEye').setAttribute('aria-label', masked?'Mostrar valores':'Ocultar valores');
  document.body.classList.toggle('masked', masked);
  const meta = +data.cfg.meta||0, mb = $('hMeta');
  if(meta>0){
    const pct = Math.min(100, Math.round(f.entradas/meta*100));
    mb.hidden = false;
    mb.innerHTML = '<div class="mrow"><span>Meta <span class="mv">'+esc(brl.format(meta))+'</span></span><span><b>'+(masked?'••':pct)+'%</b></span></div><div class="mbar"><i style="width:'+(masked?0:pct)+'%"></i></div><div class="mrow" style="margin-top:6px"><span>'+(f.entradas>=meta?'Meta batida neste mês':'Faltam <span class="mv">'+esc(brl.format(meta-f.entradas))+'</span> em entradas')+'</span><span></span></div>';
  } else mb.hidden = true;
  // indicadores
  const t = today();
  const aReceber = data.agenda.filter(a=>!a.concluida && (+a.valor||0)>0).reduce((s,a)=>s+Math.max(0,(+a.valor||0)-(+a.sinal||0)),0);
  let cmp = '';
  if(ant.entradas>0){ const p = Math.round((f.entradas-ant.entradas)/ant.entradas*100); cmp = '<small class="'+(p>=0?'up':'down')+'">'+(masked?'••':(p>=0?'+':'')+p+'%')+' vs mês passado</small>'; }
  $('hKpis').innerHTML = '<div class="kpis k3"><div class="kpi"><span>Sessões</span><strong class="num">'+f.sessoes+'</strong>'+cmp+'</div><div class="kpi"><span>Ticket</span><strong class="num">'+money(f.ticketMedio)+'</strong></div><div class="kpi"><span>A receber</span><strong class="num">'+money(aReceber)+'</strong></div></div>';
  // alertas novos
  const al = [];
  const parados = data.orc.filter(o=>orcParado(o)||orcEncerrar(o));
  if(parados.length) al.push({ic:'›', red:false, t: parados.length===1?'1 orçamento para retomar':parados.length+' orçamentos para retomar', s: parados.slice(0,3).map(o=>firstName(o.cliente)).join(', '), act:'goFunil'});
  const futuras = data.agenda.filter(a=>!a.concluida && a.data>=t);
  const semEstilo = futuras.filter(a=>!a.estilo).length;
  if(semEstilo) al.push({ic:'!', red:false, t: semEstilo+(semEstilo===1?' sessão sem estilo':' sessões sem estilo'), s:'O estilo define as agulhas da sessão.', act:'goAgenda'});
  const porDia = {}; futuras.filter(a=>GRANDES.includes(a.estilo)).forEach(a=>{ (porDia[a.data] = porDia[a.data]||[]).push(a.cliente); });
  Object.keys(porDia).filter(d=>porDia[d].length>POLITICA.grandesPorDia).sort().slice(0,2).forEach(d=>al.push({ic:'!', red:true, t:'Dois trabalhos grandes no mesmo dia', s:shortDate(d)+': '+porDia[d].join(' e '), act:'goAgenda'}));
  const bday = data.cli.filter(c=>c.nasc && /^\d{2}-\d{2}$/.test(c.nasc)).map(c=>{ const [mm,dd]=c.nasc.split('-').map(Number); let d=new Date(now.getFullYear(),mm-1,dd); const t0=new Date(now.getFullYear(),now.getMonth(),now.getDate()); if(d<t0) d=new Date(now.getFullYear()+1,mm-1,dd); return {c, dias:Math.round((d-t0)/86400000)}; }).filter(x=>x.dias<=7).sort((a,b)=>a.dias-b.dias);
  bday.slice(0,2).forEach(x=>al.push({ic:'✦', red:false, t:(x.dias===0?'Aniversário hoje: ':'Aniversário em '+x.dias+(x.dias===1?' dia: ':' dias: '))+(x.c.nome||''), s:'Uma mensagem pessoal, sem venda.', act:'cliente', id:x.c.id}));
  if(caixaCache){ const lim = addDays(t, -POLITICA.reativarDias); const nR = buildClients(caixaCache).filter(c=>c.ultima && c.ultima<=lim && !c.proxima).length; if(nR) al.push({ic:'›', red:false, t:nR+(nR===1?' cliente para reativar':' clientes para reativar'), s:POLITICA.reativarDias+'+ dias sem voltar.', act:'goCli'}); }
  const postsHoje = data.cont.filter(c=>c.data===t && c.status!=='publicado');
  if(postsHoje.length) al.unshift({ic:'✦', red:false, t: postsHoje.length===1?'Post de hoje: '+postsHoje[0].ideia:postsHoje.length+' posts para hoje', s: postsHoje.map(c=>(c.hora||'')+' '+c.formato).join(', '), act:'goSemana'});
  else if(cloud && !data.cont.some(c=>c.data>=t && c.data<=addDays(t,6))) al.push({ic:'›', red:false, t:'Nenhum post planejado para os próximos 7 dias', s:'O agente de mídias monta o plano da semana.', act:'agenteMidia'});
  if(mcp){ const nP = data.agenda.filter(a=>!a.concluida && a.hora && a.data>=t && !a.googleId && !a.ignorado).length;
    if(nP) al.push({ic:'!', red:false, t:nP+(nP===1?' sessão ainda não está':' sessões ainda não estão')+' no Google Agenda', s:'Toque para enviar agora. Eventos iguais que já existirem não são duplicados.', act:'googleSync'}); }
  window.__hAl = al;
  $('hAlerts').innerHTML = bannerPadroes() + (al.length ? '<div class="brief"><div class="bh"><span>Atenção</span><small>'+al.length+'</small></div>'+al.map((x,i)=>'<button data-act="alertGo" data-i="'+i+'"><span class="ic'+(x.red?' red':'')+'">'+esc(x.ic)+'</span><span class="main"><div class="t">'+esc(x.t)+'</div><div class="s">'+esc(x.s||'')+'</div></span></button>').join('')+'</div>' : '');
  // agenda
  const open = data.agenda.filter(a=>!a.concluida).sort((a,b)=>(a.data+(a.hora||'')).localeCompare(b.data+(b.hora||'')));
  const late = open.filter(a=>a.data<t), prox = open.filter(a=>a.data>=t).slice(0,4);
  let h2 = '';
  late.slice(0,3).forEach(a=>{ h2 += '<div class="day">'+esc(dayLabel(a.data))+'</div>'+agendaCard(a,true); });
  let last = ''; prox.forEach(a=>{ if(a.data!==last){ last=a.data; h2 += '<div class="day">'+(a.data===t?'Hoje, ':'')+esc(dayLabel(a.data))+'</div>'; } h2 += agendaCard(a,false); });
  $('hAgenda').innerHTML = h2 || '<div class="empty">Nenhuma sessão marcada. Toque em <b>Marcar sessão</b> quando fechar um horário.</div>';
}

// ---------- Finanças: relatórios ----------
function renderRel(){
  const box = $('relBox'); if(!box) return;
  const all = caixaCache;
  if(!all){ box.innerHTML = '<div class="empty">Carregando o histórico…</div>'; if(!hojeLoading && cloud){ hojeLoading=true; loadCaixaAll(true).then(()=>{ hojeLoading=false; renderRel(); renderHoje(); }).catch(()=>{ hojeLoading=false; }); } return; }
  const ms = []; let m = mes; for(let i=0;i<6;i++){ ms.unshift(m); m = prevMonth(m); }
  const fs = ms.map(x=>fechamento(all, x));
  const mx = Math.max(1, ...fs.map(f=>Math.max(f.entradas,f.saidas)));
  const bars = fs.map((f,i)=>'<div class="bar"><div class="cols"><i class="ci" style="height:'+(masked?8:Math.max(2,f.entradas/mx*100))+'%"></i><i class="co" style="height:'+(masked?5:Math.max(2,f.saidas/mx*100))+'%"></i></div><span>'+esc(new Date(+ms[i].slice(0,4),+ms[i].slice(5,7)-1,1).toLocaleDateString('pt-BR',{month:'short'}).replace('.',''))+'</span></div>').join('');
  const f = fs[fs.length-1], ant = fs[fs.length-2];
  const dur = +data.cfg.duracao||3, meta = +data.cfg.meta||0, cf = +data.cfg.custosFixos||0;
  const linhas = [];
  if(ant.entradas>0){ const p = Math.round((f.entradas-ant.entradas)/ant.entradas*100); linhas.push(['Entradas vs mês anterior','<span class="'+(p>=0?'up':'down')+'">'+(masked?'••':(p>=0?'+':'')+p+'%')+'</span>']); }
  if(f.sessoes>0) linhas.push(['Receita por hora (estimativa)', money(f.entradas/(f.sessoes*dur))]);
  const cur = ms[ms.length-1]===curMes();
  if(cur){ const d = new Date(), dm = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); if(d.getDate()>=5 && f.entradas>0) linhas.push(['Projeção do mês (estimativa)', money(f.entradas/d.getDate()*dm)]); }
  if(meta>0 && f.ticketMedio>0 && f.entradas<meta) linhas.push(['Sessões para bater a meta', '<b class="num">'+Math.ceil((meta-f.entradas)/f.ticketMedio)+'</b>']);
  if(cf>0 && f.ticketMedio>0) linhas.push(['Sessões para cobrir custos fixos', '<b class="num">'+Math.ceil(cf/f.ticketMedio)+'</b>']);
  if(cf>0) linhas.push(['Resultado após custos fixos', money(f.lucro-cf)]);
  linhas.push(['Sinais recebidos', money(f.sinais)]);
  const cat = Object.entries(f.gastosPorCategoria||{}).sort((a,b)=>b[1]-a[1]), tot = cat.reduce((s,x)=>s+x[1],0)||1;
  box.innerHTML = '<div class="rel"><div class="legend"><span><b style="background:var(--silver-hi)"></b>Entradas</span><span><b style="background:#5a403d"></b>Saídas</span></div><div class="bars">'+bars+'</div></div>'
    +'<div class="kpis" style="grid-template-columns:1fr;margin-top:10px">'+linhas.map(l=>'<div class="kpi" style="display:flex;justify-content:space-between;align-items:center;border-left:0;border-top:1px solid var(--line)"><span style="letter-spacing:.06em;text-transform:none;font-size:13px;font-weight:600">'+esc(l[0])+'</span><strong class="num" style="margin:0;font-size:22px">'+l[1]+'</strong></div>').join('')+'</div>'
    +(cat.length?'<div class="rel" style="margin-top:10px"><div class="legend" style="margin:0 0 4px"><span>Gastos por categoria</span></div>'+cat.map(([k,v])=>'<div class="hbar"><div class="hl"><span>'+esc(k)+'</span><span>'+(masked?'R$ ••••':esc(brl.format(v)))+'</span></div><div class="hb"><i style="width:'+Math.round(v/tot*100)+'%"></i></div></div>').join('')+'</div>':'')
    +(cf>0?'':'<p class="hint" style="margin-top:10px">Informe os custos fixos em Ajustes (engrenagem) para ver o ponto de equilíbrio.</p>');
}

// ---------- Clientes: ficha ----------
const profOf = key => data.cli.find(x=>x.id===key) || {};
function openCliente2(key){
  const c = clientsList.find(x=>x.key===key); if(!c) return;
  const p = profOf(key), tel = c.telefone || p.telefone || '';
  const hist = c.hist.slice(0,10).map(h=>'<li>'+esc(h.txt)+'<br><small>'+esc(dayLabel(h.data))+'</small></li>').join('');
  const orcs = data.orc.filter(o=>normName(o.cliente)===key && ATIVAS.includes(o.etapa));
  const ult = c.ultima ? daysSince(c.ultima) : null;
  const niver = p.nasc && /^\d{2}-\d{2}$/.test(p.nasc) ? p.nasc.slice(3)+'/'+p.nasc.slice(0,2) : '';
  const flags = [ult!=null && ult>=POLITICA.retoqueDias && ult<POLITICA.reativarDias ? 'Retoque disponível (a partir de '+POLITICA.retoqueDias+' dias, após sua avaliação)' : '', ult!=null && ult>=POLITICA.reativarDias && !c.proxima ? 'Sem voltar há '+ult+' dias: boa hora para reativar' : '', orcs.length ? orcs.length+(orcs.length===1?' orçamento em andamento':' orçamentos em andamento') : ''].filter(Boolean);
  const msg = (p.nasc && p.nasc===(pad(new Date().getMonth()+1)+'-'+pad(new Date().getDate()))) ? 'Olá, '+firstName(c.nome)+'! Parabéns pelo seu dia. Desejo um ano excelente para você.' : textoReativar(c);
  openForm({ title:c.nome, noSave:true, noFocus:true, values:{texto:msg},
    fields:[
      {html:'<div class="cli-stats"><div><span>Gasto</span><b class="num">'+(masked?'••••':esc(brl.format(c.total)))+'</b></div><div><span>Sessões</span><b class="num">'+c.sessoes+'</b></div><div><span>Última</span><b class="num">'+(c.ultima?esc(shortDate(c.ultima)):'–')+'</b></div></div>'
        +(flags.length?'<p class="hint">'+flags.map(esc).join('<br>')+'</p>':'')
        +((niver||p.indicacao||p.notas)?'<p class="hint" style="white-space:pre-line">'+[niver?'Aniversário: '+niver:'', p.indicacao?'Indicação: '+p.indicacao:'', p.notas?p.notas:''].filter(Boolean).map(esc).join('\n')+'</p>':'')
        +(hist?'<ul class="hist-l">'+hist+'</ul>':'')},
      {k:'texto',label:'Mensagem (pode editar)',type:'textarea'},
      {html:'<a class="wa" id="cliWa" href="#" target="_blank" rel="noopener">Abrir no WhatsApp</a><button type="button" class="btn ghost" id="cliAgendar" style="width:100%;margin-bottom:10px">Marcar sessão para '+esc(firstName(c.nome))+'</button><button type="button" class="btn ghost" id="cliEdit" style="width:100%;margin-bottom:10px">Editar ficha</button>'}
    ]});
  $('cliWa').onclick = ()=>{ $('cliWa').href = waLink({telefone:tel}, $('f_texto').value); const r = Object.assign({}, data.cfg.reativados||{}); r[c.key] = Date.now(); cfgStore.save(Object.assign({}, data.cfg, {reativados:r})).catch(()=>{}); setTimeout(closeForm,300); };
  $('cliAgendar').onclick = ()=>{ closeForm(); setTimeout(()=>formAgenda(null,{cliente:c.nome, telefone:tel}), 280); };
  $('cliEdit').onclick = ()=>{ closeForm(); setTimeout(()=>formCliente(c), 280); };
}
function formCliente(c){
  const p = profOf(c.key);
  const nasc = p.nasc && /^\d{2}-\d{2}$/.test(p.nasc) ? p.nasc.slice(3)+'/'+p.nasc.slice(0,2) : '';
  openForm({ title:'Ficha de '+firstName(c.nome),
    values:{telefone:p.telefone||c.telefone||'', nasc, indicacao:p.indicacao||'', notas:p.notas||''},
    fields:[
      {k:'telefone',label:'WhatsApp',ph:'(11) 90000-0000'},
      {k:'nasc',label:'Aniversário (dia/mês)',ph:'Ex.: 15/03'},
      {k:'indicacao',label:'Quem indicou (opcional)',ph:'Nome de quem indicou'},
      {k:'notas',label:'Anotações sobre o cliente',type:'textarea'}
    ],
    validate:v=> v.nasc && !/^\d{1,2}\/\d{1,2}$/.test(v.nasc) ? 'Use o formato dia/mês, por exemplo 15/03.' : '',
    onSave: async v=>{
      let n = ''; if(v.nasc){ const [d,m] = v.nasc.split('/').map(Number); if(d>=1&&d<=31&&m>=1&&m<=12) n = pad(m)+'-'+pad(d); }
      await stores.cli.save({id:c.key, nome:c.nome, telefone:v.telefone||'', nasc:n, indicacao:v.indicacao||'', notas:v.notas||'', atualizado:Date.now()});
      return 'Ficha salva';
    }
  });
}

// ---------- Mais ----------
function renderMais(){
  const el = $('maisList'); if(!el) return;
  const nPend = data.pend.filter(p=>!p.feito).length + autoPend().length;
  const low = data.mat.filter(m=>+m.qtd<+m.minimo).length;
  const nAv = learn.log.filter(x=>!x.feedback).length, nSug = learn.sug.filter(s=>s.status==='proposta').length;
  const ic = d => '<span class="ico"><svg viewBox="0 0 24 24">'+d+'</svg></span>';
  const it = (act, extra, icon, t, s) => '<div class="card"><button class="open" data-act="'+act+'"'+extra+'>'+ic(icon)+'<span class="main"><div class="t">'+esc(t)+'</div><div class="s">'+esc(s)+'</div></span><span class="arr">›</span></button></div>';
  el.innerHTML =
    it('goTab',' data-tab-go="pend"','<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>','Pendências', nPend?nPend+(nPend===1?' coisa para resolver':' coisas para resolver'):'Tudo em dia')
   +it('goTab',' data-tab-go="mat"','<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>','Materiais e agulhas', low?low+(low===1?' item abaixo do mínimo':' itens abaixo do mínimo'):'Estoque em dia')
   +it('goTab',' data-tab-go="semana"','<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4M8 15h3M13 15h3"/>','Conteúdo da semana', (()=>{ const n = data.cont.filter(c=>c.data>=today() && c.data<=addDays(today(),6)).length; return n ? n+(n===1?' post nos próximos 7 dias':' posts nos próximos 7 dias') : 'Nenhum post planejado'; })())
   +it('openInsta','','<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8"/>','Instagram','Alcance, seguidores, interações e melhores horários')
   +it('goTab',' data-tab-go="aprend"','<path d="M12 2l1.6 7.4L21 11l-7.4 1.6L12 20l-1.6-7.4L3 11l7.4-1.6z"/>','Aprendizado do Assistente', (nAv?nAv+' respostas sem avaliação':'Avalie as respostas')+(nSug?', '+nSug+(nSug===1?' sugestão':' sugestões'):''))
   +it('regras','','<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/>','Regras da casa','Sinal, retoque, mínimo e política de preço')
   +it('exportJson','','<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>','Backup completo','Baixar todos os dados (arquivo JSON)')
   +it('exportCsv','','<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>','Lançamentos em planilha','Baixar o caixa (CSV, abre no Excel)')
   +it('config','','<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>','Ajustes do estúdio','Meta, horário de atendimento e custos fixos');
}
async function exportar(tipo){
  let dl = null; try{ dl = await window.claude.use('downloads'); }catch(e){}
  if(!dl){ toast('Exportar não está disponível neste aparelho.'); return; }
  try{
    const caixa = await stores.caixa.all();
    const dia = today();
    if(tipo==='json'){
      const pacote = { gerado:dia, app:'Caixa Andre Tattoo', caixa, agenda:allAgenda, pendencias:data.pend, materiais:data.mat, orcamentos:data.orc, clientes:data.cli, conteudo:data.cont, config:data.cfg };
      await dl.save({ filename:'andre-tattoo-backup-'+dia+'.json', data:JSON.stringify(pacote,null,2), request:'Backup completo dos dados do app' });
    } else {
      const num = v => String(Math.round((+v||0)*100)/100).replace('.',',');
      const q = s => '"'+String(s==null?'':s).replace(/"/g,'""')+'"';
      const rows = [['Data','Tipo','Cliente','Descrição','Categoria','Pagamento','Valor']].concat(caixa.sort((a,b)=>String(a.data).localeCompare(String(b.data))).map(x=>[x.data, x.kind==='in'?(x.tipo||'Entrada'):'Saída', x.cliente||'', x.descricao||'', x.categoria||'', x.pagamento||'', (x.kind==='in'?'':'-')+num(x.valor)]));
      await dl.save({ filename:'andre-tattoo-caixa-'+dia+'.csv', data:'﻿'+rows.map(r=>r.map((c,i)=>i===6?c:q(c)).join(';')).join('\r\n'), request:'Lançamentos do caixa em planilha' });
    }
    toast('Arquivo pronto');
  }catch(e){ toast(e && e.code==='declined' ? 'Salvamento cancelado' : 'Não foi possível exportar.'); }
}
function openRegras(){
  const li = a => '<li>'+a+'</li>';
  openForm({ title:'Regras da casa', noSave:true, noFocus:true, values:{}, fields:[
    {html:'<ul class="hist-l">'
      +li('Preço final: <b>só você</b> passa. Mínimo da casa: <b>'+esc(brl.format(POLITICA.minimo))+'</b>.')
      +li('Sinal: <b>'+esc(brl.format(POLITICA.sinalFixo))+'</b> até '+esc(brl.format(POLITICA.sinalFaixa))+' de valor; <b>'+Math.round(POLITICA.sinalPct*100)+'%</b> acima. Abatido do valor final. <b>Não reembolsável</b> em cancelamento ou reagendamento.')
      +li('Retoque: a partir de <b>'+POLITICA.retoqueDias+' dias</b>, depois da sua avaliação. Falha de aplicação: sem custo.')
      +li('Idade mínima: <b>'+POLITICA.idadeMinima+' anos</b>.')
      +li('Trabalho grande: <b>'+POLITICA.grandesPorDia+' por dia</b>.')
      +li('Retomada de orçamento: no máximo <b>'+POLITICA.maxFollowups+'</b>, sem desconto e sem urgência falsa.')
      +li('Reativação: clientes sem voltar há <b>'+POLITICA.reativarDias+'+ dias</b>.')
      +'</ul><p class="hint">Estas regras vêm do seu contexto de marca e alimentam alertas, cálculos e o Assistente.</p>'}
  ]});
}

// ---------- Aprendizado do Assistente ----------
function regrasExtra(){ return learn.regras.texto ? '\n\nREGRAS APROVADAS PELO ANDRE (fazem parte das regras acima):\n'+learn.regras.texto : ''; }
const sharedCol = n => DBREF ? DBREF.collection(n) : null;
function setupLearning(){
  if(!DBREF) return;
  try{
    sharedCol('aprendizado_log').onSnapshot(s=>{ learn.log = s.docs.map(d=>Object.assign({id:d.id}, d.data())).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,120); renderAprend(); renderMais(); }, ()=>{});
    sharedCol('aprendizado_sugestoes').onSnapshot(s=>{ learn.sug = s.docs.map(d=>Object.assign({id:d.id}, d.data())).sort((a,b)=>(b.ts||0)-(a.ts||0)); renderAprend(); renderMais(); }, ()=>{});
    DBREF.doc('aprendizado_cfg/regras').onSnapshot(sn=>{ const v = sn.exists ? sn.data() : {}; learn.regras = { texto:v.texto||'', versao:+v.versao||0 }; }, ()=>{});
  }catch(e){}
  loadCaixaAll(true).then(()=>renderAll()).catch(()=>{});
}
function addFeedback(msgEl, pergunta, resposta, res, ag){
  if(!DBREF) return;
  const id = newId('i');
  const doc = { ts:Date.now(), dia:today(), pergunta:String(pergunta).slice(0,1500), resposta:String(resposta).slice(0,2500), acoes:((res&&res.acoes)||[]).map(a=>a&&a.tipo).filter(Boolean), feedback:'', nota:'', regrasV:learn.regras.versao||0, agente:ag||agenteAtual };
  const ref = sharedCol('aprendizado_log').doc(id);
  ref.set(doc).catch(()=>{});
  const row = document.createElement('div'); row.className = 'fb';
  row.innerHTML = '<small>Foi útil?</small><button class="mini" data-fb="serviu">Serviu</button><button class="mini" data-fb="editei">Editei</button><button class="mini" data-fb="errou">Errou</button>';
  msgEl.after(row);
  const marcar = (fb, nota) => ref.update({feedback:fb, nota:nota||''}).then(()=>{ row.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.fb===fb))); toast('Obrigado, anotei'); }).catch(()=>toast('Não foi possível salvar a avaliação.'));
  row.addEventListener('click', e=>{
    const b = e.target.closest('button[data-fb]'); if(!b) return;
    if(b.dataset.fb==='serviu') return marcar('serviu','');
    openForm({ title: b.dataset.fb==='errou'?'O que errou?':'O que você mudou?', values:{nota:''}, fields:[{k:'nota',label:'Conte em uma frase (isso ensina o Assistente)',type:'textarea'}], saveLabel:'Salvar avaliação', onSave: async v=>{ await marcar(b.dataset.fb, v.nota||''); return ''; } });
  });
}
function renderAprend(){
  const box = $('aprendBox'); if(!box) return;
  if(!DBREF){ box.innerHTML = '<div class="empty">O aprendizado precisa da nuvem. Abra o app pelo link do Claude.</div>'; return; }
  const L = learn.log, tot = L.length, c = k => L.filter(x=>x.feedback===k).length, av = L.filter(x=>x.feedback).length;
  const pct = n => av ? Math.round(n/av*100)+'%' : '–';
  const pend = learn.sug.filter(s=>s.status==='proposta'), hist = learn.sug.filter(s=>s.status!=='proposta').slice(0,5);
  const fbPill = x => x.feedback==='serviu' ? '<span class="pill good">serviu</span>' : x.feedback==='editei' ? '<span class="pill warn">editei</span>' : x.feedback==='errou' ? '<span class="pill bad">errou</span>' : '<span class="pill">sem avaliação</span>';
  box.innerHTML =
    '<div class="kpis k3"><div class="kpi"><span>Respostas</span><strong class="num">'+tot+'</strong></div><div class="kpi"><span>Serviu</span><strong class="num">'+pct(c('serviu'))+'</strong></div><div class="kpi"><span>Errou</span><strong class="num">'+pct(c('errou'))+'</strong></div></div>'
   +'<div class="sec">Sugestões de melhoria</div>'
   +(pend.length ? pend.map(s=>'<div class="card col"><div class="rowtop"><div class="main"><div class="t" style="white-space:normal">'+esc(s.titulo||'Sugestão')+'</div></div><span class="pill">nível '+esc(s.confianca||1)+'</span></div><div class="note">'+esc(s.regra||'')+'</div>'+(s.motivo?'<div class="s" style="white-space:normal">'+esc(s.motivo)+'</div>':'')+'<div class="acts"><button class="mini solid" data-act="sugOk" data-id="'+esc(s.id)+'">Aprovar</button><button class="mini" data-act="sugNo" data-id="'+esc(s.id)+'">Recusar</button></div></div>').join('')
      : '<div class="empty">Nenhuma sugestão por enquanto.<br>Para gerar, peça ao Claude: <b>"analisar o aprendizado do app"</b>. Ele lê suas avaliações e propõe mudanças que só valem depois que você aprovar.</div>')
   +(learn.regras.texto?'<div class="sec">Regras aprovadas (versão '+learn.regras.versao+')</div><div class="rel"><div style="white-space:pre-line;font-size:14px;line-height:1.5">'+esc(learn.regras.texto)+'</div></div>':'')
   +(hist.length?'<div class="sec">Decididas</div>'+hist.map(s=>'<div class="card"><div class="main" style="padding:12px"><div class="t">'+esc(s.titulo||'Sugestão')+'</div><div class="s">'+esc(s.status)+'</div></div></div>').join(''):'')
   +'<div class="sec">Últimas respostas</div>'
   +(L.length ? L.slice(0,15).map(x=>'<div class="card"><div class="main" style="padding:12px"><div class="t">'+esc(x.pergunta)+'</div><div class="s">'+esc(shortDate(x.dia||today()))+' · '+(x.agente&&x.agente!=='geral'?esc(x.agente)+' · ':'')+(x.acoes&&x.acoes.length?esc(x.acoes.join(', '))+' · ':'')+'</div>'+(x.nota?'<div class="s" style="white-space:normal">Nota: '+esc(x.nota)+'</div>':'')+'</div><div style="padding:0 8px">'+fbPill(x)+'</div></div>').join('') : '<div class="empty">As conversas com o Assistente aparecem aqui, com a sua avaliação.</div>');
}
async function decidirSug(id, ok){
  const s = learn.sug.find(x=>x.id===id); if(!s) return;
  try{
    if(ok){
      const texto = (learn.regras.texto ? learn.regras.texto+'\n' : '')+'- '+String(s.regra||'').trim();
      await DBREF.doc('aprendizado_cfg/regras').set({ texto, versao:(learn.regras.versao||0)+1, atualizado:Date.now() });
    }
    await sharedCol('aprendizado_sugestoes').doc(id).update({ status: ok?'aprovada':'recusada', decididoEm:Date.now() });
    toast(ok?'Regra aprovada':'Sugestão recusada');
  }catch(e){ toast('Não foi possível salvar.'); }
}

// ---------- Calendário para escolher datas ----------
const fmtDataBtn = ds => ds ? new Date(ds+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : 'Escolher a data';
let calState = null;
function sessoesDoDia(ds){ return data.agenda.filter(a=>a.data===ds && !a.ignorado).sort((a,b)=>(a.hora||'').localeCompare(b.hora||'')); }
function livresDoDia(ds){
  const wd = DIAS[new Date(ds+'T12:00:00').getDay()];
  if(!data.cfg.dias.includes(wd)) return null;
  const minLen = Math.round((+data.cfg.duracao||3)*60);
  let ini = toMin(data.cfg.inicio), fim = toMin(data.cfg.fim);
  if(ds===today()){ const n = new Date(); ini = Math.max(ini, Math.ceil((n.getHours()*60+n.getMinutes()+30)/30)*30); }
  const busy = data.agenda.filter(a=>a.data===ds && a.hora && !a.ignorado).map(sessionRange).sort((x,y)=>x[0]-y[0]);
  const free = []; let cur = ini;
  busy.forEach(([b,e])=>{ if(b-cur>=minLen) free.push([cur,b]); cur = Math.max(cur,e); });
  if(fim-cur>=minLen) free.push([cur,fim]);
  return free.map(([a,b])=>toHH(a)+' às '+toHH(b));
}
function abrirCalendario(inputId){
  const inp = $(inputId); if(!inp) return;
  const cur = inp.value || today();
  calState = { target:inputId, ref:cur.slice(0,7), sel:cur };
  renderCal(); $('calBg').classList.add('open'); $('cal').classList.add('open');
}
function fecharCal(){ $('calBg').classList.remove('open'); $('cal').classList.remove('open'); calState = null; }
function renderCal(){
  if(!calState) return;
  const [y,m] = calState.ref.split('-').map(Number), t = today();
  const primeiro = new Date(y,m-1,1).getDay(), dim = new Date(y,m,0).getDate();
  const nomeMes = new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const porDia = {}; data.agenda.filter(a=>!a.ignorado).forEach(a=>{ (porDia[a.data] = porDia[a.data]||[]).push(a); });
  let g = ['D','S','T','Q','Q','S','S'].map(x=>'<div class="cal-w">'+x+'</div>').join('');
  for(let i=0;i<primeiro;i++) g += '<button class="cal-d vazio" tabindex="-1" aria-hidden="true"></button>';
  for(let d=1; d<=dim; d++){
    const ds = y+'-'+pad(m)+'-'+pad(d), wd = DIAS[new Date(y,m-1,d).getDay()], ss = porDia[ds]||[];
    const dots = ss.length ? '<span class="dots">'+ss.slice(0,3).map(a=>'<b'+(GRANDES.includes(a.estilo)?' class="big"':'')+'></b>').join('')+'</span>' : '';
    const cls = ['cal-d', ds<t?'past':'', ds===t?'today':'', !data.cfg.dias.includes(wd)?'off':'', ds===calState.sel?'sel':''].filter(Boolean).join(' ');
    g += '<button class="'+cls+'" data-act="calDia" data-d="'+ds+'" aria-label="'+esc(fmtDataBtn(ds))+(ss.length?', '+ss.length+(ss.length===1?' sessão':' sessões'):'')+'">'+d+dots+'</button>';
  }
  const sel = calState.sel, ss = sessoesDoDia(sel), livres = livresDoDia(sel), grande = ss.filter(a=>GRANDES.includes(a.estilo)).length;
  const info = '<div class="cal-info"><div class="dia">'+esc(fmtDataBtn(sel))+'</div>'
    +(ss.length ? ss.map(a=>'<div>'+esc((a.hora||'--')+'  '+a.cliente+(a.estilo?' · '+a.estilo:''))+'</div>').join('') : '<div class="m">Nenhuma sessão neste dia.</div>')
    +(grande ? '<div class="w">Já há trabalho grande neste dia (regra: 1 por dia).</div>' : '')
    +(livres===null ? '<div class="m">Fora dos seus dias de atendimento.</div>' : livres.length ? '<div class="m">Horários livres: '+esc(livres.join(', '))+'</div>' : '<div class="m">Sem janela livre para uma sessão de '+fmtNum(+data.cfg.duracao||3)+'h.</div>')
    +'</div>';
  $('cal').innerHTML = '<div class="cal-h"><button class="arrow" data-act="calPrev" aria-label="Mês anterior">‹</button><b>'+esc(nomeMes)+'</b><button class="arrow" data-act="calNext" aria-label="Próximo mês">›</button></div>'
    +'<div class="cal-g">'+g+'</div>'
    +'<div class="cal-leg"><span><b style="background:var(--gold)"></b>com sessão</span><span><b style="background:var(--out)"></b>trabalho grande</span><span>cinza: fora do atendimento</span></div>'
    +info
    +'<div class="cal-act"><button class="btn ghost" data-act="calHoje">Hoje</button><button class="btn primary" data-act="calOk">Escolher este dia</button></div>';
}
function calMes(delta){ const [y,m] = calState.ref.split('-').map(Number); const d = new Date(y,m-1+delta,1); calState.ref = d.getFullYear()+'-'+pad(d.getMonth()+1); renderCal(); }
function calConfirma(){
  if(!calState) return;
  const inp = $(calState.target), btn = document.querySelector('[data-pick="'+calState.target+'"]');
  if(inp) inp.value = calState.sel;
  if(btn) btn.textContent = fmtDataBtn(calState.sel);
  fecharCal();
}
$('calBg').addEventListener('click', fecharCal);

// ---------- Avisos dos agentes (o ponto de "mensagem nova") ----------
function avisosAgentes(){
  const t = today(), cur = curMes(), all = caixaCache || null;
  const A = { financeiro:[], vendas:[], midia:[] };
  // Vendas
  data.orc.filter(o=>orcParado(o)||orcEncerrar(o)).forEach(o=>A.vendas.push({k:'o:'+o.id+':'+(+o.followups||0), t:firstName(o.cliente)+': '+(orcEncerrar(o)?'encerrar com gentileza':'retomar o orçamento')+' ('+orcDias(o)+' dias sem contato)'}));
  if(all){ const lim = addDays(t,-POLITICA.reativarDias); const n = buildClients(all).filter(c=>c.ultima && c.ultima<=lim && !c.proxima).length; if(n) A.vendas.push({k:'reat:'+cur+':'+n, t:n+(n===1?' cliente':' clientes')+' sem voltar há '+POLITICA.reativarDias+' dias ou mais'}); }
  data.cli.filter(c=>c.nasc && /^\d{2}-\d{2}$/.test(c.nasc)).forEach(c=>{ const [mm,dd] = c.nasc.split('-').map(Number); const d = new Date(new Date().getFullYear(),mm-1,dd), t0 = new Date(); t0.setHours(0,0,0,0); const dias = Math.round((d-t0)/86400000); if(dias>=0 && dias<=3) A.vendas.push({k:'b:'+c.id+':'+d.getFullYear(), t:'Aniversário de '+(c.nome||'cliente')+(dias===0?' hoje':' em '+dias+(dias===1?' dia':' dias'))}); });
  // Financeiro
  data.agenda.filter(a=>!a.concluida && a.data<t).forEach(a=>A.financeiro.push({k:'conc:'+a.id, t:'Concluir a sessão de '+firstName(a.cliente)+' ('+shortDate(a.data)+') e lançar o que falta no caixa'}));
  const semValor = data.agenda.filter(a=>!a.concluida && a.data>=t && a.data<=addDays(t,30) && !(+a.valor>0)).length;
  if(semValor) A.financeiro.push({k:'semvalor:'+semValor, t:semValor+(semValor===1?' sessão sem':' sessões sem')+' valor combinado nos próximos 30 dias'});
  if(!(+data.cfg.custosFixos>0)) A.financeiro.push({k:'cf', t:'Informe os custos fixos em Ajustes para calcular o ponto de equilíbrio'});
  const f = mesFech(cur), meta = +data.cfg.meta||0, d0 = new Date().getDate(), dm = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
  if(meta>0 && d0>=10 && f.entradas/d0*dm < meta*0.5) A.financeiro.push({k:'ritmo:'+cur, t:'O ritmo do mês está abaixo da metade da meta'});
  autoPend().filter(p=>p.auto==='mat').forEach(p=>A.financeiro.push({k:'mat:'+p.ref, t:p.texto}));
  // Mídias
  const emSete = data.cont.some(c=>c.data>=t && c.data<=addDays(t,6));
  if(cloud && !emSete) A.midia.push({k:'semposts:'+t.slice(0,7)+':'+Math.floor(new Date().getDate()/7), t:'Nenhum post planejado para os próximos 7 dias'});
  data.cont.filter(c=>c.data===t && c.status!=='publicado').forEach(c=>A.midia.push({k:'hoje:'+c.id, t:'Postar hoje: '+c.ideia}));
  data.cont.filter(c=>c.data<t && c.data>=addDays(t,-7) && c.status!=='publicado' && c.status!=='agendado').forEach(c=>A.midia.push({k:'atras:'+c.id, t:'Post atrasado: '+c.ideia}));
  return A;
}
function avisosVistos(){ try{ return JSON.parse(localStorage.getItem('andre-avisos')||'{}'); }catch(e){ return {}; } }
function salvarVistos(v){ try{ localStorage.setItem('andre-avisos', JSON.stringify(v)); }catch(e){} }
function renderAvisos(){
  if(!$('dot-vendas')) return;
  const A = avisosAgentes(), v = avisosVistos();
  window.__avisos = A;
  ['financeiro','vendas','midia'].forEach(k=>{ const n = A[k].filter(x=>!v[x.k]).length; $('dot-'+k).hidden = !n; });
}
function mostrarAvisos(k, tudo){
  const A = window.__avisos || avisosAgentes(), v = avisosVistos();
  const lista = (A[k]||[]).filter(x=>tudo || !v[x.k]);
  if(lista.length) addMsg('ai', esc((tudo?'Avisos de hoje:\n':'Aviso novo:\n')+lista.map(x=>'• '+x.t).join('\n')));
  (A[k]||[]).forEach(x=>{ v[x.k] = Date.now(); });
  const ativos = {}; Object.keys(A).forEach(g=>A[g].forEach(x=>{ if(v[x.k]) ativos[x.k] = v[x.k]; }));
  salvarVistos(ativos); renderAvisos();
}

// ---------- Agentes (Financeiro, Vendas, Mídias) ----------
const POST_FORMATOS = ['Reels','Carrossel','Foto','Stories'];
const POST_PILARES = ['Portfólio','Processo','Educativo','Bastidores'];
const POST_STATUS = [{k:'ideia',n:'Ideia'},{k:'gravar',n:'Gravar'},{k:'editar',n:'Editar'},{k:'pronto',n:'Pronto'},{k:'agendado',n:'Agendado'},{k:'publicado',n:'Publicado'}];
const statusNome = k => (POST_STATUS.find(x=>x.k===k)||{n:k}).n;
let agenteAtual = 'geral', chipsGeral = null;
const AG = {
  geral:{ titulo:'Assistente', sub:'Lê os dados do app. Nada é salvo sem você confirmar.' },
  financeiro:{ titulo:'Financeiro', sub:'Caixa, meta e ponto de equilíbrio. Nada é salvo sem você confirmar.',
    ola:'Oi, André. Sou o agente financeiro. Olho o caixa, a meta, os custos e o ritmo do mês. Por onde começamos?',
    chips:[['Fechamento do mês','Faz o fechamento do mês atual, comparando com o mês passado e com a meta.'],['Como estou na meta?','Como estou em relação à meta do mês? Quantas sessões faltam no ticket atual e qual a projeção, marcando o que é estimativa.'],['Ponto de equilíbrio','Qual é o meu ponto de equilíbrio e quantas sessões preciso só para cobrir os custos fixos?'],['Para onde vai o dinheiro?','Analise meus gastos por categoria nos últimos meses e diga o que merece atenção.'],['Receita por hora','Qual é a minha receita por hora e o que eu poderia mudar para aumentar?'],['Quanto falta receber?','Quanto ainda tenho para receber das sessões marcadas?']] },
  vendas:{ titulo:'Vendas', sub:'Funil, retomadas e clientes antigos. Nada é salvo sem você confirmar.',
    ola:'Oi, André. Sou o agente de vendas. Cuido do funil de orçamentos, das retomadas e de quem está há tempo sem voltar. O que vamos fechar hoje?',
    chips:[['Prioridades de hoje','Quem eu devo contatar hoje para fechar mais rápido? Ordene por proximidade de fechar e dê a mensagem de cada um.'],['Orçamentos parados','Quais orçamentos estão parados? Escreva a mensagem de retomada de cada um, respeitando o limite de 2 retomadas.'],['Reativar clientes','Quais clientes antigos devo chamar de volta? Escreva uma mensagem pessoal para cada um.'],['Responder orçamento','__fill__Responder este orçamento:\n'],['Lidar com objeção','__fill__O cliente disse: '],['Como está o funil?','Como está meu funil de orçamentos? Onde estou perdendo gente e o que fazer primeiro?']] },
  midia:{ titulo:'Mídias', sub:'Plano de posts, legendas e horários. Nada é salvo sem você confirmar.',
    ola:'Oi, André. Sou o agente de mídias do @andretatuadoor. Monto a semana de posts, escrevo legendas e escolho os melhores horários. Me conta o que você tem de material gravado ou fotografado, ou peço que eu proponha o que filmar.',
    chips:[['Plano da semana','Monte o plano de posts desta semana (3 a 4 posts), com data, hora, formato, pilar, gancho, texto na tela, legenda e hashtags. Proponha cada post como ação.'],['Ideias de Reels','Me dê 5 ideias de Reels de processo e de resultado em realismo preto e cinza para eu gravar na próxima sessão.'],['Legenda de tattoo','__fill__Escreva a legenda desta tattoo finalizada: '],['O que postar hoje?','O que devo postar hoje e em qual horário, considerando o que já está planejado?'],['Melhores horários','Quais são os melhores dias e horários para postar, segundo os dados do Instagram?'],['Revisar a semana','Revise o plano de conteúdo da semana: tem equilíbrio de pilares, pelo menos um realismo preto e cinza e nenhuma repetição?']] }
};
const AG_REGRAS = {
  financeiro:`AGENTE FINANCEIRO. Papel: analista financeiro gerencial do estúdio. Priorize este papel; as regras de formato e de ações acima continuam valendo. Sempre diferencie faturamento, lucro e dinheiro disponível. Use fechamentoMesAtual, fechamentoMesPassado, ultimosMeses, ajustes.metaMensal e custosFixos. Calcule e explique: ticket médio, receita por hora (entradas divididas pelas horas das sessões, estimativa), ponto de equilíbrio (custos fixos divididos pelo ticket médio), sessões que faltam para a meta no ticket atual, projeção do mês (sempre marcada como estimativa, dizendo a base), gastos por categoria e o que merece atenção. Se faltar dado (custos fixos, comissão, impostos), peça só o número essencial ou trabalhe com cenários claramente marcados como hipótese. Não dê recomendação tributária nem de investimento; para MEI, DAS ou imposto, sugira conferir com um contador. Nunca sugira desconto para bater meta. No fechamento do mês: entradas, saídas, lucro, sinais, sessões, ticket médio, maiores gastos, meta e comparação com o mês anterior, e termine com 3 ações para o próximo mês baseadas só nos números.`,
  vendas:`AGENTE DE VENDAS. Papel: closer e CRM de tattoo premium. Priorize este papel; as regras de formato e de ações acima continuam valendo. Funil: novo, qualificado, orçamento enviado, aguardando decisão, sinal pago, agendado. Use orcamentos, clientes (sumidos há 90 dias ou mais), horariosLivres7dias e politica. Entenda antes de oferecer: ideia, tamanho, local, referência e foto da área, sem pedir de novo o que o cliente já mandou. O preço final só o Andre passa: use [VALOR] ou o valor que ele já cadastrou. Sinal: R$ 100 até R$ 1.000 e 20% acima, não reembolsável em cancelamento ou reagendamento, avisado antes da cobrança. Retomadas: no máximo 2 por orçamento (a 1ª após 3 dias sem contato, a 2ª após 7), depois só um encerramento gentil; nada de desconto, urgência ou escassez falsa; só cite horário livre se estiver em horariosLivres7dias. Objeções (preço, momento, dúvida, comparação, medo, indecisão): responda com clareza e sem argumentar demais; preço nunca vira desconto, explique tamanho, complexidade, criação e execução. Clientes antigos: mensagem pessoal citando o projeto, no máximo uma a cada 3 meses. Entregue as mensagens prontas em ações mensagem_livre (uma por cliente, até 5 linhas, tom formal que ganha intimidade, tratando pelo nome) e registre novos pedidos com a ação orcamento. Priorize quem está mais perto de fechar, depois quem está parado, e termine dizendo o que fazer primeiro e a métrica que mostra se funcionou (conversas, sinais, conversão).`,
  midia:`AGENTE DE MÍDIAS SOCIAIS do @andretatuadoor. Priorize este papel; as regras de formato acima continuam valendo. Objetivo: atrair projetos grandes de realismo preto e cinza, com orgânico como base e anúncio de R$ 20/dia a partir de 08/10/2026 (sem preço nem antes e depois na peça). Voz: artista sofisticado e reservado, formal, sem gíria. Monte a semana com 3 a 4 posts misturando pilares: Portfólio (tattoo finalizada), Processo (estêncil, aplicação, antes e depois), Educativo (cuidados, retoque, dúvidas) e Bastidores. Pelo menos 1 post por semana de realismo preto e cinza; nunca repita ideia nem primeira linha na mesma semana. O gancho dos 3 primeiros segundos mostra o trabalho, nunca o rosto dizendo "oi gente". Texto na tela com até 8 palavras. Legenda: gancho de 1 linha, 1 a 2 linhas de técnica ou contexto, chamada para o link da bio e 5 hashtags (estilo, tema e local, como #realismopretoecinza, #tattooleao, #tattoosp, #vilamatilde, #andretattoo). Nomes de estilo: realismo preto e cinza, realismo colorido, fine line, delicado, aquarela, blackwork, cobertura, fechamento; nunca rotule por técnica (por exemplo, pontilhismo). Nunca cite preço, nome ou história de cliente sem autorização, nem invente promoção, depoimento ou significado. Para cuidados pós-tattoo, use só o texto oficial já usado no app. Use conteudoSemana para não repetir o que já está planejado, instagram e melhoresHorarios para escolher dias e horas, e agendaProxima para ideias de processo e bastidor. Pergunte só o que faltar sobre o material que ele tem; sem material, proponha o que filmar na próxima sessão. Para cada post, proponha uma ação do tipo post neste formato: {"tipo":"post","data":"AAAA-MM-DD","hora":"HH:MM","formato":"Reels|Carrossel|Foto|Stories","pilar":"Portfólio|Processo|Educativo|Bastidores","ideia":"o que mostrar","gancho":"primeiros 3 segundos","textoTela":"até 8 palavras","legenda":"legenda completa","hashtags":"#a #b #c #d #e"}. O Andre agenda no Metricool; você não publica nada.`
};
function regrasAgente(){ return RULES + (AG_REGRAS[agenteAtual] ? '\n\n'+AG_REGRAS[agenteAtual] : '') + regrasExtra(); }
function igResumoAgente(){
  if(!instaData) return 'não carregado (o Andre abre Mais > Instagram para carregar)';
  const C = instaData.cur, f = i => C.soma(i);
  const slots = []; (instaData.best||[]).forEach(dd=>(dd.bestTimesByHour||[]).forEach(h=>slots.push({dia:NOME_DIA[dd.dayOfWeek]||String(dd.dayOfWeek), hora:h.hourOfDay, v:h.value})));
  slots.sort((a,b)=>b.v-a.v);
  return { periodoDias:instaData.dias, seguidores:C.ultimo(0), alcance:f(2), visualizacoes:f(1), interacoes:f(3), salvos:f(4), compartilhados:f(5), reelsPublicados:f(8), melhoresHorarios:slots.slice(0,6).map(x=>x.dia+' '+pad(x.hora)+'h') };
}
async function snapshotAgente(){
  const s = await snapshotData(), t = today();
  if(agenteAtual==='financeiro'){
    const all = caixaCache || data.caixa, ms = []; let m = curMes();
    for(let i=0;i<6;i++){ ms.unshift(fechamento(all, m)); m = prevMonth(m); }
    s.ultimosMeses = ms; s.custosFixos = +data.cfg.custosFixos||0;
    ['clientes','horariosLivres7dias','estilosValidos'].forEach(k=>delete s[k]);
    return s;
  }
  if(agenteAtual==='vendas'){ ['lancamentosCaixa','materiais','previsaoAgulhas','fechamentoMesPassado'].forEach(k=>delete s[k]); return s; }
  if(agenteAtual==='midia'){
    return { hoje:s.hoje, diaDaSemana:s.diaDaSemana, estilosValidos:s.estilosValidos, politica:{semPrecoEmPost:true, semNomeDeClienteSemAutorizacao:true},
      agendaProxima:data.agenda.filter(a=>!a.concluida && a.data>=t).slice(0,10).map(a=>({data:a.data, hora:a.hora||undefined, estilo:a.estilo||undefined, tattoo:a.tattoo||undefined})),
      conteudoSemana:data.cont.filter(c=>c.data>=addDays(t,-7)).map(c=>({data:c.data, hora:c.hora||undefined, formato:c.formato, pilar:c.pilar, ideia:c.ideia, status:c.status})),
      instagram:igResumoAgente() };
  }
  return s;
}
function ensureInsta(){
  if(instaSt!=='idle') return;
  (async()=>{ let st='prompt'; try{ const perm = await window.claude.use('permissions'); if(perm) st = await perm.state('mcp:'+MET).catch(()=> 'unavailable'); }catch(e){} if(st==='granted') loadInsta(); })();
}
function abrirAgente(k){
  if(chatBusy && k!==agenteAtual){ toast('Aguarde o agente terminar de responder.'); openChat(); return; }
  if(chipsGeral===null) chipsGeral = $('chatSug').innerHTML;
  const a = AG[k] || AG.geral, mudou = (k!==agenteAtual);
  agenteAtual = AG[k] ? k : 'geral';
  document.querySelector('.chat-h .ttl').textContent = a.titulo;
  document.querySelector('.chat-h .sub2').textContent = a.sub;
  if(mudou){
    chatTurns = []; $('chatBody').innerHTML = '';
    $('chatSug').innerHTML = agenteAtual==='geral' ? chipsGeral : a.chips.map(c=>'<button '+(String(c[1]).startsWith('__fill__') ? 'data-fill="'+esc(String(c[1]).slice(8)).replace(/"/g,'&quot;').replace(/\n/g,'&#10;')+'"' : 'data-q="'+esc(c[1]).replace(/"/g,'&quot;')+'"')+'>'+esc(c[0])+'</button>').join('');
    if(agenteAtual!=='geral') addMsg('ai', esc(a.ola));
  }
  if(agenteAtual!=='geral') mostrarAvisos(agenteAtual, mudou);
  openChat();
  if(agenteAtual==='midia') ensureInsta();
}

// ---------- Conteúdo da semana ----------
function renderSemana(){
  const el = $('semanaList'); if(!el) return;
  const t = today(), fim = addDays(t,6);
  const todos = [...data.cont].sort((a,b)=>(a.data+(a.hora||'')).localeCompare(b.data+(b.hora||'')));
  const sem = todos.filter(c=>c.data>=t && c.data<=fim), prox = todos.filter(c=>c.data>fim), ant = todos.filter(c=>c.data<t && c.data>=addDays(t,-7));
  const feitos = sem.filter(c=>c.status==='publicado').length;
  $('semanaSub').textContent = sem.length ? sem.length+(sem.length===1?' post nesta semana':' posts nesta semana')+', '+feitos+' publicado'+(feitos===1?'':'s')+'.' : 'Nenhum post planejado para os próximos 7 dias.';
  const card = c => '<div class="card col"><div class="rowtop"><div class="main"><div class="t" style="white-space:normal">'+esc(c.ideia)+'</div><div class="s">'+esc(shortDate(c.data)+(c.hora?' às '+c.hora:'')+' · '+c.formato+' · '+c.pilar)+'</div></div><span class="pill'+(c.status==='publicado'?' good':'')+'">'+esc(statusNome(c.status))+'</span></div>'
    +(c.gancho?'<div class="note"><b>Gancho:</b> '+esc(c.gancho)+(c.textoTela?'<br><b>Na tela:</b> '+esc(c.textoTela):'')+'</div>':'')
    +'<div class="acts">'+(c.legenda?'<button class="mini solid" data-act="postCopy" data-id="'+esc(c.id)+'">Copiar legenda</button>':'')+(c.status!=='publicado'?'<button class="mini" data-act="postNext" data-id="'+esc(c.id)+'">Avançar</button>':'')+'<button class="mini" data-act="editPost" data-id="'+esc(c.id)+'">Editar</button></div></div>';
  let h = '';
  if(sem.length) h += '<div class="sec">Próximos 7 dias</div>'+sem.map(card).join('');
  if(prox.length) h += '<div class="sec">Depois</div>'+prox.map(card).join('');
  if(ant.length) h += '<div class="sec">Últimos 7 dias</div>'+ant.map(card).join('');
  el.innerHTML = h || '<div class="empty">Peça ao agente de mídias o plano da semana, ou toque em <b>+ Novo post</b>.</div>';
}
function formPost(c, preset){
  openForm({ title:c?'Editar post':'Novo post', values:c?c:Object.assign({data:today(), formato:'Reels', pilar:'Portfólio', status:'ideia'}, preset||{}),
    fields:[
      {k:'data',label:'Data',type:'date'}, {k:'hora',label:'Horário',type:'time'},
      {k:'formato',label:'Formato',type:'chips',options:POST_FORMATOS}, {k:'pilar',label:'Pilar',type:'chips',options:POST_PILARES},
      {k:'ideia',label:'Ideia',ph:'O que vai mostrar'}, {k:'gancho',label:'Gancho (3 primeiros segundos)',ph:'Mostra o trabalho'}, {k:'textoTela',label:'Texto na tela (até 8 palavras)'},
      {k:'legenda',label:'Legenda',type:'textarea'}, {k:'hashtags',label:'Hashtags',ph:'#realismopretoecinza ...'},
      {k:'status',label:'Etapa',type:'chips',options:POST_STATUS.map(x=>x.k)},
      {hint:'Nunca cite preço, nome ou história de cliente sem autorização.'}
    ],
    validate:v=> !v.ideia?'Escreva a ideia do post.': !v.data?'Escolha a data.':'',
    onSave: async v=>{ await stores.cont.save(Object.assign({}, c||{}, v, {id:c?c.id:newId('c'), criado:c?(c.criado||Date.now()):Date.now()})); return c?'Post salvo':'Post criado'; },
    onDelete: c ? ()=>stores.cont.remove(c.id) : null });
  document.querySelectorAll('.chips[data-k="status"] .chip').forEach(x=>{ x.textContent = statusNome(x.dataset.v); });
}

// ---------- Ajustes da casa (padrões novos x ajustes antigos) ----------
let cfgLoaded = false;
const DIAS_CASA = ['seg','ter','qua','qui','sex','sáb'];
function bannerPadroes(){
  if(!cfgLoaded || data.cfg.padraoV) return '';
  const c = data.cfg, meta = +c.meta>0 ? brl.format(+c.meta) : 'não definida';
  const dias = (c.dias||[]).length===7 ? 'todos os dias' : (c.dias||[]).join(', ');
  return '<div class="brief"><div class="bh"><span>Ajustes da casa</span></div><div style="padding:4px 14px 14px"><div class="s" style="white-space:normal;margin-bottom:12px;line-height:1.5">Seus ajustes são da versão antiga: meta '+esc(meta)+', atendimento '+esc(dias)+', das '+esc(c.inicio)+' às '+esc(c.fim)+'.<br>Padrão da casa: meta '+esc(brl.format(POLITICA.metaMensal))+', segunda a sábado, das 9h às 22h.</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="mini solid" data-act="padroesOk">Aplicar padrões</button><button class="mini" data-act="padroesNo">Manter os meus</button></div></div></div>';
}
async function aplicarPadroes(ok){
  try{
    const v = ok ? Object.assign({}, data.cfg, {meta:POLITICA.metaMensal, dias:DIAS_CASA.slice(), inicio:'09:00', fim:'22:00', padraoV:2}) : Object.assign({}, data.cfg, {padraoV:2});
    await cfgStore.save(v); toast(ok?'Padrões da casa aplicados':'Ajustes mantidos');
  }catch(e){ toast('Não foi possível salvar os ajustes.'); }
}

// ---------- Instagram (Metricool) ----------
const MET = 'METRICOOL';
const IG_M = ['IGEV01','IGEV05','IGEV06','IGEV09','IGEV15','IGEV40','IGEV43','IGEV44','IGEV22','IGEV23','IGEV42','IGEV37'];
// posições em IG_M: 0 seguidores, 1 visualizações, 2 alcance, 3 interações, 4 salvos, 5 compartilhamentos, 6 ganhos, 7 perdidos, 8 reels, 9 views de reels, 10 contas engajadas, 11 posts
let instaDias = 30, instaSt = 'idle', instaData = null, instaErr = '';
const NOME_DIA = ['','segunda','terça','quarta','quinta','sexta','sábado','domingo'];
const fmtN = n => (n==null||isNaN(n)) ? '–' : new Intl.NumberFormat('pt-BR').format(Math.round(n));
function mcParse(res){
  let p = res && res.payload;
  if(!p && res && res.content){ const tb = res.content.find(c=>c.type==='text'); if(tb) p = tb.text; }
  if(typeof p==='string'){ try{ p = JSON.parse(p); }catch(e){} }
  return p;
}
async function mcCall(tool, args){
  if(!mcp){ try{ mcp = await window.claude.use('mcp'); }catch(e){ mcp = null; } }
  if(!mcp) throw {code:'server_not_connected'};
  return mcParse(await mcp.callTool(MET, tool, args));
}
const isoDia = (ds, fim) => ds + (fim ? 'T23:59:59-03:00' : 'T00:00:00-03:00');
function igResumo(rows){
  const n = IG_M.length, num = v => (v==null||v==='') ? null : parseFloat(v);
  const dias = (rows||[]).filter(r=>Array.isArray(r) && r.length>n).map(r=>({d:String(r[n]), v:r.slice(0,n).map(num)})).sort((a,b)=>a.d.localeCompare(b.d));
  return {
    dias,
    soma: i => { let s=0, t=false; dias.forEach(x=>{ if(x.v[i]!=null){ s+=x.v[i]; t=true; } }); return t ? s : null; },
    ultimo: i => { for(let k=dias.length-1;k>=0;k--) if(dias[k].v[i]!=null) return dias[k].v[i]; return null; }
  };
}
async function loadInsta(){
  instaSt = 'loading'; renderInsta();
  try{
    const b = await mcCall('getBrandSettings', {});
    const list = (b && b.data) || [];
    const br = list.find(x=>x.networksData && x.networksData.instagramData) || list[0];
    if(!br) throw {code:'no_brand'};
    const t = today(), ini = addDays(t, -(instaDias-1)), pFim = addDays(ini, -1), pIni = addDays(pFim, -(instaDias-1));
    const q = (a, b2) => mcCall('getAnalyticsDataByMetrics', {brandId:String(br.id), from:isoDia(a), to:isoDia(b2,true), metrics:IG_M});
    const [cur, prev] = await Promise.all([q(ini, t), q(pIni, pFim)]);
    let best = [];
    try{ const bt = await mcCall('getBestTimeToPostByNetwork', {brandId:String(br.id), fromDate:isoDia(addDays(t,-6)), toDate:isoDia(t,true), timezone:br.timezone||'America/Sao_Paulo', socialNetwork:'instagram'}); best = (bt && bt.data) || []; }catch(e){}
    instaData = {conta:(br.networksData && br.networksData.instagramData) || br.label || '', cur:igResumo(cur && cur.rows), prev:igResumo(prev && prev.rows), best, dias:instaDias, em:Date.now()};
    instaSt = 'ok'; instaErr = '';
  }catch(e){
    const c = e && e.code; instaSt = 'err';
    instaErr = c==='needs_reauth' ? 'Reconecte o Metricool em Configurações › Conectores do Claude.'
      : (c==='server_not_connected') ? 'Adicione o Metricool em Configurações › Conectores do Claude.'
      : (c==='not_granted'||c==='consent_required'||c==='not_in_manifest'||c==='denied') ? 'O acesso ao Metricool não foi autorizado neste app. Toque em Tentar de novo e autorize.'
      : c==='no_brand' ? 'Não achei uma conta do Instagram no seu Metricool.'
      : c==='server_unavailable' ? 'O Metricool está fora do ar agora. Tente de novo em instantes.'
      : 'Não consegui buscar os números. Tente de novo.';
  }
  renderInsta();
}
function renderInsta(){
  const box = $('instaBox'); if(!box) return;
  $('instaChips').innerHTML = [7,30,90].map(d=>'<button class="chip" data-act="instaDias" data-d="'+d+'" aria-pressed="'+(instaDias===d)+'">'+d+' dias</button>').join('');
  if(instaSt==='idle'){ box.innerHTML = '<div class="empty">Veja alcance, seguidores, interações e os melhores horários para postar.<br><br><button class="btn primary" data-act="instaLoad" style="width:100%">Carregar números</button></div>'; return; }
  if(instaSt==='loading'){ box.innerHTML = '<div class="empty">Buscando no Metricool…</div>'; return; }
  if(instaSt==='err'){ box.innerHTML = '<div class="syncbar"><div class="s">'+esc(instaErr)+'</div><button class="mini" data-act="instaLoad">Tentar de novo</button></div>'; return; }
  const d = instaData, C = d.cur, P = d.prev;
  const pct = i => { const a = C.soma(i), b = P.soma(i); if(a==null || !(b>0)) return ''; const p = Math.round((a-b)/b*100); return '<small class="'+(p>=0?'up':'down')+'">'+(p>=0?'+':'')+p+'% vs período anterior</small>'; };
  const k = (rot, val, extra) => '<div class="kpi"><span>'+rot+'</span><strong class="num">'+val+'</strong>'+(extra||'')+'</div>';
  const seg = C.ultimo(0), gan = C.soma(6), per = C.soma(7);
  const delta = (gan!=null || per!=null) ? (gan||0)-(per||0) : null;
  const segExtra = delta==null ? '' : '<small class="'+(delta>=0?'up':'down')+'">'+(delta>=0?'+':'')+fmtN(delta)+' no período</small>';
  const reels = C.soma(8), rv = C.soma(9);
  const maxR = Math.max(1, ...C.dias.map(x=>x.v[2]||0));
  const bars = C.dias.length ? '<div class="rel" style="margin-top:10px"><div class="legend" style="margin:0 0 6px"><span>Alcance por dia</span></div><div class="bars" style="height:80px;gap:2px">'+C.dias.map(x=>'<div class="bar"><div class="cols"><i class="ci" style="width:100%;height:'+Math.max(2,Math.round((x.v[2]||0)/maxR*100))+'%"></i></div></div>').join('')+'</div></div>' : '';
  const slots = []; (d.best||[]).forEach(dd=>(dd.bestTimesByHour||[]).forEach(h=>slots.push({dia:dd.dayOfWeek, h:h.hourOfDay, v:h.value})));
  slots.sort((a,b)=>b.v-a.v);
  const top = slots.slice(0,5);
  const melhores = top.length ? '<div class="sec">Melhores horários</div><div class="rel">'+top.map(s=>'<div class="hbar"><div class="hl"><span>'+esc(NOME_DIA[s.dia]||'Dia '+s.dia)+', '+pad(s.h)+'h</span><span>'+Math.round(s.v/top[0].v*100)+'%</span></div><div class="hb"><i style="width:'+Math.round(s.v/top[0].v*100)+'%"></i></div></div>').join('')+'<p class="hint" style="margin:10px 0 0">Quando a sua audiência está mais ativa. O primeiro vale 100%.</p></div>' : '';
  box.innerHTML = '<div class="kpis">'+k('Seguidores', fmtN(seg), segExtra)+k('Alcance', fmtN(C.soma(2)), pct(2))+'</div>'
    +'<div class="kpis" style="margin-top:8px">'+k('Visualizações', fmtN(C.soma(1)), pct(1))+k('Interações', fmtN(C.soma(3)), pct(3))+'</div>'
    +'<div class="kpis" style="margin-top:8px">'+k('Salvos', fmtN(C.soma(4)), pct(4))+k('Compartilhados', fmtN(C.soma(5)), pct(5))+'</div>'
    +'<div class="kpis" style="margin-top:8px">'+k('Reels publicados', fmtN(reels), '<small>'+fmtN(rv)+' visualizações</small>')+k('Contas engajadas', fmtN(C.soma(10)), pct(10))+'</div>'
    +bars+melhores
    +'<p class="hint" style="margin-top:14px">Visitas ao perfil e cliques no link da bio não vêm do Metricool. Veja em Instagram › Insights. O alcance por dia soma pessoas que podem se repetir entre os dias. Atualizado '+esc(new Date(d.em).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))+'.</p>'
    +'<button class="btn ghost" data-act="instaLoad" style="width:100%;margin-top:6px">Atualizar</button>';
}

async function enviarPendentesGoogle(){
  if(!mcp){ toast('O Google Agenda não está conectado.'); return; }
  const t = today(); let ok = 0, falhas = 0;
  for(const a of data.agenda.filter(x=>!x.concluida && x.hora && x.data>=t && !x.googleId && !x.ignorado)){
    try{ const r = await googleCreate(a); if(r){ await stores.agenda.save(Object.assign({}, find('agenda', a.id)||a, {googleId:r.id, fim:r.fim})); ok++; } else falhas++; }catch(e){ falhas++; }
  }
  toast(ok ? ok+(ok===1?' sessão enviada':' sessões enviadas')+' ao Google Agenda'+(falhas?', '+falhas+' falharam':'') : 'Não consegui enviar ao Google Agenda.');
}

// ---------- Ações extras (chamadas pelo switch principal) ----------
function extraAct(act, b, id){
  switch(act){
    case 'segCli': setTab(b.dataset.v==='funil'?'funil':'cli'); break;
    case 'funilFiltro': funilFiltro = b.dataset.f; renderFunil(); break;
    case 'addOrc': if(tab!=='funil') setTab('funil'); formOrc(); break;
    case 'editOrc': { const o = find('orc', id); if(o) formOrc(o); break; }
    case 'orcNext': { const o = find('orc', id); if(!o) break; const i = ETAPAS.findIndex(e=>e.k===o.etapa); const nx = ETAPAS[Math.min(i+1, 3)].k; stores.orc.save(Object.assign({}, o, {etapa:nx, atualizado:Date.now(), ultimoContato: today()})).then(()=>toast('Etapa: '+etapaNome(nx))).catch(()=>toast('Não foi possível salvar.')); break; }
    case 'orcMsg': {
      const o = find('orc', id); if(!o) break; const t = b.dataset.t;
      const nome = t==='info' ? 'Pedir informações' : t==='proposta' ? 'Proposta com valor e sinal' : (orcEncerrar(o) ? 'Encerramento gentil' : 'Retomar orçamento');
      openTexto(nome, orcTexto(o, t), o.telefone||'', async()=>{
        const upd = Object.assign({}, o, {ultimoContato:today(), atualizado:Date.now()});
        if(t==='retomada') upd.followups = (+o.followups||0)+1;
        if(t==='info') upd.etapa = 'qualificado';
        if(t==='proposta') upd.etapa = 'orcamento';
        await stores.orc.save(upd); toast('Registrado');
      }, 'Marcar como enviada');
      break; }
    case 'orcAgendar': {
      const o = find('orc', id); if(!o) break;
      const v = +o.valor||0;
      stores.orc.save(Object.assign({}, o, {etapa:'agendado', atualizado:Date.now(), ultimoContato:today()})).catch(()=>{});
      formAgenda(null, {cliente:o.cliente, telefone:o.telefone||'', tattoo:o.ideia||'', estilo:o.estilo||null, valor:v||null});
      break; }
    case 'goFunil': setTab('funil'); break;
    case 'alertGo': {
      const x = (window.__hAl||[])[+b.dataset.i]; if(!x) break;
      if(x.act==='goFunil') setTab('funil'); else if(x.act==='goAgenda') setTab('agenda'); else if(x.act==='goCli') setTab('cli'); else if(x.act==='goSemana') setTab('semana'); else if(x.act==='googleSync') enviarPendentesGoogle(); else if(x.act==='agenteMidia') abrirAgente('midia');
      else if(x.act==='cliente'){ setTab('cli'); setTimeout(()=>{ renderClientes(true).then(()=>openCliente2(x.id)); }, 350); }
      break; }
    case 'regras': openRegras(); break;
    case 'pickDate': abrirCalendario(b.dataset.pick); break;
    case 'calDia': if(calState){ calState.sel = b.dataset.d; renderCal(); } break;
    case 'calPrev': calMes(-1); break;
    case 'calNext': calMes(1); break;
    case 'calHoje': if(calState){ calState.sel = today(); calState.ref = today().slice(0,7); renderCal(); } break;
    case 'calOk': calConfirma(); break;
    case 'agente': abrirAgente(b.dataset.k); break;
    case 'goSemana': setTab('semana'); break;
    case 'addPost': formPost(); break;
    case 'editPost': { const c = find('cont', id); if(c) formPost(c); break; }
    case 'postNext': { const c = find('cont', id); if(!c) break; const i = POST_STATUS.findIndex(x=>x.k===c.status); const nx = POST_STATUS[Math.min(i+1, POST_STATUS.length-1)].k; stores.cont.save(Object.assign({}, c, {status:nx})).then(()=>toast('Etapa: '+statusNome(nx))).catch(()=>toast('Não foi possível salvar.')); break; }
    case 'postCopy': { const c = find('cont', id); if(!c) break; const tx = (c.legenda||'')+(c.hashtags?'\n\n'+c.hashtags:''); (navigator.clipboard ? navigator.clipboard.writeText(tx) : Promise.reject()).then(()=>toast('Legenda copiada')).catch(()=>{ openTexto('Legenda', tx, false); }); break; }
    case 'padroesOk': aplicarPadroes(true); break;
    case 'padroesNo': aplicarPadroes(false); break;
    case 'instaLoad': loadInsta(); break;
    case 'instaDias': instaDias = +b.dataset.d; if(instaSt==='ok' || instaSt==='err') loadInsta(); else renderInsta(); break;
    case 'openInsta': {
      setTab('insta');
      if(instaSt==='idle'){ (async()=>{ let st='prompt'; try{ const perm = await window.claude.use('permissions'); if(perm) st = await perm.state('mcp:'+MET).catch(()=> 'unavailable'); }catch(e){} if(st==='granted') loadInsta(); })(); }
      break; }
    case 'exportJson': exportar('json'); break;
    case 'exportCsv': exportar('csv'); break;
    case 'sugOk': decidirSug(id, true); break;
    case 'sugNo': decidirSug(id, false); break;
  }
}

if(!document.querySelector('[data-view="'+tab+'"]')) tab = 'hoje';
renderAll(); moveInd();
riseCards(document.querySelector('[data-view="'+tab+'"]'));
connectCloud();
})();
