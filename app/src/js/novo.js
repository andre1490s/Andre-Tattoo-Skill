
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
  return data.orc.filter(o=>ATIVAS.includes(o.etapa) || orcDias(o)<=30).map(o=>({ id:o.id, cliente:o.cliente, etapa:o.etapa, ideia:o.ideia||undefined, estilo:o.estilo||undefined, valor:+o.valor||0, followups:+o.followups||0, ultimoContato:o.ultimoContato||msToDs(o.criado), diasSemContato:orcDias(o), parado:orcParado(o)||undefined }));
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
      +'<div class="s" style="white-space:normal">'+badge+esc(dias===0?'contato hoje':dias+(dias===1?' dia':' dias')+' sem contato')+(+o.followups?', '+o.followups+(o.followups==1?' retomada':' retomadas'):'')+(v>0?' · '+(masked?'R$ ••••':esc(brl.format(v)))+', sinal '+(masked?'R$ ••••':esc(brl.format(sinalDe(v)))):'')+'</div>'
      +(o.notas?'<div class="note">'+esc(o.notas)+'</div>':'')
      +'<div class="acts">'+(msgBtn?'<button class="mini solid" data-act="orcMsg" data-id="'+esc(o.id)+'" data-t="'+msgBtn[0]+'">'+msgBtn[1]+'</button>':'')+next+(ATIVAS.includes(o.etapa)?'<button class="mini" data-act="orcAgendar" data-id="'+esc(o.id)+'">Marcar sessão</button>':'')+'<button class="mini" data-act="editOrc" data-id="'+esc(o.id)+'">Editar</button></div></div>';
  }).join('');
  const nOrc = parados.length; const bg = $('orcBadge'); if(bg){ bg.hidden = !nOrc; bg.textContent = nOrc; }
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
      {k:'etapa',label:'Etapa',type:'chips',options:ETAPAS.map(e=>e.k)},
      {k:'notas',label:'Observações',type:'textarea'}
    ].map(f=> f.k==='etapa' ? Object.assign({}, f, {options:ETAPAS.map(e=>e.k)}) : f),
    validate:v=> !v.cliente?'Digite o nome do cliente.':'',
    onSave: async v=>{
      const rec = Object.assign({}, o||{}, v, {id:o?o.id:newId('o'), valor:v.valor||0, followups:o?(+o.followups||0):0, criado:o?(o.criado||Date.now()):Date.now(), atualizado:Date.now(), ultimoContato:o?(o.ultimoContato||today()):today()});
      await stores.orc.save(rec); return o?'Orçamento salvo':'Orçamento criado';
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
  window.__hAl = al;
  $('hAlerts').innerHTML = al.length ? '<div class="brief"><div class="bh"><span>Atenção</span><small>'+al.length+'</small></div>'+al.map((x,i)=>'<button data-act="alertGo" data-i="'+i+'"><span class="ic'+(x.red?' red':'')+'">'+esc(x.ic)+'</span><span class="main"><div class="t">'+esc(x.t)+'</div><div class="s">'+esc(x.s||'')+'</div></span></button>').join('')+'</div>' : '';
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
      const pacote = { gerado:dia, app:'Caixa Andre Tattoo', caixa, agenda:allAgenda, pendencias:data.pend, materiais:data.mat, orcamentos:data.orc, clientes:data.cli, config:data.cfg };
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
function addFeedback(msgEl, pergunta, resposta, res){
  if(!DBREF) return;
  const id = newId('i');
  const doc = { ts:Date.now(), dia:today(), pergunta:String(pergunta).slice(0,1500), resposta:String(resposta).slice(0,2500), acoes:((res&&res.acoes)||[]).map(a=>a&&a.tipo).filter(Boolean), feedback:'', nota:'', regrasV:learn.regras.versao||0 };
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
   +(L.length ? L.slice(0,15).map(x=>'<div class="card"><div class="main" style="padding:12px"><div class="t">'+esc(x.pergunta)+'</div><div class="s">'+esc(shortDate(x.dia||today()))+' · '+(x.acoes&&x.acoes.length?esc(x.acoes.join(', '))+' · ':'')+'</div>'+(x.nota?'<div class="s" style="white-space:normal">Nota: '+esc(x.nota)+'</div>':'')+'</div><div style="padding:0 8px">'+fbPill(x)+'</div></div>').join('') : '<div class="empty">As conversas com o Assistente aparecem aqui, com a sua avaliação.</div>');
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
      if(x.act==='goFunil') setTab('funil'); else if(x.act==='goAgenda') setTab('agenda'); else if(x.act==='goCli') setTab('cli');
      else if(x.act==='cliente'){ setTab('cli'); setTimeout(()=>{ renderClientes(true).then(()=>openCliente2(x.id)); }, 350); }
      break; }
    case 'regras': openRegras(); break;
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
