/* PARTE 3 do closure: Clube 15 (pré-reserva da agenda).
   Regras: clube-15/REGULAMENTO.md. Mudou lá, muda CLUBE aqui. */

const CLUBE = { vagas:15, mensalidade:150, carenciaMeses:3, validadeMeses:12, avisoSaidaDias:30, saldoAposSaidaMeses:6, sessoesPorMes:1, prioridadesPorMes:4 };

const addMeses = (ds, n) => {
  const [y,m,d] = ds.split('-').map(Number);
  const alvo = new Date(y, m-1+n, 1);
  const ultimo = new Date(alvo.getFullYear(), alvo.getMonth()+1, 0).getDate();
  return alvo.getFullYear()+'-'+pad(alvo.getMonth()+1)+'-'+pad(Math.min(d, ultimo));
};
const mesesEntre = (de, ate) => {
  const [y1,m1,d1] = de.split('-').map(Number), [y2,m2,d2] = ate.split('-').map(Number);
  return (y2-y1)*12 + (m2-m1) - (d2 < d1 ? 1 : 0);
};
const mesRef = ds => { const [y,m] = ds.split('-'); return m+'/'+y; };

const membros = () => data.clube.filter(x=>x.kind==='membro');
const movsDe = (mid, kind) => data.clube.filter(x=>x.membroId===mid && (!kind || x.kind===kind));
const ativoNoClube = m => m.status==='ativo' || m.status==='aviso';
const vagasLivres = () => Math.max(0, CLUBE.vagas - membros().filter(ativoNoClube).length);

const pagoTotal = mid => movsDe(mid,'pg').reduce((s,x)=>s+(+x.valor||0),0);
const usadoTotal = mid => movsDe(mid).filter(x=>x.kind==='uso'||x.kind==='dev').reduce((s,x)=>s+(+x.valor||0),0);
const saldoDe = mid => Math.round((pagoTotal(mid) - usadoTotal(mid))*100)/100;

/* Cada pagamento vale 12 meses (regulamento 2.6). O crédito usado consome
   os pagamentos mais antigos primeiro, então o que sobra é sempre o mais novo. */
function lotesDe(mid){
  const pgs = movsDe(mid,'pg').slice().sort((a,b)=>String(a.data).localeCompare(String(b.data)));
  let resto = usadoTotal(mid);
  return pgs.map(p=>{
    const v = +p.valor||0, consumido = Math.min(v, resto);
    resto -= consumido;
    return { data:p.data, restante: Math.round((v-consumido)*100)/100, vence: addMeses(p.data, CLUBE.validadeMeses) };
  }).filter(l=>l.restante > 0);
}
function creditoVencendo(mid, dias){
  const lim = addDays(today(), dias==null?60:dias);
  return lotesDe(mid).filter(l=>l.vence <= lim).reduce((s,l)=>s+l.restante,0);
}
/* Mensalidades devidas desde a entrada (a primeira vence no dia da entrada). */
function devidasDe(m){
  const fim = (m.status==='saiu' && m.saida) ? m.saida : today();
  if(fim < m.entrada) return 0;
  return mesesEntre(m.entrada, fim) + 1;
}
const atrasoDe = m => Math.max(0, devidasDe(m) - movsDe(m.id,'pg').length);
const mesesDe = m => Math.max(0, mesesEntre(m.entrada, today()) + 1);
const carenciaOk = m => mesesEntre(m.entrada, today()) >= CLUBE.carenciaMeses;
const proxCobranca = m => {
  const n = movsDe(m.id,'pg').length;
  return addMeses(m.entrada, n);
};
const sessoesNoMes = (mid, ym) => movsDe(mid,'uso').filter(x=>String(x.data).slice(0,7)===ym).length;

function clubeResumo(){
  const ativos = membros().filter(ativoNoClube);
  const credito = membros().reduce((s,m)=>s+Math.max(0, saldoDe(m.id)), 0);
  return {
    vagas: CLUBE.vagas, ocupadas: ativos.length, livres: vagasLivres(),
    mensalidade: CLUBE.mensalidade,
    receitaRecorrenteMes: ativos.reduce((s,m)=>s+(+m.mensalidade||CLUBE.mensalidade), 0),
    creditoEmAberto: Math.round(credito*100)/100,
    jaVirouTattoo: Math.round(membros().reduce((s,m)=>s+movsDe(m.id,'uso').reduce((t,x)=>t+(+x.valor||0),0),0)*100)/100,
    atrasados: ativos.filter(m=>atrasoDe(m)>0).length,
    avisaramSaida: membros().filter(m=>m.status==='aviso').length
  };
}

function clubeAlertas(){
  const out = [];
  const ativos = membros().filter(ativoNoClube);
  const atrasados = ativos.filter(m=>atrasoDe(m)>0);
  if(atrasados.length) out.push({ic:'!', red:true, t: atrasados.length===1 ? '1 mensalidade do clube em atraso' : atrasados.length+' mensalidades do clube em atraso',
    s: atrasados.slice(0,3).map(m=>firstName(m.nome)+' ('+atrasoDe(m)+')').join(', ')+'. Sem pagamento em dia não há prioridade.', act:'goClube'});
  const venc = ativos.map(m=>({m, v:creditoVencendo(m.id, 60)})).filter(x=>x.v>0);
  if(venc.length) out.push({ic:'!', red:false, t: venc.length===1 ? 'Crédito do clube vencendo em 60 dias' : venc.length+' membros com crédito vencendo',
    s: venc.slice(0,3).map(x=>firstName(x.m.nome)+' '+brl.format(x.v)).join(', ')+'. Chame para marcar.', act:'goClube'});
  const hoje = today();
  const cobrar = ativos.filter(m=>atrasoDe(m)===0 && proxCobranca(m) >= hoje && proxCobranca(m) <= addDays(hoje,2));
  if(cobrar.length) out.push({ic:'›', red:false, t: cobrar.length+(cobrar.length===1?' mensalidade a receber':' mensalidades a receber')+' nos próximos dias',
    s: cobrar.slice(0,3).map(m=>firstName(m.nome)+' '+shortDate(proxCobranca(m))).join(', '), act:'goClube'});
  return out;
}

function pillStatus(m){
  if(m.status==='saiu') return '<span class="pill">saiu</span>';
  if(m.status==='aviso') return '<span class="pill warn">avisou saída</span>';
  return atrasoDe(m)>0 ? '<span class="pill bad">em atraso</span>' : '<span class="pill good">ativo</span>';
}

let clubeFiltro = 'ativos';
function renderClube(){
  const el = $('clubeList'); if(!el) return;
  const r = clubeResumo(), todos = membros();
  $('clubeSub').textContent = todos.length
    ? r.ocupadas+' de '+CLUBE.vagas+' vagas ocupadas'+(r.livres?', '+r.livres+(r.livres===1?' livre':' livres'):', lotado')+'.'
    : 'Nenhum membro ainda. As 15 vagas estão abertas.';
  $('clubePainel').innerHTML = '<div class="kpis k3">'
    + '<div class="kpi"><span>Vagas livres</span><strong class="num">'+r.livres+'</strong></div>'
    + '<div class="kpi"><span>Por mês</span><strong class="num">'+money(r.receitaRecorrenteMes)+'</strong></div>'
    + '<div class="kpi"><span>Crédito a entregar</span><strong class="num">'+money(r.creditoEmAberto)+'</strong></div></div>'
    + (r.creditoEmAberto>0 ? '<div class="note">Crédito a entregar é trabalho que você já deve: esse dinheiro entrou, mas a tattoo ainda não foi feita. Já virou tattoo: '+esc(brl.format(r.jaVirouTattoo))+'.</div>' : '');

  const chips = [{k:'ativos',n:'Ativos'},{k:'atraso',n:'Em atraso'},{k:'saiu',n:'Saíram'},{k:'todos',n:'Todos'}];
  $('clubeChips').innerHTML = chips.map(c=>'<button class="chip" data-act="clubeFiltro" data-f="'+c.k+'" aria-pressed="'+(clubeFiltro===c.k)+'">'+esc(c.n)+'</button>').join('');

  let lista = clubeFiltro==='ativos' ? todos.filter(ativoNoClube)
    : clubeFiltro==='atraso' ? todos.filter(m=>ativoNoClube(m) && atrasoDe(m)>0)
    : clubeFiltro==='saiu' ? todos.filter(m=>m.status==='saiu') : todos;
  lista = lista.sort((a,b)=>(atrasoDe(b)-atrasoDe(a)) || String(a.nome).localeCompare(String(b.nome)));

  if(!lista.length){ el.innerHTML = '<div class="empty">'+(todos.length?'Ninguém nesta lista.':'Cada pessoa que entrar no clube vira um membro aqui.<br>Toque em <b>+ Novo membro</b>.')+'</div>'; return; }

  el.innerHTML = lista.map(m=>{
    const saldo = saldoDe(m.id), atr = atrasoDe(m), venc = creditoVencendo(m.id, 60);
    const linhas = [];
    linhas.push('mês '+mesesDe(m)+' · desde '+shortDate(m.entrada));
    linhas.push('saldo '+(masked?'R$ ••••':brl.format(saldo)));
    if(m.status!=='saiu') linhas.push(atr>0 ? atr+(atr===1?' mensalidade atrasada':' mensalidades atrasadas') : 'próxima '+shortDate(proxCobranca(m)));
    const avisos = [];
    if(venc>0) avisos.push('Crédito de '+brl.format(venc)+' vence nos próximos 60 dias.');
    if(m.status==='aviso' && m.saida) avisos.push('Sai em '+shortDate(m.saida)+'. A vaga vai para o primeiro da lista de espera.');
    if(m.status==='saiu') { const lim = addMeses(m.saida||m.entrada, CLUBE.saldoAposSaidaMeses);
      if(saldo>0) avisos.push('Saiu com '+brl.format(saldo)+' de crédito. Usar até '+shortDate(lim)+'; depois disso o valor é devolvido.'); }
    if(m.status!=='saiu' && !carenciaOk(m)) avisos.push('Carência de '+CLUBE.carenciaMeses+' meses até '+shortDate(addMeses(m.entrada, CLUBE.carenciaMeses))+'.');
    const usouEsteMes = sessoesNoMes(m.id, today().slice(0,7));
    if(usouEsteMes >= CLUBE.sessoesPorMes) avisos.push('Já usou crédito neste mês (limite: '+CLUBE.sessoesPorMes+' por mês).');
    const acts = m.status==='saiu'
      ? (saldo>0?'<button class="mini solid" data-act="clubeUsar" data-id="'+esc(m.id)+'">Usar crédito</button><button class="mini" data-act="clubeDevolver" data-id="'+esc(m.id)+'">Devolver saldo</button>':'')
      : '<button class="mini solid" data-act="clubePagar" data-id="'+esc(m.id)+'">Recebi a mensalidade</button>'
        +(saldo>0?'<button class="mini" data-act="clubeUsar" data-id="'+esc(m.id)+'">Usar crédito</button>':'');
    return '<div class="card col"><div class="rowtop"><div class="main"><div class="t">'+esc(m.nome)+'</div><div class="s" style="white-space:normal">'+esc(linhas.join(' · '))+'</div></div>'+pillStatus(m)+'</div>'
      + (avisos.length?'<div class="note">'+avisos.map(esc).join('<br>')+'</div>':'')
      + '<div class="acts">'+acts+'<button class="mini" data-act="clubeExtrato" data-id="'+esc(m.id)+'">Extrato</button><button class="mini" data-act="clubeEditar" data-id="'+esc(m.id)+'">Editar</button></div></div>';
  }).join('');
}

function formMembro(m){
  const livre = vagasLivres();
  openForm({
    title: m?'Editar membro':'Novo membro do Clube 15',
    values: m ? m : {entrada:today(), mensalidade:CLUBE.mensalidade, forma:'Assinatura', status:'ativo'},
    fields:[
      m ? {hint:'Mês '+mesesDe(m)+' de participação. Saldo de crédito: '+brl.format(saldoDe(m.id))+'.'}
        : {hint: livre ? livre+(livre===1?' vaga livre de ':' vagas livres de ')+CLUBE.vagas+'.' : 'As '+CLUBE.vagas+' vagas estão ocupadas. Só entre com um novo membro se alguém saiu.'},
      {k:'nome',label:'Nome',ph:'Nome do membro'},
      {k:'telefone',label:'WhatsApp',ph:'(11) 90000-0000'},
      {k:'entrada',label:'Entrou em',type:'date'},
      {k:'mensalidade',label:'Mensalidade',type:'money',ph:'R$ 150,00'},
      {k:'forma',label:'Como paga',type:'chips',options:['Assinatura','Pix','Cartão','Dinheiro']},
      {k:'status',label:'Situação',type:'chips',options:['ativo','aviso','saiu']},
      {k:'saida',label:'Saída (se avisou ou saiu)',type:'date'},
      {k:'notas',label:'Observações',type:'textarea'}
    ],
    validate: v => !v.nome ? 'Digite o nome.' : !v.entrada ? 'Escolha a data de entrada.'
      : !(v.mensalidade>0) ? 'Digite a mensalidade.'
      : (v.status!=='ativo' && !v.saida) ? 'Escolha a data de saída.'
      : (!m && vagasLivres()<=0) ? 'As '+CLUBE.vagas+' vagas estão ocupadas. Marque alguém como "saiu" antes.' : '',
    onSave: async v => {
      const rec = Object.assign({}, m||{}, v, { id: m?m.id:newId('cm'), kind:'membro', atualizado:Date.now() });
      if(rec.status==='ativo') rec.saida = '';
      await stores.clube.save(rec);
      return m ? 'Membro salvo' : 'Membro adicionado';
    },
    onDelete: m ? async () => {
      for(const x of movsDe(m.id)) await stores.clube.remove(x.id);
      await stores.clube.remove(m.id);
    } : null
  });
}

function formPagar(m){
  const ref = proxCobranca(m), atr = atrasoDe(m);
  openForm({
    title:'Mensalidade de '+firstName(m.nome),
    values:{ valor: +m.mensalidade||CLUBE.mensalidade, data: today(), forma: m.forma||'Assinatura' },
    saveLabel:'Registrar',
    fields:[
      {hint: (atr>0 ? atr+(atr===1?' mensalidade atrasada. ':' mensalidades atrasadas. ') : '')+'Referente a '+mesRef(ref)+'. O valor vira crédito do membro e entra no caixa como entrada.'},
      {k:'valor',label:'Valor recebido',type:'money',ph:'R$ 150,00'},
      {k:'data',label:'Recebido em',type:'date'},
      {k:'forma',label:'Como recebeu',type:'chips',options:['Assinatura','Pix','Cartão','Dinheiro']}
    ],
    validate: v => !(v.valor>0) ? 'Digite o valor.' : !v.data ? 'Escolha a data.' : '',
    onSave: async v => {
      const lanc = { id:newId('l'), kind:'in', valor:+v.valor, cliente:m.nome,
        descricao:'Clube 15 — mensalidade '+mesRef(ref), tipo:'Sessão',
        pagamento: v.forma==='Assinatura' ? 'Cartão' : v.forma,
        data:v.data, mes:v.data.slice(0,7), criado:Date.now(), clube:true };
      await stores.caixa.save(lanc); afterCaixaSave(lanc);
      await stores.clube.save({ id:newId('cp'), kind:'pg', membroId:m.id, data:v.data, valor:+v.valor, ref:ref.slice(0,7), forma:v.forma, caixaId:lanc.id });
      return 'Mensalidade registrada e lançada no caixa';
    }
  });
}

function formUsar(m){
  const saldo = saldoDe(m.id), usou = sessoesNoMes(m.id, today().slice(0,7));
  openForm({
    title:'Usar crédito de '+firstName(m.nome),
    values:{ valor:saldo, data:today() },
    saveLabel:'Abater',
    fields:[
      {hint:'Saldo hoje: '+brl.format(saldo)+'. O abatimento NÃO entra no caixa: esse dinheiro já entrou quando você recebeu as mensalidades.'
        +(usou>=CLUBE.sessoesPorMes ? ' Atenção: já usou crédito neste mês (limite combinado: '+CLUBE.sessoesPorMes+' por mês).' : '')},
      {k:'valor',label:'Quanto abater',type:'money',ph:'R$ 0,00'},
      {k:'descricao',label:'Na tattoo de',ph:'Ex.: 2ª sessão do fechamento'},
      {k:'data',label:'Data da sessão',type:'date'}
    ],
    validate: v => !(v.valor>0) ? 'Digite o valor.' : (+v.valor > saldo+0.009) ? 'O saldo é de '+brl.format(saldo)+'.' : !v.data ? 'Escolha a data.' : '',
    onSave: async v => {
      await stores.clube.save({ id:newId('cu'), kind:'uso', membroId:m.id, data:v.data, valor:+v.valor, descricao:v.descricao||'' });
      return 'Crédito abatido';
    }
  });
}

function formDevolver(m){
  const saldo = saldoDe(m.id);
  openForm({
    title:'Devolver saldo de '+firstName(m.nome),
    values:{ valor:saldo, data:today() },
    saveLabel:'Registrar devolução',
    fields:[
      {hint:'Regulamento 4.4: o saldo fica disponível por '+CLUBE.saldoAposSaidaMeses+' meses e, se não for usado, o valor é devolvido. A devolução zera o crédito e lança uma saída no caixa.'},
      {k:'valor',label:'Valor devolvido',type:'money',ph:'R$ 0,00'},
      {k:'data',label:'Devolvido em',type:'date'}
    ],
    validate: v => !(v.valor>0) ? 'Digite o valor.' : (+v.valor > saldo+0.009) ? 'O saldo é de '+brl.format(saldo)+'.' : !v.data ? 'Escolha a data.' : '',
    onSave: async v => {
      const lanc = { id:newId('l'), kind:'out', valor:+v.valor, descricao:'Clube 15 — devolução de saldo a '+m.nome,
        categoria:'Outros', data:v.data, mes:v.data.slice(0,7), criado:Date.now(), clube:true };
      await stores.caixa.save(lanc); afterCaixaSave(lanc);
      await stores.clube.save({ id:newId('cd'), kind:'dev', membroId:m.id, data:v.data, valor:+v.valor, caixaId:lanc.id });
      return 'Devolução registrada';
    }
  });
}

function openExtrato(m){
  const movs = movsDe(m.id).slice().sort((a,b)=>String(b.data).localeCompare(String(a.data)));
  const nome = { pg:'Mensalidade', uso:'Crédito usado', dev:'Devolução' };
  const li = movs.length ? movs.map(x=>'<li><b>'+esc(shortDate(x.data))+'</b> — '+esc(nome[x.kind]||x.kind)+' '
      +esc(brl.format(+x.valor||0))+(x.descricao?' · '+esc(x.descricao):'')+'</li>').join('')
    : '<li>Nada registrado ainda.</li>';
  const lotes = lotesDe(m.id);
  const val = lotes.length ? '<p class="hint">Validade do crédito: '+lotes.map(l=>esc(brl.format(l.restante))+' até '+esc(shortDate(l.vence))).join(' · ')+'</p>' : '';
  openForm({ title:'Extrato de '+firstName(m.nome), noSave:true, noFocus:true, values:{}, fields:[
    {hint:'Pago: '+brl.format(pagoTotal(m.id))+' · Usado: '+brl.format(usadoTotal(m.id))+' · Saldo: '+brl.format(saldoDe(m.id))},
    {html:'<ul class="hist-l">'+li+'</ul>'+val}
  ]});
}

function clubeAct(act, b, id){
  const m = () => membros().find(x=>x.id===id);
  switch(act){
    case 'goClube': setTab('clube'); return true;
    case 'clubeFiltro': clubeFiltro = b.dataset.f; renderClube(); return true;
    case 'addMembro': if(tab!=='clube') setTab('clube'); formMembro(); return true;
    case 'clubeEditar': { const x=m(); if(x) formMembro(x); return true; }
    case 'clubePagar': { const x=m(); if(x) formPagar(x); return true; }
    case 'clubeUsar': { const x=m(); if(x) formUsar(x); return true; }
    case 'clubeDevolver': { const x=m(); if(x) formDevolver(x); return true; }
    case 'clubeExtrato': { const x=m(); if(x) openExtrato(x); return true; }
  }
  return false;
}
