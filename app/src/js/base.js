/* PARTE 1 do closure do app (lógica herdada e adaptada). Continua em novo.js. */
(function(){
  const $ = id => document.getElementById(id);
  const brl = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  const pad = n => String(n).padStart(2,'0');
  const today = () => { const d=new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };
  const newId = p => p+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  const esc = s => { const d=document.createElement('div'); d.textContent = s==null?'':String(s); return d.innerHTML; };
  const dayLabel = ds => { const [y,m,d]=ds.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}); };
  const shortDate = ds => { const [y,m,d]=ds.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('pt-BR',{day:'numeric',month:'short'}); };
  function parseNum(s){
    s = String(s==null?'':s).replace(/[^\d,.-]/g,'');
    if(s.includes(',')) s = s.replace(/\./g,'').replace(',','.');
    const n = parseFloat(s); return isFinite(n) ? Math.round(n*100)/100 : NaN;
  }
  const addDays = (ds,n) => { const [y,m,d]=ds.split('-').map(Number); const x=new Date(y,m-1,d+n); return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate()); };
  const daysSince = ds => { const [y,m,d]=ds.split('-').map(Number); const a=new Date(y,m-1,d), b=new Date(); b.setHours(0,0,0,0); return Math.round((b-a)/86400000); };
  const firstName = n => { const w = String(n||'').replace(/[^\p{L}\s'-]/gu,' ').split(/\s+/).filter(x=>x && !/^(tattoo|tatuagem|tatto|tatoo)$/i.test(x)); return w[0] || ''; };
  const fmtNum = n => (n==null||n==='') ? '' : String(n).replace('.',',');

  // ---------- Estado ----------
  let mes = today().slice(0,7);
  let tab = 'caixa';
  try{ tab = localStorage.getItem('andre-tab2') || 'hoje'; }catch(e){}
  const data = { caixa:[], agenda:[], pend:[], mat:[], orc:[], cli:[] };
  let masked = false;
  try{ masked = localStorage.getItem('andre-mask')==='1'; }catch(e){}
  const money = v => '<span class="mval">'+(masked ? 'R$ ••••' : esc(brl.format(v)))+'</span>';
  let lastLucro = null, lucroAnim = null;
  let allAgenda = []; // inclui eventos do Google que você removeu do app (para não voltarem)

  // ---------- Armazenamento ----------
  // Nuvem: Caixa fica em data/users/<id> (mesmo lugar da V1); as abas novas em subcoleções.
  // Sem nuvem: guarda só neste aparelho.
  const LS = { caixa:'caixa-andre-lancamentos', agenda:'andre-agenda', pend:'andre-pendencias', mat:'andre-materiais', orc:'andre-orcamentos', cli:'andre-clientes' };
  function localStore(name){
    const listeners = new Set();
    const all = () => { try{ return JSON.parse(localStorage.getItem(LS[name])||'[]'); }catch(e){ return []; } };
    const write = arr => { try{ localStorage.setItem(LS[name], JSON.stringify(arr)); }catch(e){} listeners.forEach(f=>f()); };
    return {
      subscribe(filter, cb){ const f=()=>cb(all().filter(filter||(()=>true))); listeners.add(f); f(); return ()=>listeners.delete(f); },
      async all(){ return all(); },
      async save(it){ write(all().filter(x=>x.id!==it.id).concat([it])); },
      async remove(id){ write(all().filter(x=>x.id!==id)); }
    };
  }
  let stores = { caixa:localStore('caixa'), agenda:localStore('agenda'), pend:localStore('pend'), mat:localStore('mat'), orc:localStore('orc'), cli:localStore('cli') };
  const CFG_DEFAULT = {meta:20000, inicio:'09:00', fim:'22:00', dias:['seg','ter','qua','qui','sex','sáb'], duracao:3, reativados:{}, custosFixos:0};
  data.cfg = Object.assign({}, CFG_DEFAULT);
  let cfgStore = {
    subscribe(cb){ let v={}; try{ v = JSON.parse(localStorage.getItem('andre-config')||'{}'); }catch(e){} cb(v); return ()=>{}; },
    async save(v){ try{ localStorage.setItem('andre-config', JSON.stringify(v)); }catch(e){} data.cfg = Object.assign({}, CFG_DEFAULT, v); renderAll(); }
  };
  let cloud = null; // {col(name)}
  const unsubs = {};

  function cloudStore(col, monthFilter){
    return {
      subscribe(filter, cb, m){
        const q = monthFilter && m ? col.where('mes','==',m) : col;
        return q.onSnapshot(s => cb(s.docs.map(d=>Object.assign({id:d.id}, d.data()))), () => toast('Não foi possível atualizar. Abra o app de novo.'));
      },
      async all(){ const snap = await col.get(); return snap.docs.map(d=>Object.assign({id:d.id}, d.data())).filter(x=>monthFilter?x.kind:true); },
      async save(it){ const body = Object.assign({}, it); delete body.id; await col.doc(it.id).set(body); },
      async remove(id){ await col.doc(id).delete(); }
    };
  }

  function subscribeAll(){
    Object.values(unsubs).forEach(u=>{ try{u();}catch(e){} });
    subscribeCaixa();
    unsubs.cfg = cfgStore.subscribe(v => { data.cfg = Object.assign({}, CFG_DEFAULT, v||{}); renderAll(); });
    ['agenda','pend','mat','orc','cli'].forEach(n => { unsubs[n] = stores[n].subscribe(null, list => { if(n==='agenda'){ allAgenda=list; list=list.filter(a=>!a.ignorado); } data[n]=list; renderAll(); }); });
  }
  function subscribeCaixa(){
    if(unsubs.caixa) try{ unsubs.caixa(); }catch(e){}
    unsubs.caixa = stores.caixa.subscribe(x=>x.mes===mes, list => { data.caixa = list; renderAll(); }, mes);
  }

  async function connectCloud(){
    if(!window.claude || typeof window.claude.use!=='function') return setOffline();
    try{
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if(!db || !user) return setOffline();
      const uid = await user.id();
      if(!uid) return setOffline();
      const base = 'data/users/'+uid;
      stores = {
        caixa: cloudStore(db.collection(base), true),
        agenda: cloudStore(db.doc(base+'/agenda').collection('itens')),
        pend: cloudStore(db.doc(base+'/pendencias').collection('itens')),
        mat: cloudStore(db.doc(base+'/materiais').collection('itens')),
        orc: cloudStore(db.doc(base+'/orcamentos').collection('itens')),
        cli: cloudStore(db.doc(base+'/clientes').collection('itens'))
      };
      DBREF = db;
      const cfgDoc = db.collection(base).doc('config');
      cfgStore = {
        subscribe(cb){ return cfgDoc.onSnapshot(sn => cb(sn.exists ? sn.data() : {}), ()=>{}); },
        async save(v){ await cfgDoc.set(v); }
      };
      cloud = true;
      setupGoogle();
      setupLearning();
      setupAssistant();
      $('sync').textContent = 'Salvo na nuvem';
      $('notice').innerHTML = '';
      subscribeAll();
    }catch(e){ setOffline(); }
  }
  function setOffline(){
    $('sync').textContent = 'Só neste aparelho';
    $('notice').innerHTML = '<div class="notice">Abra pelo link do Claude, com sua conta conectada, para salvar na nuvem e ver os dados em qualquer aparelho.</div>';
    subscribeAll();
  }

  // ---------- Agulhas: regras do estúdio ----------
  const NEEDLES = ['5RL','15MG','25MG'];
  const NEEDLE_NAME = {'5RL':'5RL','15MG':'15 Magnum','25MG':'25 Magnum'};
  const ESTILOS = ['Realismo P&C','Fechamento','Blackwork','Aquarela','Fine line','Delicada','Outro'];
  const PESADOS = ['Realismo P&C','Fechamento','Blackwork','Aquarela'];
  // Todo cliente usa no mínimo 1 agulha 5RL. Realismo, fechamento, blackwork e aquarela usam também 15MG e 25MG.
  function kitFor(estilo){ return PESADOS.includes(estilo) ? {'5RL':1,'15MG':1,'25MG':1} : {'5RL':1,'15MG':0,'25MG':0}; }
  const needleItem = code => data.mat.find(m=>m.agulha===code);
  function needleForecast(){
    const t = today();
    const futuras = data.agenda.filter(a=>!a.concluida && a.data>=t);
    const precisa = {'5RL':0,'15MG':0,'25MG':0};
    futuras.forEach(a=>{ const k=kitFor(a.estilo); NEEDLES.forEach(c=>precisa[c]+=k[c]); });
    const semEstilo = futuras.filter(a=>!a.estilo).length;
    return {precisa, semEstilo, sessoes:futuras.length};
  }

  // ---------- Pendências automáticas ----------
  function autoPend(){
    const t = today(), out = [];
    data.agenda.filter(a=>!a.concluida && a.data < t).sort((a,b)=>a.data.localeCompare(b.data)).forEach(a=>{
      out.push({auto:'agenda', ref:a.id, texto:'Concluir sessão de '+a.cliente, sub:'Sessão de '+shortDate(a.data)+', lance o restante no caixa.'});
    });
    const amanha = addDays(t,1);
    data.agenda.filter(a=>!a.concluida && (a.data===t || a.data===amanha) && !a.lembrado).forEach(a=>{
      out.push({auto:'msg', kind:'lembrete', ref:a.id, texto:'Enviar lembrete para '+a.cliente, sub:'Sessão '+(a.data===t?'hoje':'amanhã')+(a.hora?' às '+a.hora:'')+'.'});
    });
    data.agenda.filter(a=>a.concluida).forEach(a=>{
      const d = daysSince(a.data);
      if(!a.msgCuidados && d<=2) out.push({auto:'msg', kind:'cuidados', ref:a.id, texto:'Enviar cuidados para '+a.cliente, sub:'Texto oficial de cuidados pós-tattoo.'});
      else if(!a.msg7 && d>=7 && d<40) out.push({auto:'msg', kind:'d7', ref:a.id, texto:'Perguntar da cicatrização de '+a.cliente, sub:'Sessão foi há '+d+' dias.'});
      else if(!a.msg40 && d>=40 && d<90) out.push({auto:'msg', kind:'d40', ref:a.id, texto:'Pedir foto e avaliação de '+a.cliente, sub:'Tattoo já cicatrizada.'});
    });
    const fc = needleForecast();
    NEEDLES.forEach(c=>{
      const it = needleItem(c); if(!it) return;
      const falta = fc.precisa[c] - (+it.qtd||0);
      if(falta>0) out.push({auto:'mat', ref:it.id, texto:(falta>1?'Faltam ':'Falta ')+falta+' agulha'+(falta>1?'s':'')+' '+NEEDLE_NAME[c], sub:'As sessões marcadas precisam de '+fc.precisa[c]+', você tem '+fmtNum(+it.qtd||0)+'.'});
    });
    data.mat.filter(m=>+m.qtd < +m.minimo && !(m.agulha && fc.precisa[m.agulha] > (+m.qtd||0))).forEach(m=>{
      out.push({auto:'mat', ref:m.id, texto:'Comprar '+m.nome, sub:'Tem '+fmtNum(+m.qtd)+', mínimo '+fmtNum(+m.minimo)+'.'});
    });
    return out;
  }

  // ---------- Telas ----------
  function renderAll(){ renderCaixa(); renderAgenda(); renderPend(); renderMat(); renderHoje(); renderFunil(); renderMais(); renderAprend(); renderRel(); renderChrome(); }

  function renderChrome(){
    document.querySelectorAll('[data-view]').forEach(s=>s.hidden = s.dataset.view!==tab);
    document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected', String(b.dataset.tab===pt(tab))));
    const n = data.pend.filter(p=>!p.feito).length + autoPend().length;
    const bd = $('pendBadge'); bd.hidden = !n; bd.textContent = n;
    const ab = $('actionbar');
    const map = {
      caixa:'<button class="btn primary" data-act="addIn">+ Entrada</button><button class="btn ghost" data-act="addOut">− Saída</button>',
      agenda:'<button class="btn primary" data-act="addAgenda">+ Marcar sessão</button>',
      pend:'<button class="btn primary" data-act="addPend">+ Nova pendência</button>',
      mat:'<button class="btn primary" data-act="addMat">+ Novo material</button>',
      cli:'<button class="btn primary" data-act="addAgenda">+ Marcar sessão</button>',
      funil:'<button class="btn primary" data-act="addOrc">+ Novo orçamento</button>'
    };
    if(ab.dataset.tab!==tab){ ab.innerHTML = map[tab]||''; ab.className = 'in-bar'+(tab==='caixa'?' two':''); ab.dataset.tab = tab; }
  }

  const nf = new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const lucroHTML = v => '<span class="cur">R$</span><span class="mval">'+esc(nf.format(v))+'</span>';
  function fit(el, maxPx){
    if(!el) return; el.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(el).fontSize); let n = 0;
    while(el.scrollWidth > el.clientWidth + 1 && fs > 18 && n++ < 40){ fs -= 2; el.style.fontSize = fs+'px'; }
  }
  function animateLucro(v){
    const el = $('lucro');
    if(lucroAnim) cancelAnimationFrame(lucroAnim);
    if(masked){ el.innerHTML = '<span class="cur">R$</span><span class="mval">••••</span>'; lastLucro = v; return; }
    const from = (lastLucro==null) ? v : lastLucro;
    lastLucro = v;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || from===v){ el.innerHTML = lucroHTML(v); fit(el); return; }
    const t0 = performance.now(), dur = 650;
    const step = now => {
      const k = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-k,3);
      el.innerHTML = lucroHTML(from + (v-from)*e);
      if(k<1) lucroAnim = requestAnimationFrame(step); else { el.innerHTML = lucroHTML(v); fit(el); }
    };
    lucroAnim = requestAnimationFrame(step);
  }
  function flash(el){ if(!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  function monthLabel(m){ const [y,mm]=m.split('-').map(Number); return new Date(y,mm-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}); }

  function renderCaixa(){
    const [yy,mm] = mes.split('-').map(Number);
    $('monthName').textContent = new Date(yy,mm-1,1).toLocaleDateString('pt-BR',{month:'long'});
    $('yearName').textContent = yy;
    const items = data.caixa;
    const ins = items.filter(x=>x.kind==='in'), outs = items.filter(x=>x.kind==='out');
    const tIn = ins.reduce((s,x)=>s+(+x.valor||0),0), tOut = outs.reduce((s,x)=>s+(+x.valor||0),0);
    const sessoes = ins.filter(x=>x.tipo==='Sessão').length, lucro = tIn - tOut;
    document.body.classList.toggle('masked', masked);
    $('eyeBtn').setAttribute('aria-pressed', String(masked));
    $('eyeBtn').setAttribute('aria-label', masked ? 'Mostrar valores' : 'Ocultar valores');
    $('lucro').classList.toggle('neg', lucro<0 && !masked);
    animateLucro(lucro);
    $('totIn').innerHTML = money(tIn); $('totOut').innerHTML = money(tOut);
    $('nIn').textContent = ins.length+(ins.length===1?' lançamento':' lançamentos');
    $('nOut').textContent = outs.length+(outs.length===1?' lançamento':' lançamentos');
    $('sessoes').textContent = sessoes; $('ticket').innerHTML = money(sessoes ? tIn/sessoes : 0);
    $('lancCount').textContent = items.length || '';
    requestAnimationFrame(()=>{ fit($('totIn')); fit($('totOut')); fit($('ticket')); });
    drawNeedle(items);
    renderMeta();
    renderHomeNext();
    const el = $('caixaList');
    if(!items.length){ el.innerHTML = '<div class="empty">Nenhum lançamento em '+esc(monthLabel(mes))+'.<br>Toque em <b>+ Entrada</b> depois de atender.</div>'; return; }
    const sorted = [...items].sort((a,b)=>(b.data||'').localeCompare(a.data||'') || (b.criado||0)-(a.criado||0));
    let h='', last='';
    for(const it of sorted){
      if(it.data!==last){ last=it.data; h+='<div class="day">'+esc(dayLabel(it.data))+'</div>'; }
      const isIn = it.kind==='in';
      const t = isIn ? (it.cliente||it.descricao||'Entrada') : (it.descricao||it.categoria||'Saída');
      const s = isIn ? [it.tipo, it.pagamento, it.cliente?it.descricao:''].filter(Boolean).join(', ') : (it.categoria||'');
      h+='<div class="card"><button class="open" data-act="editCaixa" data-id="'+esc(it.id)+'"><span class="main"><div class="t">'+esc(t)+'</div><div class="s">'+esc(s)+'</div></span><span class="v num '+(isIn?'in':'out')+'">'+(isIn?'+':'−')+money(+it.valor||0)+'</span></button></div>';
    }
    el.innerHTML = h;
  }

  // Linha da agulha: lucro acumulado dia a dia, traçado como um traço de tattoo
  let lastNeedleKey = '';
  function drawNeedle(items){
    const [y,m] = mes.split('-').map(Number);
    const dim = new Date(y,m,0).getDate();
    const t = today(), cur = t.slice(0,7)===mes;
    const lastDay = cur ? +t.slice(8,10) : (mes < t.slice(0,7) ? dim : 0);
    $('nEnd').textContent = cur ? 'hoje' : 'dia '+dim;
    const daily = new Array(dim+1).fill(0);
    items.forEach(it=>{ const d=+String(it.data).slice(8,10); if(d>=1&&d<=dim) daily[d] += (it.kind==='in'?1:-1)*(+it.valor||0); });
    const pts = []; let acc = 0;
    for(let d=0; d<=Math.max(lastDay,0); d++){ acc += d?daily[d]:0; pts.push([d,acc]); }
    const vals = pts.map(p=>p[1]); const mx = Math.max(0,...vals), mn = Math.min(0,...vals); const span = (mx-mn)||1;
    const X = d => (d/dim)*300, Y = v => 76 - ((v-mn)/span)*68;
    let d = '';
    pts.forEach((p,i)=>{ d += (i?'L':'M')+X(p[0]).toFixed(2)+' '+Y(p[1]).toFixed(2); });
    if(pts.length<2) d = 'M0 '+Y(0)+'L0.01 '+Y(0);
    const end = pts[pts.length-1];
    $('nLine').setAttribute('d', d);
    $('nArea').setAttribute('d', d + 'L'+X(end[0]).toFixed(2)+' 80L0 80Z');
    const tip = $('nTip'); tip.style.left = (X(end[0])/300*100)+'%'; tip.style.top = (Y(end[1])/80*80)+'px'; tip.hidden = !lastDay;
    const key = mes+'|'+d;
    if(key!==lastNeedleKey){ lastNeedleKey = key; const n=$('needle'); n.classList.remove('draw'); void n.offsetWidth; n.classList.add('draw'); }
  }

  function renderHomeNext(){
    const t = today();
    const nx = data.agenda.filter(a=>!a.concluida && a.data>=t).sort((a,b)=>(a.data+(a.hora||'')).localeCompare(b.data+(b.hora||'')))[0];
    const pend = data.pend.filter(p=>!p.feito).length + autoPend().length;
    let h = '';
    if(nx){
      const dd = daysSince(nx.data)*-1;
      const quando = dd===0 ? 'Hoje' : dd===1 ? 'Amanhã' : new Date(nx.data+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long'});
      const [, mo, da] = nx.data.split('-');
      h += '<button class="nextcard" data-act="goTab" data-tab-go="agenda"><span class="when"><b class="num">'+esc(da)+'</b><small>'+esc(new Date(nx.data+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'}).replace('.',''))+'</small></span>'
        + '<span class="main"><div class="k">Próxima sessão</div><div class="t">'+esc(nx.cliente)+'</div><div class="s">'+esc(quando+(nx.hora?', '+nx.hora:'')+(nx.tattoo?' · '+nx.tattoo:''))+'</div></span></button>';
    }
    h = renderBrief() + h;
    $('homeNext').innerHTML = h;
  }
  function agendaCard(a, late){
    const rest = Math.max(0,(+a.valor||0)-(+a.sinal||0));
    const s = [a.tattoo, a.valor ? 'falta '+(masked?'R$ ••••':brl.format(rest)) : '', (+a.sinal>0)?'sinal pago':'sem sinal'].filter(Boolean).join(', ');
    return '<div class="card'+(late?' alert':'')+'"><button class="open" data-act="editAgenda" data-id="'+esc(a.id)+'"><span class="hour num">'+esc(a.hora||'--')+'</span><span class="main"><div class="t">'+esc(a.cliente)+'</div><div class="s">'+(a.estilo?'<span class="estilo-tag">'+esc(a.estilo)+'</span>':'<span class="estilo-tag miss">sem estilo</span>')+esc(s)+'</div></span></button>'
      + (a.data>today() ? '<button class="mini" data-act="msg" data-msg="lembrete" data-id="'+esc(a.id)+'">'+(a.lembrado?'Lembrado ✓':'Lembrar')+'</button>' : '<button class="mini solid" data-act="concluir" data-id="'+esc(a.id)+'">Concluir</button>')
      + '</div>';
  }
  function nextMsg(a){
    const d = daysSince(a.data);
    if(!a.msgCuidados && d<7) return ['cuidados','Cuidados'];
    if(!a.msg7 && d>=7 && d<40) return ['d7','7 dias'];
    if(!a.msg40 && d>=40) return ['d40','Avaliação'];
    return null;
  }
  function renderAgenda(){
    const t = today();
    const open = data.agenda.filter(a=>!a.concluida).sort((a,b)=>(a.data+(a.hora||'')).localeCompare(b.data+(b.hora||'')));
    const late = open.filter(a=>a.data<t), next = open.filter(a=>a.data>=t);
    const done = data.agenda.filter(a=>a.concluida).sort((a,b)=>b.data.localeCompare(a.data)).slice(0,8);
    $('agendaSub').textContent = next.length ? next.length+(next.length===1?' sessão marcada':' sessões marcadas') : 'Nenhuma sessão marcada pela frente.';
    let h='';
    if(late.length){ h+='<div class="sec">Já passaram, falta concluir</div>'; late.forEach(a=>{ h+='<div class="day">'+esc(dayLabel(a.data))+'</div>'+agendaCard(a,true); }); }
    if(next.length){ h+='<div class="sec">Próximas</div>'; let last=''; next.forEach(a=>{ if(a.data!==last){ last=a.data; h+='<div class="day">'+(a.data===t?'Hoje, ':'')+esc(dayLabel(a.data))+'</div>'; } h+=agendaCard(a,false); }); }
    if(!late.length && !next.length) h+='<div class="empty">Toque em <b>+ Marcar sessão</b> quando fechar um horário com um cliente.</div>';
    if(done.length){ h+='<div class="sec">Concluídas recentes</div>'; done.forEach(a=>{ h+='<div class="card done"><button class="open" data-act="editAgenda" data-id="'+esc(a.id)+'"><span class="hour num">'+esc(shortDate(a.data))+'</span><span class="main"><div class="t">'+esc(a.cliente)+'</div><div class="s">'+esc(a.tattoo||'')+'</div></span></button>'+(nextMsg(a)?'<button class="mini" data-act="msg" data-msg="'+nextMsg(a)[0]+'" data-id="'+esc(a.id)+'">'+nextMsg(a)[1]+'</button>':'')+'</div>'; }); }
    $('agendaList').innerHTML = h;
  }

  function renderPend(){
    const auto = autoPend();
    const open = data.pend.filter(p=>!p.feito).sort((a,b)=>(a.prazo||'9999').localeCompare(b.prazo||'9999'));
    const done = data.pend.filter(p=>p.feito).sort((a,b)=>(b.feitoEm||0)-(a.feitoEm||0)).slice(0,8);
    const total = auto.length + open.length;
    $('pendSub').textContent = total ? total+(total===1?' coisa para resolver':' coisas para resolver') : 'Tudo em dia.';
    const t = today(); let h='';
    if(auto.length){ h+='<div class="sec">O app avisou</div>'; auto.forEach(p=>{ h+='<div class="card alert"><button class="open" data-act="goAuto" data-kind="'+p.auto+'" data-msg="'+(p.kind||'')+'" data-id="'+esc(p.ref)+'"><span class="dot gold"></span><span class="main"><div class="t">'+esc(p.texto)+'</div><div class="s">'+esc(p.sub)+'</div></span></button></div>'; }); }
    h+='<div class="sec">Suas pendências</div>';
    if(!open.length) h+='<div class="empty">Nenhuma pendência sua aberta. Anote aqui desenhos, orçamentos e contas para não esquecer.</div>';
    open.forEach(p=>{
      const late = p.prazo && p.prazo < t;
      const s = p.prazo ? (late?'Atrasada, era ':'Até ')+shortDate(p.prazo) : 'Sem prazo';
      h+='<div class="card'+(late?' alert':'')+'"><button class="check" data-act="togglePend" data-id="'+esc(p.id)+'" aria-label="Marcar como feita"></button><button class="open" data-act="editPend" data-id="'+esc(p.id)+'"><span class="main"><div class="t">'+esc(p.texto)+'</div><div class="s">'+esc(s)+'</div></span></button></div>';
    });
    if(done.length){ h+='<div class="sec">Feitas</div>'; done.forEach(p=>{ h+='<div class="card done"><button class="check on" data-act="togglePend" data-id="'+esc(p.id)+'" aria-label="Reabrir">✓</button><button class="open" data-act="editPend" data-id="'+esc(p.id)+'"><span class="main"><div class="t">'+esc(p.texto)+'</div></span></button></div>'; }); }
    $('pendList').innerHTML = h;
  }

  function renderMat(){
    renderNeedles();
    const list = [...data.mat].filter(m=>!m.agulha).sort((a,b)=>{ const la=+a.qtd<+a.minimo, lb=+b.qtd<+b.minimo; return (lb-la) || String(a.nome).localeCompare(String(b.nome),'pt-BR'); });
    const low = data.mat.filter(m=>+m.qtd<+m.minimo).length;
    $('matSub').textContent = data.mat.length ? (low ? low+(low===1?' item abaixo do mínimo':' itens abaixo do mínimo') : 'Estoque em dia.') : '';
    if(!list.length){ $('matList').innerHTML = '<div class="empty">Cadastre os outros materiais do estúdio: cartuchos, tintas, luvas, filme, papel de decalque. Coloque a quantidade mínima para o app avisar quando precisar comprar.</div>'; return; }
    let h='';
    list.forEach(m=>{
      const isLow = +m.qtd<+m.minimo;
      h+='<div class="card'+(isLow?' alert':'')+'"><button class="open" data-act="editMat" data-id="'+esc(m.id)+'"><span class="main"><div class="t">'+esc(m.nome)+'</div><div class="s">'+(isLow?'Abaixo do mínimo ('+esc(fmtNum(+m.minimo))+')':'Mínimo '+esc(fmtNum(+m.minimo)))+(m.unidade?', '+esc(m.unidade):'')+'</div></span></button>'
       +'<div class="qty"><button data-act="qtyMinus" data-id="'+esc(m.id)+'" aria-label="Usei um">−</button><b class="num">'+esc(fmtNum(+m.qtd))+'</b><button data-act="qtyPlus" data-id="'+esc(m.id)+'" aria-label="Mais um">+</button></div>'
       +'<button class="mini" data-act="comprar" data-id="'+esc(m.id)+'">Comprei</button></div>';
    });
    $('matList').innerHTML = h;
  }

  // ---------- Formulário genérico ----------
  let form = null;
  function openForm(cfg){
    form = cfg;
    $('sheetTitle').textContent = cfg.title;
    let h='';
    cfg.fields.forEach(f=>{
      if(f.hint){ h+='<p class="hint">'+esc(f.hint)+'</p>'; return; }
      if(f.html){ h+=f.html; return; }
      if(f.type==='textarea'){ h+='<div class="field"><label for="f_'+f.k+'">'+esc(f.label)+'</label><textarea id="f_'+f.k+'">'+esc(cfg.values[f.k]||'')+'</textarea></div>'; return; }
      const v = cfg.values[f.k];
      h+='<div class="field" data-k="'+f.k+'">';
      h+= (f.type==='chips'||f.type==='multi') ? '<label>'+esc(f.label)+'</label>' : '<label for="f_'+f.k+'">'+esc(f.label)+'</label>';
      if(f.type==='chips'){
        h+='<div class="chips" data-k="'+f.k+'">'+f.options.map(o=>'<button type="button" class="chip" data-v="'+esc(o)+'" aria-pressed="'+(v===o)+'">'+esc(o)+'</button>').join('')+'</div>';
      } else if(f.type==='multi'){
        const arr = Array.isArray(v)?v:[];
        h+='<div class="chips multi" data-k="'+f.k+'">'+f.options.map(o=>'<button type="button" class="chip" data-v="'+esc(o)+'" aria-pressed="'+arr.includes(o)+'">'+esc(o)+'</button>').join('')+'</div>';
      } else {
        const type = f.type==='date'?'date':f.type==='time'?'time':'text';
        const im = (f.type==='money'||f.type==='number')?' inputmode="decimal"':'';
        const val = (f.type==='money'||f.type==='number') ? fmtNum(v) : (v==null?'':v);
        h+='<input id="f_'+f.k+'" type="'+type+'"'+im+' class="'+(f.type==='money'?'money num':'')+'" placeholder="'+esc(f.ph||'')+'" value="'+esc(val)+'" autocomplete="off">';
      }
      h+='</div>';
    });
    $('sheetFields').innerHTML = h;
    $('save').textContent = cfg.saveLabel || 'Salvar';
    $('save').hidden = !!cfg.noSave;
    $('del').hidden = !cfg.onDelete;
    $('err').textContent = '';
    $('sheetBg').classList.add('open'); $('sheet').classList.add('open');
    const first = cfg.fields.find(f=>!f.hint && !f.html && f.type!=='chips' && f.type!=='multi' && f.type!=='date' && f.type!=='time');
    if(first && !cfg.noFocus) setTimeout(()=>{ const i=$('f_'+first.k); if(i) i.focus(); }, 230);
  }
  function readForm(){
    const out = {};
    form.fields.forEach(f=>{
      if(f.hint || f.html) return;
      if(f.type==='textarea'){ out[f.k] = $('f_'+f.k).value; return; }
      if(f.type==='multi'){ out[f.k] = [...document.querySelectorAll('.chips[data-k="'+f.k+'"] .chip[aria-pressed="true"]')].map(c=>c.dataset.v); return; }
      if(f.type==='chips'){ const c=document.querySelector('.chips[data-k="'+f.k+'"] .chip[aria-pressed="true"]'); out[f.k] = c ? c.dataset.v : null; }
      else { const raw = $('f_'+f.k).value; out[f.k] = (f.type==='money'||f.type==='number') ? (raw.trim()===''?null:parseNum(raw)) : raw.trim(); }
    });
    return out;
  }
  function closeForm(){ $('sheetBg').classList.remove('open'); $('sheet').classList.remove('open'); form=null; }
  $('sheetFields').addEventListener('click', e=>{
    const c = e.target.closest('.chip'); if(!c) return;
    if(c.parentElement.classList.contains('multi')){ c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed')!=='true')); return; }
    c.parentElement.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed', String(x===c)));
  });
  $('save').onclick = async ()=>{
    if(!form) return;
    const v = readForm();
    const msg = form.validate ? form.validate(v) : '';
    if(msg){ $('err').textContent = msg; return; }
    $('save').disabled = true;
    try{ const ok = await form.onSave(v); closeForm(); if(ok) toast(ok); }
    catch(e){ $('err').textContent = e && e.code==='quota_exceeded' ? 'Espaço cheio. Apague itens antigos para salvar novos.' : 'Não foi possível salvar. Confira a internet e toque em Salvar de novo.'; }
    finally{ $('save').disabled = false; }
  };
  $('del').onclick = async ()=>{
    if(!form || !form.onDelete) return;
    if(!confirm('Apagar este item?')) return;
    try{ await form.onDelete(); closeForm(); toast('Apagado'); }
    catch(e){ $('err').textContent = 'Não foi possível apagar. Confira a internet e tente de novo.'; }
  };
  $('cancel').onclick = closeForm;
  $('sheetBg').onclick = closeForm;
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeForm(); });

  // ---------- Formulários de cada aba ----------
  const find = (n,id) => data[n].find(x=>x.id===id);
  const defaultDate = () => mes===today().slice(0,7) ? today() : mes+'-01';
  function afterCaixaSave(it){ caixaCacheAt = 0; if(it.mes!==mes){ mes=it.mes; subscribeCaixa(); } }

  function formEntrada(it){
    openForm({
      title: it?'Editar entrada':'Nova entrada',
      values: it ? it : {tipo:'Sessão', pagamento:'Pix', data:defaultDate()},
      fields:[
        {k:'valor',label:'Valor',type:'money',ph:'R$ 0,00'},
        {k:'cliente',label:'Cliente',ph:'Nome do cliente'},
        {k:'descricao',label:'Tattoo',ph:'Ex.: rosa fineline no antebraço'},
        {k:'tipo',label:'Tipo',type:'chips',options:['Sessão','Sinal']},
        {k:'pagamento',label:'Pagamento',type:'chips',options:['Pix','Cartão','Dinheiro']},
        {k:'data',label:'Data',type:'date'}
      ],
      validate:v=> !(v.valor>0)?'Digite um valor maior que zero.': !v.cliente?'Digite o nome do cliente.': !v.data?'Escolha a data.':'',
      onSave: async v=>{
        const rec = Object.assign({}, it||{}, v, {id: it?it.id:newId('l'), kind:'in', mes:v.data.slice(0,7), criado: it?(it.criado||Date.now()):Date.now()});
        await stores.caixa.save(rec); afterCaixaSave(rec); return it?'Entrada salva':'Entrada salva';
      },
      onDelete: it ? ()=>stores.caixa.remove(it.id) : null
    });
  }
  function formSaida(it, preset){
    openForm({
      title: it?'Editar saída':'Nova saída',
      values: it ? it : Object.assign({categoria:'Material', data:defaultDate()}, preset||{}),
      fields:[
        {k:'valor',label:'Valor',type:'money',ph:'R$ 0,00'},
        {k:'descricao',label:'Descrição',ph:'Ex.: cartuchos e tinta'},
        {k:'categoria',label:'Categoria',type:'chips',options:['Material','Aluguel','Divulgação','Outros']},
        {k:'data',label:'Data',type:'date'}
      ],
      validate:v=> !(v.valor>0)?'Digite um valor maior que zero.': !v.data?'Escolha a data.':'',
      onSave: async v=>{
        const rec = Object.assign({}, it||{}, v, {id: it?it.id:newId('l'), kind:'out', mes:v.data.slice(0,7), criado: it?(it.criado||Date.now()):Date.now()});
        await stores.caixa.save(rec); afterCaixaSave(rec); return 'Saída salva';
      },
      onDelete: it ? ()=>stores.caixa.remove(it.id) : null
    });
  }
  function renderNeedles(){
    const fc = needleForecast();
    let h = '<div class="ndl-grid">';
    NEEDLES.forEach(c=>{
      const it = needleItem(c);
      const q = it ? (+it.qtd||0) : 0, need = fc.precisa[c];
      const short = it && need > q, low = it && q < (+it.minimo||0);
      const pct = Math.max(4, Math.min(100, need ? (q/Math.max(need,1))*100 : (q>0?100:4)));
      h += '<button class="ndl'+(short?' short':low?' low':'')+'" data-act="'+(it?'editMat':'addNeedle')+'" data-id="'+(it?esc(it.id):c)+'">'
        + '<div class="code">'+NEEDLE_NAME[c]+'</div><div class="q num">'+(it?fmtNum(q):'–')+'</div><div class="u">'+(it?'em estoque':'não cadastrada')+'</div>'
        + '<div class="bar"><i style="width:'+pct+'%"></i></div>'
        + '<div class="need">'+(need ? (short ? ((need-q)===1?'Falta 1':'Faltam '+(need-q))+' para a agenda' : 'Agenda usa '+need) : 'Sem uso na agenda')+'</div></button>';
    });
    h += '</div>';
    const msgs = [];
    if(fc.sessoes) msgs.push('<b>'+fc.sessoes+'</b> '+(fc.sessoes===1?'sessão marcada':'sessões marcadas')+' daqui pra frente.');
    if(fc.semEstilo) msgs.push('<span class="warn">'+fc.semEstilo+(fc.semEstilo===1?' sessão está':' sessões estão')+' sem estilo</span>, então contei só 1 agulha 5RL para '+(fc.semEstilo===1?'ela':'elas')+'. Defina o estilo na Agenda para a previsão ficar certa.');
    if(msgs.length) h += '<div class="forecast">'+msgs.join(' ')+(fc.semEstilo?'<br><button class="mini" data-act="goTab" data-tab-go="agenda">Ir para a Agenda</button>':'')+'</div>';
    // histórico de uso
    const hist = data.agenda.filter(a=>a.concluida && a.agulhasUsadas && Object.keys(a.agulhasUsadas).length).sort((a,b)=>b.data.localeCompare(a.data)).slice(0,6);
    if(hist.length){
      h += '<div class="sec">Últimas baixas de agulha</div><div class="hist">';
      hist.forEach(a=>{ const u = NEEDLES.filter(c=>a.agulhasUsadas[c]).map(c=>a.agulhasUsadas[c]+'× '+NEEDLE_NAME[c]).join(', ');
        h += '<div class="card"><button class="open" data-act="editAgenda" data-id="'+esc(a.id)+'"><span class="hour num">'+esc(shortDate(a.data))+'</span><span class="main"><div class="t">'+esc(a.cliente)+'</div><div class="s">'+esc((a.estilo?a.estilo+': ':'')+u)+'</div></span></button></div>'; });
      h += '</div>';
    }
    h += '<div class="sec">Outros materiais</div>';
    $('needleBox').innerHTML = h;
  }

  function formAgenda(a, preset){
    const canG = !!mcp && !a;
    openForm({
      title: a?'Editar sessão':'Marcar sessão',
      values: a ? a : Object.assign({data:today(), google: canG?'Sim':null}, preset||{}),
      fields:[
        {k:'cliente',label:'Cliente',ph:'Nome do cliente'},
        {k:'tattoo',label:'Tattoo',ph:'Ex.: leão realismo na panturrilha'},
        {k:'estilo',label:'Estilo (define as agulhas da sessão)',type:'chips',options:ESTILOS},
        {k:'data',label:'Data',type:'date'},
        {k:'hora',label:'Horário',type:'time'},
        {k:'valor',label:'Valor combinado',type:'money',ph:'R$ 0,00'},
        {k:'sinal',label:'Sinal já pago',type:'money',ph:'Deixe vazio se ainda não pagou'},
        {k:'telefone',label:'WhatsApp do cliente (opcional)',ph:'(11) 90000-0000'},
        {k:'notas',label:'Observações (opcional)',ph:'Anotações sobre o projeto'},
        {hint:'Sinal: R$ 100 até R$ 1.000 de valor, 20% acima. Serve para calcular quanto falta receber. Lance o sinal também no Caixa, como entrada do tipo Sinal, no dia em que receber.'}
      ].concat(canG?[{k:'google',label:'Criar também no Google Agenda',type:'chips',options:['Sim','Não']}]:[]).concat(a && a.googleId?[{hint:'Se mudar a data ou o horário aqui, remarque também no Google Agenda. O app passa a manter a data que você definiu.'}]:[]),
      validate:v=> !v.cliente?'Digite o nome do cliente.': !v.data?'Escolha a data.':'',
      onSave: async v=>{
        const g = v.google; delete v.google;
        const rec = Object.assign({}, a||{}, v, {id: a?a.id:newId('a'), valor:v.valor||0, sinal:v.sinal||0, concluida: a?!!a.concluida:false});
        if(a && a.googleId && (a.data!==rec.data || a.hora!==rec.hora)) rec.remarcadoApp = true;
        await stores.agenda.save(rec);
        if(g==='Sim'){
          if(!rec.hora) return 'Sessão marcada. Sem horário, não criei no Google';
          try{ const r = await googleCreate(rec); if(r){ await stores.agenda.save(Object.assign({}, rec, {googleId:r.id, fim:r.fim})); return 'Sessão marcada no app e no Google'; } }catch(e){ return 'Sessão marcada no app. Não consegui criar no Google'; }
        }
        return a?'Sessão salva':'Sessão marcada';
      },
      onDelete: a ? ()=> a.googleId ? stores.agenda.save(Object.assign({}, a, {ignorado:true})) : stores.agenda.remove(a.id) : null
    });
  }
  function formConcluir(a){
    const rest = Math.max(0,(+a.valor||0)-(+a.sinal||0));
    let kit = Object.assign({}, kitFor(a.estilo));
    setTimeout(()=>{
      const box = $('kitBox'); if(!box) return;
      const draw = () => {
        box.innerHTML = NEEDLES.map(c=>{ const it=needleItem(c); const tem = it?(+it.qtd||0):null;
          return '<div class="kit-row"><span class="c">'+NEEDLE_NAME[c]+'<small>'+(it?'Em estoque: '+fmtNum(tem):'Não cadastrada no estoque')+'</small></span><span class="qty"><button type="button" data-k="'+c+'" data-d="-1" aria-label="Menos">−</button><b class="num">'+(kit[c]||0)+'</b><button type="button" data-k="'+c+'" data-d="1" aria-label="Mais">+</button></span></div>'; }).join('');
      };
      draw();
      box.onclick = e => { const b=e.target.closest('button[data-k]'); if(!b) return; kit[b.dataset.k]=Math.max(0,(kit[b.dataset.k]||0)+(+b.dataset.d)); draw(); };
      const chips = document.querySelector('.chips[data-k="estilo"]');
      if(chips) chips.addEventListener('click', e=>{ const c=e.target.closest('.chip'); if(!c) return; kit = Object.assign({}, kitFor(c.dataset.v)); draw(); });
    }, 0);
    openForm({
      title:'Concluir sessão',
      saveLabel:'Concluir e lançar no caixa',
      noFocus:true,
      values:{valor:rest||null, pagamento:'Pix', data:a.data<=today()?a.data:today(), estilo:a.estilo||null},
      fields:[
        {hint: a.cliente+(a.tattoo?', '+a.tattoo:'')+'. Combinado '+brl.format(+a.valor||0)+', sinal '+brl.format(+a.sinal||0)+'.'},
        {k:'estilo',label:'Estilo',type:'chips',options:ESTILOS},
        {html:'<div class="field"><label>Agulhas usadas (saem do estoque)</label><div class="kit" id="kitBox"></div></div>'},
        {k:'valor',label:'Valor recebido hoje (restante)',type:'money',ph:'R$ 0,00'},
        {k:'pagamento',label:'Pagamento',type:'chips',options:['Pix','Cartão','Dinheiro']},
        {k:'data',label:'Data',type:'date'},
        {hint:'Se o cliente já pagou tudo antes, deixe o valor vazio. A sessão é concluída sem novo lançamento.'}
      ],
      validate:v=> !v.data?'Escolha a data.': (v.valor!=null && !(v.valor>=0))?'Valor inválido.':'',
      onSave: async v=>{
        // baixa das agulhas
        const usadas = {};
        for(const c of NEEDLES){
          const n = kit[c]||0; if(!n) continue;
          usadas[c] = n;
          const it = needleItem(c);
          if(it) await stores.mat.save(Object.assign({}, it, {qtd: Math.max(0,(+it.qtd||0)-n)}));
        }
        let entradaId = null;
        if(v.valor>0){
          entradaId = newId('l');
          const rec = {id:entradaId, kind:'in', valor:v.valor, cliente:a.cliente, descricao:a.tattoo||'', tipo:'Sessão', pagamento:v.pagamento||'Pix', data:v.data, mes:v.data.slice(0,7), criado:Date.now(), agendaId:a.id};
          await stores.caixa.save(rec);
        }
        await stores.agenda.save(Object.assign({}, a, {concluida:true, concluidaEm:Date.now(), entradaId, estilo:v.estilo||a.estilo||null, agulhasUsadas:usadas}));
        setTimeout(()=>openMsg(Object.assign({}, a, {concluida:true}), 'cuidados'), 350);
        return entradaId ? 'Sessão concluída e lançada no caixa' : 'Sessão concluída';
      }
    });
  }
  async function concluirSessao(a, valor, pagamento, dataStr, estilo, kit){
    const usadas = {};
    for(const c of NEEDLES){
      const n = kit[c]||0; if(!n) continue; usadas[c] = n;
      const it = needleItem(c);
      if(it) await stores.mat.save(Object.assign({}, it, {qtd: Math.max(0,(+it.qtd||0)-n)}));
    }
    let entradaId = null;
    if(valor>0){
      entradaId = newId('l');
      await stores.caixa.save({id:entradaId, kind:'in', valor, cliente:a.cliente, descricao:a.tattoo||'', tipo:'Sessão', pagamento:pagamento||'Pix', data:dataStr, mes:dataStr.slice(0,7), criado:Date.now(), agendaId:a.id});
    }
    await stores.agenda.save(Object.assign({}, a, {concluida:true, concluidaEm:Date.now(), entradaId, estilo:estilo||a.estilo||null, agulhasUsadas:usadas}));
    return entradaId;
  }
  function formPend(p){
    openForm({
      title: p?'Editar pendência':'Nova pendência',
      values: p ? p : {},
      fields:[
        {k:'texto',label:'O que precisa fazer',ph:'Ex.: desenho do braço da Carla'},
        {k:'prazo',label:'Prazo (opcional)',type:'date'}
      ],
      validate:v=> !v.texto?'Escreva a pendência.':'',
      onSave: async v=>{ await stores.pend.save(Object.assign({}, p||{}, v, {id:p?p.id:newId('p'), feito:p?!!p.feito:false, criado:p?(p.criado||Date.now()):Date.now()})); return 'Pendência salva'; },
      onDelete: p ? ()=>stores.pend.remove(p.id) : null
    });
  }
  function formMat(m, code){
    openForm({
      title: m?'Editar material':'Novo material',
      values: m ? Object.assign({}, m, {agulha:m.agulha||'Não'}) : (code ? {nome:'Agulha '+NEEDLE_NAME[code], unidade:'unidades', agulha:code} : {agulha:'Não'}),
      fields:[
        {k:'nome',label:'Material',ph:'Ex.: cartucho 3RL'},
        {k:'unidade',label:'Unidade (opcional)',ph:'Ex.: caixas, frascos, pacotes'},
        {k:'qtd',label:'Quantidade atual',type:'number',ph:'0'},
        {k:'minimo',label:'Avisar quando ficar abaixo de',type:'number',ph:'0'},
        {k:'agulha',label:'É uma das agulhas da regra de sessão?',type:'chips',options:['Não','5RL','15MG','25MG']}
      ],
      validate:v=> !v.nome?'Digite o nome do material.': (v.qtd!=null && !(v.qtd>=0))?'Quantidade inválida.':'',
      onSave: async v=>{ const ag = (v.agulha && v.agulha!=='Não') ? v.agulha : null; await stores.mat.save(Object.assign({}, m||{}, v, {id:m?m.id:newId('m'), qtd:v.qtd||0, minimo:v.minimo||0, agulha:ag})); return 'Material salvo'; },
      onDelete: m ? ()=>stores.mat.remove(m.id) : null
    });
  }
  function formCompra(m){
    openForm({
      title:'Comprei '+m.nome,
      saveLabel:'Salvar compra',
      values:{data:today()},
      fields:[
        {k:'qtd',label:'Quantidade comprada'+(m.unidade?' ('+m.unidade+')':''),type:'number',ph:'0'},
        {k:'valor',label:'Valor pago',type:'money',ph:'R$ 0,00'},
        {k:'data',label:'Data',type:'date'},
        {hint:'O valor entra no Caixa como saída, na categoria Material.'}
      ],
      validate:v=> !(v.qtd>0)?'Digite quanto você comprou.': !v.data?'Escolha a data.':'',
      onSave: async v=>{
        await stores.mat.save(Object.assign({}, m, {qtd: Math.round(((+m.qtd||0)+v.qtd)*100)/100}));
        if(v.valor>0){
          const rec = {id:newId('l'), kind:'out', valor:v.valor, descricao:'Compra: '+m.nome, categoria:'Material', data:v.data, mes:v.data.slice(0,7), criado:Date.now(), materialId:m.id};
          await stores.caixa.save(rec);
          return 'Compra salva e lançada no caixa';
        }
        return 'Estoque atualizado';
      }
    });
  }

  // ---------- Mensagens de WhatsApp ----------
  const ENDERECO = 'Avenida Melchert, 606, Vila Matilde';
  const REVIEW = 'https://g.page/r/CTD5YzNLVqHDEAE/review';
  const CUIDADOS = 'CUIDADOS PÓS-TATUAGEM\n• Lave a tatuagem delicadamente com água e sabonete neutro, sem esfregar.\n• Seque com papel-toalha, dando leves batidinhas.\n• Aplique uma camada fina de Cicaplast 2 a 3 vezes ao dia, ou conforme orientação.\n• Não coce, não arranque casquinhas e evite ficar tocando na tatuagem.\n• Evite sol, piscina, mar, sauna e atividades que causem muito atrito ou suor excessivo durante a cicatrização.\n• Use roupas limpas e folgadas sobre a região, evitando atrito.\n• Não abafe a tatuagem e não aplique produtos diferentes dos recomendados.\n• É normal haver vermelhidão leve, sensibilidade e descamação nos primeiros dias.\nImportante: cada tatuagem pode ter uma cicatrização diferente. Se notar sinais intensos ou piorando, como dor forte, calor excessivo, inchaço importante ou secreção, procure orientação médica.\nCuide bem da sua tattoo durante a cicatrização para preservar o resultado.';
  const MSG = {
    lembrete:{titulo:'Lembrete da sessão', flag:'lembrado'},
    cuidados:{titulo:'Cuidados pós-tattoo', flag:'msgCuidados'},
    d7:{titulo:'Acompanhamento de 7 dias', flag:'msg7'},
    d40:{titulo:'Foto e avaliação', flag:'msg40'}
  };
  function textoMsg(a, kind){
    const nome = firstName(a.cliente);
    const proj = a.tattoo ? ' ('+a.tattoo+')' : '';
    if(kind==='lembrete'){
      const t = today();
      const wd = new Date(a.data+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long'});
      const quando = a.data===t ? 'hoje' : a.data===addDays(t,1) ? 'amanhã, '+wd+',' : wd+', '+shortDate(a.data)+',';
      return 'Olá, '+nome+'! Passando para confirmar sua sessão '+quando+(a.hora?' às '+a.hora.replace(':00','h').replace(':','h'):'')+(a.tattoo?', para '+a.tattoo:'')+'.\nEndereço: '+ENDERECO+'.\nMe confirma por aqui, por favor? Se precisar remarcar, lembrando que a remarcação perde o sinal para reserva do horário.\n'+(a.data===t?'Até daqui a pouco.':'Até lá.');
    }
    if(kind==='cuidados') return 'Olá, '+nome+'! Obrigado pela confiança no seu projeto'+proj+', foi um prazer fazer essa tattoo.\nSeguem os cuidados para a cicatrização:\n\n'+CUIDADOS+'\n\nQualquer dúvida durante a cicatrização, me manda por aqui com uma foto.';
    if(kind==='d7') return 'Olá, '+nome+'! Tudo bem? Como está a cicatrização da sua tattoo'+proj+'?\nSe puder, me manda uma foto de como ela está para eu acompanhar.';
    return 'Olá, '+nome+'! Sua tattoo'+proj+' já deve estar cicatrizada. Pode me mandar uma foto de como ela ficou? Se eu puder postar no Instagram, me avisa também.\nSe puder deixar sua opinião no Google, ajuda muito o estúdio: '+REVIEW;
  }
  function waLink(a, text){
    let ph = String(a.telefone||'').replace(/\D/g,'');
    if(ph.length===10 || ph.length===11) ph = '55'+ph;
    return 'https://wa.me/'+(ph||'')+'?text='+encodeURIComponent(text);
  }
  function openMsg(a, kind){
    const m = MSG[kind]; if(!m) return;
    openForm({
      title: m.titulo,
      noSave:true, noFocus:true,
      values:{texto:textoMsg(a, kind)},
      fields:[
        {hint: a.cliente+(a.telefone?'':'. Sem WhatsApp cadastrado: o WhatsApp vai pedir para você escolher o contato.')},
        {k:'texto', label:'Mensagem (pode editar antes de enviar)', type:'textarea'},
        {html:'<a class="wa" id="waGo" href="#" target="_blank" rel="noopener">Abrir no WhatsApp</a><button type="button" class="btn ghost" id="waCopy" style="width:100%;margin-bottom:10px">Copiar mensagem</button>'}
      ]
    });
    const mark = () => { const cur = find('agenda', a.id) || a; const upd = Object.assign({}, cur); upd[m.flag] = Date.now(); stores.agenda.save(upd).catch(()=>{}); };
    $('waGo').onclick = () => { $('waGo').href = waLink(a, $('f_texto').value); mark(); setTimeout(closeForm, 300); };
    $('waCopy').onclick = async () => {
      const ta = $('f_texto');
      try{ await navigator.clipboard.writeText(ta.value); }catch(e){ ta.focus(); ta.select(); try{ document.execCommand('copy'); }catch(_){} }
      mark(); toast('Mensagem copiada');
    };
  }

  // ---------- Assistente do estúdio ----------
  let sampler = null, chatTurns = [], chatBusy = false, chatCtl = null;
  async function setupAssistant(){
    try{ sampler = await window.claude.use('sample'); }catch(e){ sampler = null; }
    $('askBar').hidden = !sampler;
  }
  function brlPlain(v){ return brl.format(+v||0); }
  async function snapshotData(){
    let caixaAll = [];
    try{ caixaAll = await stores.caixa.all(); }catch(e){ caixaAll = data.caixa; }
    const t = today(); const lim = addDays(t,-190).slice(0,7);
    caixaAll = caixaAll.filter(x=>(x.mes||'')>=lim).map(x=>({id:x.id, tipo:x.kind==='in'?'entrada':'saida', valor:+x.valor||0, data:x.data, cliente:x.cliente||undefined, descricao:x.descricao||undefined, categoria:x.categoria||undefined, tipoEntrada:x.tipo||undefined, pagamento:x.pagamento||undefined}));
    const agenda = data.agenda.filter(a=>a.data>=addDays(t,-60)).map(a=>({id:a.id, cliente:a.cliente, tattoo:a.tattoo||undefined, estilo:a.estilo||undefined, data:a.data, hora:a.hora||undefined, fim:a.fim||undefined, telefone:a.telefone?'sim':undefined, valorCombinado:+a.valor||0, sinalPago:+a.sinal||0, concluida:!!a.concluida, agulhasUsadas:a.agulhasUsadas||undefined}));
    const materiais = data.mat.map(m=>({id:m.id, nome:m.nome, agulha:m.agulha||undefined, quantidade:+m.qtd||0, minimo:+m.minimo||0, unidade:m.unidade||undefined}));
    const pendencias = data.pend.filter(p=>!p.feito).map(p=>({texto:p.texto, prazo:p.prazo||undefined}));
    const avisos = autoPend().map(p=>p.texto+' ('+p.sub+')');
    const full = await loadCaixaAll(true);
    const m0 = t.slice(0,7), m1 = prevMonth(m0);
    const fc = fechamento(full, m0);
    const clientes = buildClients(full).map(c=>({nome:c.nome, totalGasto:c.total, sessoes:c.sessoes, ultima:c.ultima||undefined, proxima:c.proxima||undefined, tattoos:c.tattoos.slice(0,3)}));
    return {hoje:t, diaDaSemana:new Date().toLocaleDateString('pt-BR',{weekday:'long'}),
      ajustes:{metaMensal:+data.cfg.meta||0, diasAtendimento:data.cfg.dias, inicio:data.cfg.inicio, fim:data.cfg.fim, duracaoPadraoHoras:+data.cfg.duracao||3},
      fechamentoMesAtual:Object.assign(fc,{meta:+data.cfg.meta||0, faltaParaMeta: data.cfg.meta? Math.max(0, Math.round((data.cfg.meta-fc.entradas)*100)/100) : null}),
      fechamentoMesPassado:fechamento(full, m1),
      lancamentosCaixa:caixaAll, agenda, materiais, pendenciasAbertas:pendencias, avisosAutomaticos:avisos, previsaoAgulhas:needleForecast(),
      horariosLivres7dias:freeSlots(7), clientes, estilosValidos:ESTILOS, orcamentos:orcSnapshot(), politica:POLITICA};
  }
  const RULES = `Você é o Assistente do Estúdio Andre Tattoo, dentro do app de gestão do tatuador Andre (São Paulo). Fale em português do Brasil, direto, curto e humano, como um gerente de confiança. Sem markdown (nada de asteriscos ou #), sem travessões no meio das frases; use quebras de linha e, se precisar de lista, linhas começando com "• ".

REGRAS
1. Use SOMENTE os dados em DADOS DO APP. Nunca invente valores, clientes ou datas. Se a informação não estiver nos dados, diga que não tem essa informação no app.
2. Separe fato de estimativa: o que está lançado é fato; previsões (ex.: quanto vai fechar o mês) diga que é estimativa e em que se baseia.
3. Valores em reais no formato R$ 1.234,56.
4. Lucro = entradas menos saídas. "Falta receber" de uma sessão = valorCombinado menos sinalPago, só quando valorCombinado > 0; se for 0, diga que o valor não foi cadastrado.
5. Agulhas: toda sessão usa 1 agulha 5RL; Realismo P&C, Fechamento, Blackwork e Aquarela usam também 1 de 15 Magnum (15MG) e 1 de 25 Magnum (25MG). Use previsaoAgulhas.
6. Você NÃO salva nada. Quando o Andre pedir para registrar algo, proponha ações em "acoes"; ele confirma no app.
   • Pagamento de cliente que tem sessão na agenda NÃO concluída (mesmo nome ou nome parecido, data próxima): use tipo "concluir" com o agendaId, para não duplicar no caixa.
   • Outros recebimentos: tipo "entrada". Gastos: tipo "saida". Compra de material cadastrado: tipo "compra" com o materialId (soma no estoque e lança a saída).
   • Se faltar o valor ou algo essencial, pergunte no texto e não proponha a ação. Data padrão: hoje. Pagamento padrão quando não dito: pergunte só se for importante, senão use "Pix".
7. Para "resumo do dia": sessões de hoje e amanhã, pendências e avisos urgentes, como está o lucro do mês até agora e a meta, se houver. Máximo 8 linhas.
8. Fechamento do mês: use fechamentoMesAtual e fechamentoMesPassado (já calculados, não recalcule). Mostre entradas, saídas, lucro, sinais, sessões, ticket médio, maiores gastos e a meta. Compare com o mês passado em porcentagem.
9. Agendar: "agendar" cria sessão (cliente, data, hora, estilo, tattoo, valor, sinal). Confira horariosLivres7dias e a agenda; se o horário bater com outra sessão, avise no texto. Estilo só pode ser um de estilosValidos; se não souber, deixe vazio.
10. Remarcar: "remarcar" com agendaId e nova data/hora.
11. Estilos: quando ele disser o estilo de várias sessões, use UMA ação "estilos" com a lista. Para listar as sem estilo, use a agenda (sessões futuras sem estilo).
12. Pendências: "me lembra de…", "anota…" vira ação "pendencia" com texto e prazo opcional (AAAA-MM-DD).
13. Mensagens de WhatsApp para clientes da agenda: ação "mensagens" com o tipo (lembrete, cuidados, d7, d40) e os agendaIds. Os textos são montados pelo app.
14. Meta e horário: "minha meta é 15 mil" vira ação "meta". Mudança de dias/horário de atendimento vira ação "horario".
15. Orçamento: quando ele colar a mensagem de um cliente pedindo orçamento, siga o padrão do Andre: cumprimente pelo nome (se não souber o nome, só "Olá!"); peça SÓ o que faltar entre tamanho aproximado (cm), local do corpo, referência e foto da área, sem pedir de novo o que o cliente já mandou; se tiver tudo, traga [VALOR] para ele preencher (nunca escreva o valor final: só o Andre passa o preço). Quando o Andre já informar o valor, monte a mensagem com ele e explique o sinal para reserva do horário, abatido do valor final: R$ 100 em trabalhos até R$ 1.000 e 20% do valor em trabalhos acima de R$ 1.000. O sinal não é reembolsado em caso de cancelamento ou reagendamento; avise isso com clareza e sem dureza, antes da cobrança, e nunca ofereça exceção. Indicação: agradeça e pergunte quem indicou. Menor de idade: idade mínima 18 anos. Maori: o Andre não faz esse estilo; não prometa nada e diga que ele deve responder pessoalmente. Nunca prometa número de sessões, data, desconto ou que não dói. Saúde ou reclamação séria: não responda, diga que ele deve responder pessoalmente. Tom formal no primeiro contato, sem gíria, quase nenhum emoji (de preferência nenhum), até 6 linhas. No "texto" coloque só a nota interna curta (categoria, o que falta, se o realismo veio sem dizer se é preto e cinza ou colorido, e a referência de valor só para o Andre: mínimo R$ 250, realismo em média R$ 1.200, grande sob consulta) e coloque a mensagem para o cliente em uma ação "mensagem_livre".
16. Horários livres: use horariosLivres7dias. Se pedir para mandar a um cliente, use "mensagem_livre". Nunca invente horário fora da lista.
17. Clientes: use "clientes" para histórico, quem mais gastou, quem está sumido.
18. Orçamentos em andamento: use "orcamentos" (etapa, ultimoContato, followups). Parado = etapa orcamento ou decisao sem contato há 3 dias ou mais (1º follow-up) ou 7 dias ou mais (2º). No máximo 2 follow-ups por orçamento; depois, só um encerramento gentil, sem desconto e sem urgência falsa. Para registrar um novo pedido de orçamento, proponha a ação "orcamento". "politica" traz as regras de sinal e retoque do Andre. Nunca informe preço final ao cliente.

RESPONDA SOMENTE com um JSON neste formato:
{"texto":"sua resposta","acoes":[]}
Formatos de ação possíveis:
{"tipo":"entrada","cliente":"Nome","valor":450,"pagamento":"Pix|Cartão|Dinheiro","tipoEntrada":"Sessão|Sinal","data":"AAAA-MM-DD","descricao":"opcional"}
{"tipo":"saida","descricao":"o que foi","valor":80,"categoria":"Material|Aluguel|Divulgação|Outros","data":"AAAA-MM-DD"}
{"tipo":"compra","materialId":"id do material","qtd":5,"valor":60,"data":"AAAA-MM-DD"}
{"tipo":"concluir","agendaId":"id da sessão","valor":450,"pagamento":"Pix|Cartão|Dinheiro","data":"AAAA-MM-DD"}
{"tipo":"agendar","cliente":"Nome","data":"AAAA-MM-DD","hora":"HH:MM","estilo":"um de estilosValidos ou vazio","tattoo":"opcional","valor":0,"sinal":0,"telefone":"opcional"}
{"tipo":"remarcar","agendaId":"id","data":"AAAA-MM-DD","hora":"HH:MM"}
{"tipo":"estilos","itens":[{"agendaId":"id","estilo":"Realismo P&C"}]}
{"tipo":"pendencia","texto":"o que fazer","prazo":"AAAA-MM-DD ou vazio"}
{"tipo":"mensagens","modelo":"lembrete|cuidados|d7|d40","agendaIds":["id"]}
{"tipo":"meta","valor":15000}
{"tipo":"horario","dias":["seg","ter"],"inicio":"09:00","fim":"18:00","duracao":3}
{"tipo":"orcamento","cliente":"Nome","ideia":"o que quer","estilo":"um de estilosValidos ou vazio","tamanho":"cm","local":"parte do corpo","valor":0,"etapa":"novo|qualificado|orcamento|decisao"}
{"tipo":"mensagem_livre","titulo":"Resposta de orçamento","texto":"mensagem pronta para o cliente"}`;

  function addMsg(cls, html){
    const d = document.createElement('div'); d.className = 'msg '+cls; d.innerHTML = html;
    $('chatBody').appendChild(d); $('chatBody').scrollTop = $('chatBody').scrollHeight; return d;
  }
  function openChat(){
    $('chat').classList.add('open');
    let first = false; try{ first = localStorage.getItem('andre-resumo')!==today(); }catch(e){}
    if(!$('chatBody').children.length){
      addMsg('ai', esc('Oi, Andre. Posso responder sobre caixa, agenda, agulhas e pendências, ou lançar algo pra você confirmar. Ex.: "recebi 450 do Carlos no Pix".'));
      if(first){ try{ localStorage.setItem('andre-resumo', today()); }catch(e){} ask('Me dá o resumo do dia.'); }
    }
    setTimeout(()=>$('chatIn').focus(), 320);
  }
  function closeChat(){ $('chat').classList.remove('open'); $('chatIn').blur(); }
  function setBusy(b){
    chatBusy = b; const sb = $('chatSend');
    sb.classList.toggle('stop', b); sb.textContent = b ? '■' : '↑'; sb.setAttribute('aria-label', b?'Parar':'Enviar');
  }
  const ERR = {
    not_granted:'Você não autorizou o assistente nesta abertura do app. Feche e abra o app de novo para autorizar.',
    rate_limited:'Muitas perguntas seguidas. Espere um pouco e tente de novo.',
    session_expired:'Sua sessão do Claude expirou. Abra o app de novo pelo link.',
    sampling_disabled:'O assistente está desativado na sua conta do Claude.',
    capability_disabled:'O assistente está desativado no momento.',
    prompt_too_large:'Tem dados demais para eu ler de uma vez. Tente uma pergunta mais específica.',
    refused:'Não consegui responder isso. Tente perguntar de outro jeito.',
    invalid_json:'A resposta veio num formato que não consegui ler. Tente de novo.'
  };
  async function ask(q){
    if(!sampler || chatBusy || !q.trim()) return;
    addMsg('me', esc(q));
    const typing = addMsg('ai', '<span class="dots"><i></i><i></i><i></i></span>');
    setBusy(true); chatCtl = new AbortController();
    try{
      const snap = await snapshotData();
      const input = chatTurns.slice(-8).concat([{role:'user', content: RULES+regrasExtra()+'\n\nDADOS DO APP (JSON):\n'+JSON.stringify(snap)+'\n\nMENSAGEM DO ANDRE:\n'+q}]);
      const res = await sampler.json(input, {signal:chatCtl.signal, cache:false});
      const texto = (res && typeof res.texto==='string') ? res.texto : 'Não consegui montar a resposta.';
      typing.innerHTML = esc(texto); addFeedback(typing, q, texto, res);
      chatTurns.push({role:'user', content:q}, {role:'assistant', content:texto});
      (Array.isArray(res && res.acoes) ? res.acoes : []).slice(0,5).forEach(renderAction);
    }catch(e){
      if(e && e.code==='cancelled'){ typing.innerHTML = esc('Parei.'); }
      else { typing.classList.add('err'); typing.innerHTML = esc(ERR[e && e.code] || 'Não consegui responder agora. Confira a internet e tente de novo.'); }
    }finally{ setBusy(false); $('chatBody').scrollTop = $('chatBody').scrollHeight; }
  }
  function validDate(d){ return /^\d{4}-\d{2}-\d{2}$/.test(String(d||'')) ? d : today(); }
  function renderAction(a){
    if(!a || !a.tipo) return;
    const valor = Math.round((+a.valor||0)*100)/100;
    const dt = validDate(a.data);
    let k='', line='', run=null;
    if(a.tipo==='entrada'){
      if(!(valor>0)) return;
      k='Lançar entrada'; line = (a.cliente||'Cliente')+', '+(a.tipoEntrada==='Sinal'?'Sinal':'Sessão')+', '+(a.pagamento||'Pix')+', '+shortDate(dt)+(a.descricao?'\n'+a.descricao:'');
      run = async()=>{ const rec={id:newId('l'), kind:'in', valor, cliente:a.cliente||'', descricao:a.descricao||'', tipo:a.tipoEntrada==='Sinal'?'Sinal':'Sessão', pagamento:['Pix','Cartão','Dinheiro'].includes(a.pagamento)?a.pagamento:'Pix', data:dt, mes:dt.slice(0,7), criado:Date.now()}; await stores.caixa.save(rec); afterCaixaSave(rec); return 'Entrada lançada'; };
    } else if(a.tipo==='saida'){
      if(!(valor>0)) return;
      const cat = ['Material','Aluguel','Divulgação','Outros'].includes(a.categoria)?a.categoria:'Outros';
      k='Lançar saída'; line = (a.descricao||'Saída')+', '+cat+', '+shortDate(dt);
      run = async()=>{ const rec={id:newId('l'), kind:'out', valor, descricao:a.descricao||'', categoria:cat, data:dt, mes:dt.slice(0,7), criado:Date.now()}; await stores.caixa.save(rec); afterCaixaSave(rec); return 'Saída lançada'; };
    } else if(a.tipo==='compra'){
      const m = find('mat', a.materialId); const q = +a.qtd||0; if(!m || !(q>0)) return;
      k='Registrar compra'; line = q+' '+(m.unidade||'un.')+' de '+m.nome+' (estoque vai de '+fmtNum(+m.qtd||0)+' para '+fmtNum((+m.qtd||0)+q)+')'+(valor>0?', saída no caixa':'');
      run = async()=>{ const cur = find('mat', m.id)||m; await stores.mat.save(Object.assign({}, cur, {qtd:Math.round(((+cur.qtd||0)+q)*100)/100})); if(valor>0){ const rec={id:newId('l'), kind:'out', valor, descricao:'Compra: '+m.nome, categoria:'Material', data:dt, mes:dt.slice(0,7), criado:Date.now(), materialId:m.id}; await stores.caixa.save(rec); afterCaixaSave(rec); } return 'Compra registrada'; };
    } else if(a.tipo==='concluir'){
      const s = find('agenda', a.agendaId); if(!s || s.concluida) return;
      const kit = kitFor(s.estilo);
      const ag = NEEDLES.filter(c=>kit[c]).map(c=>kit[c]+'× '+NEEDLE_NAME[c]).join(', ');
      k='Concluir sessão'; line = s.cliente+(s.tattoo?', '+s.tattoo:'')+', '+(a.pagamento||'Pix')+', '+shortDate(dt)+'\nBaixa de agulhas: '+ag+(s.estilo?'':' (sessão sem estilo)');
      run = async()=>{ const cur = find('agenda', s.id); if(!cur || cur.concluida) return 'Essa sessão já estava concluída'; await concluirSessao(cur, valor, ['Pix','Cartão','Dinheiro'].includes(a.pagamento)?a.pagamento:'Pix', dt, cur.estilo, kit); setTimeout(()=>openMsg(Object.assign({}, cur, {concluida:true}), 'cuidados'), 400); return 'Sessão concluída'; };
    } else if(a.tipo==='agendar'){
      if(!a.cliente || !/^\d{4}-\d{2}-\d{2}$/.test(String(a.data||''))) return;
      const est = ESTILOS.includes(a.estilo) ? a.estilo : null;
      const hora = /^\d{2}:\d{2}$/.test(String(a.hora||'')) ? a.hora : '';
      const conflito = hora && data.agenda.some(x=>!x.concluida && x.data===a.data && x.hora && (()=>{ const [b,e]=sessionRange(x), ini=toMin(hora), fim=ini+Math.round((+data.cfg.duracao||3)*60); return ini<e && fim>b; })());
      k='Marcar sessão'; line = a.cliente+', '+shortDate(a.data)+(hora?' às '+hora:'')+(est?'\nEstilo: '+est:'\nSem estilo')+(a.tattoo?'\n'+a.tattoo:'')+((+a.sinal>0)?'\nSinal: '+brlPlain(a.sinal):'')+(conflito?'\nAtenção: bate com outra sessão nesse horário':'')+(mcp&&hora?'\nTambém cria no Google Agenda':'');
      run = async()=>{ const rec = {id:newId('a'), cliente:a.cliente, data:a.data, hora, estilo:est, tattoo:a.tattoo||'', valor:+a.valor||0, sinal:+a.sinal||0, telefone:a.telefone||'', notas:'', concluida:false}; await stores.agenda.save(rec);
        if(mcp && hora){ try{ const r = await googleCreate(rec); if(r){ await stores.agenda.save(Object.assign({}, rec, {googleId:r.id, fim:r.fim})); return 'Sessão marcada no app e no Google'; } }catch(e){ return 'Marcada no app. Não consegui criar no Google'; } }
        return 'Sessão marcada'; };
    } else if(a.tipo==='remarcar'){
      const x = find('agenda', a.agendaId); if(!x || !/^\d{4}-\d{2}-\d{2}$/.test(String(a.data||''))) return;
      const hora = /^\d{2}:\d{2}$/.test(String(a.hora||'')) ? a.hora : x.hora;
      k='Remarcar sessão'; line = x.cliente+'\nDe '+shortDate(x.data)+(x.hora?' às '+x.hora:'')+' para '+shortDate(a.data)+(hora?' às '+hora:'')+(x.googleId?'\nRemarque também no Google Agenda':'');
      run = async()=>{ const cur = find('agenda', x.id)||x; await stores.agenda.save(Object.assign({}, cur, {data:a.data, hora, fim:'', lembrado:null, remarcadoApp: !!cur.googleId})); return 'Sessão remarcada'; };
    } else if(a.tipo==='estilos'){
      const itens = (Array.isArray(a.itens)?a.itens:[]).map(i=>({s:find('agenda', i.agendaId), e:i.estilo})).filter(i=>i.s && ESTILOS.includes(i.e));
      if(!itens.length) return;
      k='Definir estilos'; line = itens.map(i=>i.s.cliente+': '+i.e).join('\n');
      run = async()=>{ for(const i of itens){ const cur = find('agenda', i.s.id)||i.s; await stores.agenda.save(Object.assign({}, cur, {estilo:i.e})); } return itens.length+(itens.length===1?' estilo definido':' estilos definidos'); };
    } else if(a.tipo==='pendencia'){
      if(!a.texto) return;
      const pz = /^\d{4}-\d{2}-\d{2}$/.test(String(a.prazo||'')) ? a.prazo : '';
      k='Nova pendência'; line = a.texto+(pz?'\nAté '+shortDate(pz):'');
      run = async()=>{ await stores.pend.save({id:newId('p'), texto:a.texto, prazo:pz, feito:false, criado:Date.now()}); return 'Pendência criada'; };
    } else if(a.tipo==='mensagens'){
      const kind = MSG[a.modelo] ? a.modelo : null; if(!kind) return;
      const ss = (Array.isArray(a.agendaIds)?a.agendaIds:[]).map(i=>find('agenda',i)).filter(Boolean);
      if(!ss.length) return;
      const card = document.createElement('div'); card.className='act';
      card.innerHTML = '<div class="k">'+esc(MSG[kind].titulo)+'</div><div class="line">Toque em cada cliente para revisar e enviar.</div><div class="row" style="flex-wrap:wrap">'+ss.map(x=>'<button class="btn ghost" data-sid="'+esc(x.id)+'">'+esc(firstName(x.cliente))+(x[MSG[kind].flag]?' ✓':'')+'</button>').join('')+'</div>';
      card.querySelectorAll('button[data-sid]').forEach(bt=>bt.onclick=()=>{ const x=find('agenda',bt.dataset.sid); if(x){ openMsg(x, kind); bt.textContent = firstName(x.cliente)+' ✓'; } });
      $('chatBody').appendChild(card); $('chatBody').scrollTop = $('chatBody').scrollHeight; return;
    } else if(a.tipo==='meta'){
      if(!(valor>0)) return;
      k='Definir meta mensal'; line = 'Meta de faturamento por mês';
      run = async()=>{ await cfgStore.save(Object.assign({}, data.cfg, {meta:valor})); return 'Meta salva'; };
    } else if(a.tipo==='horario'){
      const dias = (Array.isArray(a.dias)?a.dias:[]).filter(d=>DIAS.includes(d));
      const ini = /^\d{2}:\d{2}$/.test(String(a.inicio||''))?a.inicio:data.cfg.inicio, fim = /^\d{2}:\d{2}$/.test(String(a.fim||''))?a.fim:data.cfg.fim;
      const dur = +a.duracao>0 ? +a.duracao : data.cfg.duracao;
      k='Mudar horário de atendimento'; line = (dias.length?dias.join(', '):data.cfg.dias.join(', '))+'\nDas '+ini+' às '+fim+'\nSessão padrão: '+fmtNum(dur)+'h';
      run = async()=>{ await cfgStore.save(Object.assign({}, data.cfg, {dias:dias.length?dias:data.cfg.dias, inicio:ini, fim, duracao:dur})); return 'Horário salvo'; };
    } else if(a.tipo==='mensagem_livre'){
      if(!a.texto) return;
      const card = document.createElement('div'); card.className='act';
      card.innerHTML = '<div class="k">'+esc(a.titulo||'Mensagem para o cliente')+'</div><div class="line">'+esc(a.texto)+'</div><div class="row"><button class="btn primary">Copiar</button><a class="btn ghost" style="text-align:center;text-decoration:none" target="_blank" rel="noopener" href="'+esc('https://wa.me/?text='+encodeURIComponent(a.texto))+'">WhatsApp</a></div>';
      card.querySelector('button').onclick = async()=>{ try{ await navigator.clipboard.writeText(a.texto); toast('Mensagem copiada'); }catch(e){ toast('Não consegui copiar. Segure o texto para copiar.'); } };
      $('chatBody').appendChild(card); $('chatBody').scrollTop = $('chatBody').scrollHeight; return;
    } else if(a.tipo==='orcamento'){
      if(!a.cliente) return;
      const et = ETAPAS.find(e=>e.k===a.etapa) ? a.etapa : 'novo';
      k='Novo orçamento'; line = a.cliente+(a.ideia?', '+a.ideia:'')+(a.tamanho?', '+a.tamanho:'')+(a.local?', '+a.local:'')+'\nEtapa: '+etapaNome(et)+((+a.valor>0)?'\nValor: '+brlPlain(a.valor)+', sinal '+brlPlain(sinalDe(+a.valor)):'');
      run = async()=>{ await stores.orc.save({id:newId('o'), cliente:a.cliente, ideia:a.ideia||'', estilo:ESTILOS.includes(a.estilo)?a.estilo:'', tamanho:a.tamanho||'', local:a.local||'', valor:+a.valor||0, etapa:et, followups:0, criado:Date.now(), atualizado:Date.now(), ultimoContato:today(), telefone:'', notas:''}); return 'Orçamento criado'; };
    } else return;
    const card = document.createElement('div'); card.className = 'act';
    card.innerHTML = '<div class="k">'+esc(k)+'</div>'+(valor>0 && a.tipo!=='agendar'?'<div class="v num">'+esc(brlPlain(valor))+'</div>':'')+'<div class="line">'+esc(line)+'</div><div class="row"><button class="btn primary">Confirmar</button><button class="btn ghost">Descartar</button></div>';
    const [ok, no] = card.querySelectorAll('button');
    ok.onclick = async()=>{ ok.disabled = no.disabled = true; try{ const m = await run(); card.classList.add('done'); card.querySelector('.row').innerHTML = '<span class="s">✓ '+esc(m)+'</span>'; toast(m); }catch(e){ ok.disabled = no.disabled = false; toast('Não foi possível salvar. Tente de novo.'); } };
    no.onclick = ()=>{ card.classList.add('done'); card.querySelector('.row').innerHTML = '<span class="s">Descartado</span>'; };
    $('chatBody').appendChild(card); $('chatBody').scrollTop = $('chatBody').scrollHeight;
  }
  $('chatSend').onclick = ()=>{ if(chatBusy){ chatCtl && chatCtl.abort(); return; } const v=$('chatIn').value; $('chatIn').value=''; autoGrow(); ask(v); };
  $('chatIn').addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); $('chatSend').click(); } });
  function autoGrow(){ const t=$('chatIn'); t.style.height='auto'; t.style.height=Math.min(120,t.scrollHeight)+'px'; }
  $('chatIn').addEventListener('input', autoGrow);
  $('chatSug').addEventListener('click', e=>{ const f=e.target.closest('button[data-fill]'); if(f){ $('chatIn').value=f.dataset.fill; autoGrow(); $('chatIn').focus(); return; } const b=e.target.closest('button[data-q]'); if(b) ask(b.dataset.q); });

  // ---------- Ajustes, meta, horários livres, clientes, fechamento ----------
  const DIAS = ['dom','seg','ter','qua','qui','sex','sáb'];
  const toMin = h => { const [a,b]=String(h||'0:0').split(':').map(Number); return (a||0)*60+(b||0); };
  const toHH = m => pad(Math.floor(m/60))+':'+pad(m%60);
  function formConfig(){
    const c = data.cfg;
    openForm({
      title:'Ajustes do estúdio',
      values:{meta:c.meta||null, inicio:c.inicio, fim:c.fim, dias:c.dias, duracao:c.duracao, custosFixos:c.custosFixos||null},
      fields:[
        {k:'meta',label:'Meta de faturamento do mês',type:'money',ph:'R$ 0,00'},
        {k:'dias',label:'Dias de atendimento',type:'multi',options:DIAS},
        {k:'inicio',label:'Começo do atendimento',type:'time'},
        {k:'fim',label:'Fim do atendimento',type:'time'},
        {k:'duracao',label:'Duração padrão de uma sessão (horas)',type:'number',ph:'3'},
        {k:'custosFixos',label:'Custos fixos do mês (aluguel, contas)',type:'money',ph:'R$ 0,00'},
        {hint:'O horário e a duração servem para calcular os horários livres. Sessões vindas do Google usam o horário de término do evento.'}
      ],
      validate:v=> (v.inicio && v.fim && toMin(v.fim)<=toMin(v.inicio)) ? 'O fim precisa ser depois do começo.' : '',
      onSave: async v=>{ await cfgStore.save(Object.assign({}, data.cfg, {meta:v.meta||0, inicio:v.inicio||'09:00', fim:v.fim||'18:00', dias:(v.dias&&v.dias.length)?v.dias:CFG_DEFAULT.dias, duracao:v.duracao>0?v.duracao:3, custosFixos:v.custosFixos||0})); return 'Ajustes salvos'; }
    });
  }
  function sessionRange(a){
    const ini = toMin(a.hora||data.cfg.inicio);
    const fim = a.fim ? toMin(a.fim) : ini + Math.round((+data.cfg.duracao||3)*60);
    return [ini, Math.max(fim, ini+30)];
  }
  function freeSlots(days){
    const out = []; const t = today(); const now = new Date(); const nowMin = now.getHours()*60+now.getMinutes();
    const minLen = Math.round((+data.cfg.duracao||3)*60);
    for(let i=0;i<days;i++){
      const d = addDays(t,i); const wd = DIAS[new Date(d+'T12:00:00').getDay()];
      if(!data.cfg.dias.includes(wd)) continue;
      let ini = toMin(data.cfg.inicio), fim = toMin(data.cfg.fim);
      if(i===0) ini = Math.max(ini, Math.ceil((nowMin+30)/30)*30);
      const busy = data.agenda.filter(a=>a.data===d && a.hora).map(sessionRange).sort((x,y)=>x[0]-y[0]);
      const free = []; let cur = ini;
      busy.forEach(([b,e])=>{ if(b-cur>=minLen) free.push([cur,b]); cur = Math.max(cur,e); });
      if(fim-cur>=minLen) free.push([cur,fim]);
      if(free.length) out.push({data:d, livres:free.map(([a,b])=>toHH(a)+' às '+toHH(b))});
    }
    return out;
  }
  function slotsText(sl){
    return 'Tenho estes horários livres nos próximos dias:\n'+sl.map(x=>'• '+new Date(x.data+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'numeric'})+': '+x.livres.join(', ')).join('\n')+'\nQual fica melhor pra você? Lembrando que o agendamento é feito mediante sinal para reserva do horário.';
  }
  function openSlots(){
    const sl = freeSlots(7);
    const html = sl.length ? '<div class="slots">'+sl.map(x=>'<div class="day">'+esc(dayLabel(x.data))+'</div>'+x.livres.map(l=>'<span class="slot num">'+esc(l)+'</span>').join('')).join('')+'</div>' : '<div class="empty">Nenhum horário livre nos próximos 7 dias, com a duração padrão de '+fmtNum(+data.cfg.duracao||3)+'h.</div>';
    openForm({
      title:'Horários livres', noSave:true, noFocus:true, values:{texto: sl.length?slotsText(sl):''},
      fields:[
        {hint:'Atendimento '+data.cfg.dias.join(', ')+', das '+data.cfg.inicio+' às '+data.cfg.fim+'. Considera só as sessões que estão no app. Mude em Ajustes (engrenagem no topo).'},
        {html: html},
      ].concat(sl.length?[{k:'texto',label:'Mensagem para o cliente (pode editar)',type:'textarea'},{html:'<button type="button" class="btn ghost" id="slotCopy" style="width:100%;margin-bottom:10px">Copiar mensagem</button>'}]:[])
    });
    const b = $('slotCopy'); if(b) b.onclick = async()=>{ const ta=$('f_texto'); try{ await navigator.clipboard.writeText(ta.value); }catch(e){ ta.focus(); ta.select(); try{ document.execCommand('copy'); }catch(_){} } toast('Mensagem copiada'); };
  }
  function fechamento(list, m){
    const it = list.filter(x=>x.mes===m);
    const ins = it.filter(x=>x.kind==='in'), outs = it.filter(x=>x.kind==='out');
    const sum = a => Math.round(a.reduce((s,x)=>s+(+x.valor||0),0)*100)/100;
    const sess = ins.filter(x=>x.tipo==='Sessão');
    const porCat = {}; outs.forEach(x=>{ porCat[x.categoria||'Outros'] = Math.round(((porCat[x.categoria||'Outros']||0)+(+x.valor||0))*100)/100; });
    const porPag = {}; ins.forEach(x=>{ porPag[x.pagamento||'?'] = Math.round(((porPag[x.pagamento||'?']||0)+(+x.valor||0))*100)/100; });
    const e = sum(ins), sa = sum(outs);
    return {mes:m, entradas:e, saidas:sa, lucro:Math.round((e-sa)*100)/100, sinais:sum(ins.filter(x=>x.tipo==='Sinal')), sessoes:sess.length, ticketMedio: sess.length?Math.round(e/sess.length*100)/100:0, gastosPorCategoria:porCat, entradasPorPagamento:porPag};
  }
  const prevMonth = m => { const [y,mm]=m.split('-').map(Number); const d=new Date(y,mm-2,1); return d.getFullYear()+'-'+pad(d.getMonth()+1); };
  const normName = n => String(n||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  let caixaCache = null, caixaCacheAt = 0;
  async function loadCaixaAll(force){
    if(!force && caixaCache && Date.now()-caixaCacheAt<30000) return caixaCache;
    try{ caixaCache = await stores.caixa.all(); }catch(e){ caixaCache = caixaCache || data.caixa; }
    caixaCacheAt = Date.now(); return caixaCache;
  }
  function buildClients(caixaAll){
    const map = {};
    const get = nome => { const k = normName(nome); if(!k) return null; if(!map[k]) map[k] = {key:k, nome:String(nome).trim(), total:0, sessoes:0, ultima:'', proxima:'', telefone:'', tattoos:[], hist:[]}; return map[k]; };
    caixaAll.filter(x=>x.kind==='in' && x.cliente).forEach(x=>{ const c=get(x.cliente); if(!c) return; c.total += +x.valor||0; if(x.tipo==='Sessão' && !x.agendaId) c.sessoes++; if(x.data>c.ultima) c.ultima=x.data; c.hist.push({data:x.data, txt:(x.tipo||'Entrada')+': '+brl.format(+x.valor||0)+(x.descricao?', '+x.descricao:'')}); });
    data.agenda.forEach(a=>{ const c=get(a.cliente); if(!c) return; if(a.telefone) c.telefone=a.telefone; if(a.tattoo) c.tattoos.push(a.tattoo);
      if(a.concluida){ c.sessoes++; if(a.data>c.ultima) c.ultima=a.data; c.hist.push({data:a.data, txt:'Sessão'+(a.estilo?' de '+a.estilo:'')+(a.tattoo?': '+a.tattoo:'')}); }
      else if(a.data>=today() && (!c.proxima || a.data<c.proxima)) c.proxima = a.data; });
    return Object.values(map).map(c=>{ c.total=Math.round(c.total*100)/100; c.hist.sort((a,b)=>b.data.localeCompare(a.data)); c.tattoos=[...new Set(c.tattoos)]; return c; });
  }
  let clientsList = [];
  async function renderClientes(force){
    const all = await loadCaixaAll(force);
    clientsList = buildClients(all);
    const q = normName($('cliSearch').value);
    const t = today(), lim = addDays(t,-90);
    const reat = clientsList.filter(c=>c.ultima && c.ultima<=lim && !c.proxima && !((data.cfg.reativados||{})[c.key] > Date.now()-90*86400000));
    const list = clientsList.filter(c=>!q || c.key.includes(q)).sort((a,b)=>(b.ultima||b.proxima||'').localeCompare(a.ultima||a.proxima||''));
    $('cliSub').textContent = clientsList.length ? clientsList.length+(clientsList.length===1?' cliente':' clientes')+(reat.length?', '+reat.length+' para reativar':'') : '';
    const card = c => '<div class="card"><button class="open" data-act="cliente" data-id="'+esc(c.key)+'"><span class="cli-av">'+esc(c.nome.charAt(0).toUpperCase())+'</span><span class="main"><div class="t">'+esc(c.nome)+'</div><div class="s">'+esc([c.proxima?'Próxima: '+shortDate(c.proxima):'', c.ultima?'Última: '+shortDate(c.ultima):'', c.sessoes?c.sessoes+(c.sessoes===1?' sessão':' sessões'):''].filter(Boolean).join(', '))+'</div></span><span class="v num">'+money(c.total)+'</span></button></div>';
    let h = '';
    if(!q && reat.length){ h += '<div class="sec">Para reativar (90+ dias sem voltar)</div>'+reat.map(card).join(''); }
    h += '<div class="sec">'+(q?'Resultado':'Todos')+'</div>'+(list.length?list.map(card).join(''):'<div class="empty">'+(q?'Nenhum cliente com esse nome.':'Os clientes aparecem aqui conforme você lança no caixa e marca sessões.')+'</div>');
    $('cliList').innerHTML = h;
  }
  $('cliSearch').addEventListener('input', ()=>renderClientes(false));
  function textoReativar(c){
    const nome = firstName(c.nome);
    const tat = c.tattoos[0];
    return 'Olá, '+nome+'! Tudo bem? '+(tat?'Lembrei do seu projeto ('+tat+'). ':'')+'Como está a sua tattoo? Se puder, me manda uma foto, gosto de acompanhar.\nE se já estiver pensando na próxima, me conta a ideia.';
  }
  function openCliente(key){
    const c = clientsList.find(x=>x.key===key); if(!c) return;
    const hist = c.hist.slice(0,10).map(h=>'<li>'+esc(h.txt)+'<br><small>'+esc(dayLabel(h.data))+'</small></li>').join('');
    openForm({
      title:c.nome, noSave:true, noFocus:true, values:{texto:textoReativar(c)},
      fields:[
        {html:'<div class="cli-stats"><div><span>Gasto</span><b class="num">'+(masked?'••••':esc(brl.format(c.total)))+'</b></div><div><span>Sessões</span><b class="num">'+c.sessoes+'</b></div><div><span>Última</span><b class="num">'+(c.ultima?esc(shortDate(c.ultima)):'–')+'</b></div></div>'+(hist?'<ul class="hist-l">'+hist+'</ul>':'')},
        {k:'texto',label:'Mensagem para chamar de volta (pode editar)',type:'textarea'},
        {html:'<a class="wa" id="cliWa" href="#" target="_blank" rel="noopener">Abrir no WhatsApp</a><button type="button" class="btn ghost" id="cliAgendar" style="width:100%;margin-bottom:10px">Marcar sessão para '+esc(firstName(c.nome))+'</button>'}
      ]
    });
    $('cliWa').onclick = ()=>{ $('cliWa').href = waLink({telefone:c.telefone}, $('f_texto').value); const r = Object.assign({}, data.cfg.reativados||{}); r[c.key] = Date.now(); cfgStore.save(Object.assign({}, data.cfg, {reativados:r})).catch(()=>{}); setTimeout(closeForm,300); };
    $('cliAgendar').onclick = ()=>{ closeForm(); setTimeout(()=>formAgenda(null, {cliente:c.nome, telefone:c.telefone}), 280); };
  }
  function renderMeta(){
    const meta = +data.cfg.meta||0, box = $('metaBox');
    const cur = mes===today().slice(0,7) || true;
    if(!meta){ box.hidden = true; return; }
    box.hidden = false;
    const tIn = data.caixa.filter(x=>x.kind==='in').reduce((s,x)=>s+(+x.valor||0),0);
    const pct = Math.min(100, Math.round(tIn/meta*100));
    $('metaVal').textContent = brl.format(meta);
    $('metaPct').textContent = (masked?'••':pct)+'%';
    $('metaBar').style.width = (masked?0:pct)+'%';
    $('metaFalta').innerHTML = tIn>=meta ? 'Meta batida neste mês' : 'Faltam <span class="mv">'+esc(brl.format(meta-tIn))+'</span> em entradas';
  }
  function briefItems(){
    const t = today(), out = [];
    const hoje = data.agenda.filter(a=>!a.concluida && a.data===t).sort((a,b)=>(a.hora||'').localeCompare(b.hora||''));
    if(hoje.length) out.push({ic:'◉', t: hoje.length===1 ? 'Sessão hoje: '+hoje[0].cliente : hoje.length+' sessões hoje', s: hoje.map(a=>(a.hora||'')+' '+a.cliente).join(', '), go:'agenda'});
    autoPend().forEach(p=>{ out.push({ic: p.auto==='mat'?'!':'›', red: p.auto==='mat' || p.auto==='agenda', t:p.texto, s:p.sub, act:p}); });
    data.pend.filter(p=>!p.feito && p.prazo && p.prazo<=t).forEach(p=>out.push({ic:'!', red:true, t:p.texto, s:p.prazo<t?'Pendência atrasada':'Vence hoje', go:'pend'}));
    return out;
  }
  function renderBrief(){
    const it = briefItems().slice(0,3), total = briefItems().length;
    if(!it.length) return '';
    return '<div class="brief"><div class="bh"><span>Hoje</span><small>'+(total>3?'+'+(total-3)+' em Pendências':'')+'</small></div>'+it.map((x,i)=>'<button data-act="briefGo" data-i="'+i+'"><span class="ic'+(x.red?' red':'')+'">'+esc(x.ic)+'</span><span class="main"><div class="t">'+esc(x.t)+'</div><div class="s">'+esc(x.s||'')+'</div></span></button>').join('')+'</div>';
  }
  async function googleCreate(a){
    if(!mcp || !a.hora) return null;
    const ini = toMin(a.hora), fimM = ini + Math.round((+data.cfg.duracao||3)*60);
    const fim = fimM >= 24*60 ? '23:59' : toHH(fimM);
    const desc = [a.estilo?'Estilo: '+a.estilo:'', +a.sinal>0?'Sinal: '+brl.format(+a.sinal):'', +a.valor>0?'Valor combinado: '+brl.format(+a.valor):'', a.notas||''].filter(Boolean).join('\n');
    const res = await mcp.callTool('Google Calendar','create_event',{summary:a.cliente+' Tattoo'+(a.tattoo?' '+a.tattoo:''), startTime:a.data+'T'+a.hora+':00-03:00', endTime:a.data+'T'+fim+':00-03:00', timeZone:'America/Sao_Paulo', description:desc, notificationLevel:'NONE'});
    let p = res && res.payload;
    if(!p && res && res.content){ const tb = res.content.find(c=>c.type==='text'); if(tb){ try{ p = JSON.parse(tb.text); }catch(e){} } }
    if(typeof p==='string'){ try{ p = JSON.parse(p); }catch(e){} }
    return p && p.id ? {id:p.id, fim} : null;
  }


  // ---------- Google Agenda (só leitura: Google → app) ----------
  let mcp = null, syncing = false;
  async function setupGoogle(){
    try{ mcp = await window.claude.use('mcp'); }catch(e){ mcp = null; }
    if(!mcp) return;
    $('syncbar').hidden = false;
    let last = null; try{ last = localStorage.getItem('andre-gsync'); }catch(e){}
    $('gStatus').textContent = last ? 'Google Agenda: atualizado '+new Date(+last).toLocaleString('pt-BR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : 'Puxe suas sessões do Google Agenda';
    let st = 'prompt';
    try{ const perm = await window.claude.use('permissions'); if(perm) st = await perm.state('mcp:Google Calendar').catch(()=> 'unavailable'); }catch(e){}
    if(st==='granted') setTimeout(()=>syncGoogle(false), 1500);
  }
  function parseBR(s){
    s = String(s||'').trim();
    if(s.includes(',')) s = s.replace(/\./g,'').replace(',','.');
    else if(/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g,'');
    const n = parseFloat(s); return isFinite(n) ? n : 0;
  }
  function fromEvent(ev){
    const title = String(ev.summary||'').replace(/\s+/g,' ').trim();
    const mt = title.match(/^(.*?)\s*\b(tattoo|tatuagem|tatto|tatoo)\b\s*(.*)$/i);
    // o nome do cliente fica exatamente como está no Google Agenda
    let cliente = title, tattoo = mt ? mt[3].trim() : '';
    const desc = String(ev.description||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').trim();
    const ms = desc.match(/sinal[^\d\n]*(\d[\d.]*(?:,\d{1,2})?)/i);
    const mr = desc.match(/restante[^\d\n]*(\d[\d.]*(?:,\d{1,2})?)/i);
    const sinal = ms ? parseBR(ms[1]) : 0;
    const valor = mr ? sinal + parseBR(mr[1]) : 0;
    if(!tattoo){ const l = desc.split('\n').map(x=>x.trim()).find(x=>x && !/sinal|restante/i.test(x)); if(l && l.length<60) tattoo = l; }
    const dt = ev.start.dateTime;
    const fimDt = ev.end && ev.end.dateTime ? ev.end.dateTime : '';
    return { cliente, tattoo, data: dt.slice(0,10), hora: dt.slice(11,16), fim: fimDt.slice(0,10)===dt.slice(0,10) ? fimDt.slice(11,16) : '', sinal, valor, notas: desc.replace(/\n+/g,' | ').slice(0,300) };
  }
  async function syncGoogle(manual){
    if(!mcp || syncing) return;
    syncing = true; $('gBtn').disabled = true; $('gStatus').textContent = 'Buscando no Google Agenda…';
    const now = new Date();
    const start = now.getFullYear()+'-'+pad(now.getMonth()+1)+'-01T00:00:00-03:00';
    const endD = new Date(now.getFullYear(), now.getMonth()+5, 0);
    const end = endD.getFullYear()+'-'+pad(endD.getMonth()+1)+'-'+pad(endD.getDate())+'T23:59:59-03:00';
    try{
      const res = await mcp.callTool('Google Calendar','list_events',{startTime:start, endTime:end, orderBy:'startTime', pageSize:250, timeZone:'America/Sao_Paulo'}, {cache:false});
      let p = res && res.payload;
      if(!p && res && res.content){ const tb = res.content.find(c=>c.type==='text'); if(tb){ try{ p = JSON.parse(tb.text); }catch(e){} } }
      if(typeof p==='string'){ try{ p = JSON.parse(p); }catch(e){} }
      const events = (p && p.events) || [];
      let novos = 0, atual = 0;
      for(const ev of events){
        if(!ev || ev.status==='cancelled' || !ev.start || !ev.start.dateTime) continue;
        const id = 'g'+ev.id, info = fromEvent(ev);
        const cur = allAgenda.find(x=>x.id===id || x.googleId===ev.id);
        if(!cur){
          await stores.agenda.save(Object.assign({id, googleId:ev.id, telefone:'', concluida:false}, info)); novos++;
        } else if(!cur.ignorado && !cur.concluida){
          const upd = Object.assign({}, cur); let ch = false;
          if(!cur.remarcadoApp && cur.data!==info.data){ upd.data=info.data; ch=true; }
          if(!cur.remarcadoApp && cur.hora!==info.hora){ upd.hora=info.hora; ch=true; }
          if(info.fim && cur.fim!==info.fim && !cur.remarcadoApp){ upd.fim=info.fim; ch=true; }
          if(!(+cur.sinal) && info.sinal){ upd.sinal=info.sinal; ch=true; }
          if(!(+cur.valor) && info.valor){ upd.valor=info.valor; ch=true; }
          if(ch){ await stores.agenda.save(upd); atual++; }
        }
      }
      try{ localStorage.setItem('andre-gsync', String(Date.now())); }catch(e){}
      $('gStatus').textContent = 'Google Agenda: atualizado agora';
      if(manual || novos || atual) toast(novos||atual ? (novos?novos+' nova(s) sessão(ões)':'')+(novos&&atual?', ':'')+(atual?atual+' atualizada(s)':'') : 'Agenda já estava em dia');
    }catch(e){
      const c = e && e.code;
      $('gStatus').textContent =
        c==='needs_reauth' ? 'Reconecte o Google Agenda em Configurações › Conectores do Claude.' :
        c==='server_not_connected' ? 'Adicione o Google Agenda em Configurações › Conectores do Claude.' :
        (c==='not_in_manifest'||c==='not_granted'||c==='consent_required') ? 'Acesso ao Google Agenda não autorizado neste app.' :
        c==='server_unavailable' ? 'Google Agenda fora do ar agora. Tente de novo em instantes.' :
        'Não foi possível ler o Google Agenda. Tente de novo.';
    }finally{ syncing = false; $('gBtn').disabled = false; }
  }

  // Ajuste rápido de quantidade: espera a pessoa parar de tocar antes de salvar
  const qtyTimers = {};
  function bumpQty(id, delta){
    const m = find('mat', id); if(!m) return;
    const nq = Math.max(0, Math.round(((+m.qtd||0)+delta)*100)/100);
    const local = Object.assign({}, m, {qtd:nq});
    data.mat = data.mat.map(x=>x.id===id?local:x); renderAll();
    clearTimeout(qtyTimers[id]);
    qtyTimers[id] = setTimeout(()=>{ stores.mat.save(find('mat',id)).catch(()=>toast('Não foi possível salvar a quantidade.')); }, 600);
  }

  // ---------- Ações ----------
  const ORDER = ['hoje','agenda','cli','caixa','mais'];
  const TABOF = {pend:'mais', mat:'mais', aprend:'mais', funil:'cli'};
  const pt = t => TABOF[t]||t;
  function riseCards(sec){
    if(!sec) return;
    sec.querySelectorAll('.card,.empty,.stub,.kpis,.askbar,.brief,.nextcard,.syncbar,.ndl,.forecast').forEach((c,i)=>{ c.classList.remove('rise'); void c.offsetWidth; c.style.animationDelay = Math.min(i,10)*35+'ms'; c.classList.add('rise'); });
  }
  function moveInd(){ const i = Math.max(0, ORDER.indexOf(pt(tab))); $('tabInd').style.transform = 'translateX('+(i*100)+'%)'; }
  function setTab(t){
    if(t===tab){ window.scrollTo({top:0,behavior:'smooth'}); return; }
    const dir = ORDER.indexOf(pt(t)) > ORDER.indexOf(pt(tab)) ? 'enter-r' : 'enter-l';
    tab=t; try{ localStorage.setItem('andre-tab2', t); }catch(e){}
    if(t==='caixa') lastLucro = 0;
    renderAll(); moveInd(); window.scrollTo(0,0);
    if(t==='cli') renderClientes(true).then(()=>riseCards(document.querySelector('[data-view="cli"]')));
    const sec = document.querySelector('[data-view="'+t+'"]');
    sec.classList.remove('enter-r','enter-l'); void sec.offsetWidth; sec.classList.add(dir);
    riseCards(sec);
  }
  document.addEventListener('click', e=>{
    const tb = e.target.closest('.tab'); if(tb){ setTab(tb.dataset.tab); return; }
    const b = e.target.closest('[data-act]'); if(!b) return;
    const id = b.dataset.id;
    switch(b.dataset.act){
      case 'prev': case 'next': {
        const [y,mm]=mes.split('-').map(Number); const d=new Date(y,mm-1+(b.dataset.act==='next'?1:-1),1);
        mes = d.getFullYear()+'-'+pad(d.getMonth()+1);
        const sec = document.querySelector('[data-view="caixa"]');
        sec.classList.remove('month-r','month-l'); void sec.offsetWidth; sec.classList.add(b.dataset.act==='next'?'month-r':'month-l');
        lastLucro = 0; subscribeCaixa(); renderCaixa(); riseCards(sec); break;
      }
      case 'goTab': setTab(b.dataset.tabGo); break;
      case 'openChat': openChat(); break;
      case 'config': formConfig(); break;
      case 'slots': openSlots(); break;
      case 'cliente': openCliente2(id); break;
      case 'briefGo': {
        const x = briefItems()[+b.dataset.i]; if(!x) break;
        if(x.act){ const p=x.act; if(p.auto==='agenda'){ const a=find('agenda',p.ref); setTab('agenda'); if(a) formConcluir(a); } else if(p.auto==='msg'){ const a=find('agenda',p.ref); if(a) openMsg(a,p.kind); } else { const m=find('mat',p.ref); setTab('mat'); if(m) formCompra(m); } }
        else if(x.go) setTab(x.go);
        break;
      }
      case 'closeChat': closeChat(); break;
      case 'addNeedle': formMat(null, id); break;
      case 'mask': {
        masked = !masked; try{ localStorage.setItem('andre-mask', masked?'1':'0'); }catch(e){}
        lastLucro = masked ? null : 0; renderAll(); flash(document.body); break;
      }
      case 'addIn': formEntrada(); break;
      case 'addOut': formSaida(); break;
      case 'editCaixa': { const it=find('caixa',id); if(it) (it.kind==='in'?formEntrada:formSaida)(it); break; }
      case 'addAgenda': formAgenda(); break;
      case 'editAgenda': { const a=find('agenda',id); if(a) formAgenda(a); break; }
      case 'concluir': { const a=find('agenda',id); if(a) formConcluir(a); break; }
      case 'msg': { const a=find('agenda',id); if(a) openMsg(a, b.dataset.msg); break; }
      case 'gsync': syncGoogle(true); break;
      case 'addPend': formPend(); break;
      case 'editPend': { const p=find('pend',id); if(p) formPend(p); break; }
      case 'togglePend': { const p=find('pend',id); if(p){ const np=Object.assign({},p,{feito:!p.feito, feitoEm:!p.feito?Date.now():null}); data.pend=data.pend.map(x=>x.id===id?np:x); renderAll(); stores.pend.save(np).catch(()=>toast('Não foi possível salvar.')); if(np.feito) toast('Feito'); } break; }
      case 'goAuto': {
        if(b.dataset.kind==='agenda'){ const a=find('agenda',id); setTab('agenda'); if(a) formConcluir(a); }
        else if(b.dataset.kind==='msg'){ const a=find('agenda',id); if(a) openMsg(a, b.dataset.msg); }
        else { const m=find('mat',id); setTab('mat'); if(m) formCompra(m); }
        break;
      }
      case 'addMat': formMat(); break;
      case 'editMat': { const m=find('mat',id); if(m) formMat(m); break; }
      case 'comprar': { const m=find('mat',id); if(m) formCompra(m); break; }
      case 'qtyMinus': bumpQty(id,-1); break;
      case 'qtyPlus': bumpQty(id,1); break;
      default: extraAct(b.dataset.act, b, id);
    }
  });

  let tt;
  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),2000); }
