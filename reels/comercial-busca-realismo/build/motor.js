/* Motor deterministico. window.seek(t) desenha o quadro do instante t. 25,0 s */
(() => {
const DUR=25.0;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const lerp=(a,b,p)=>a+(b-a)*p;
const E={lin:x=>x,outExpo:x=>x>=1?1:1-Math.pow(2,-10*x),outQuint:x=>1-Math.pow(1-x,5),
  inOutCubic:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,outCubic:x=>1-Math.pow(1-x,3),
  outBack:x=>1+2.2*Math.pow(x-1,3)+1.4*Math.pow(x-1,2),inCubic:x=>x*x*x};
let _s=1;const srnd=n=>{_s=n},rnd=()=>{_s=(_s*1664525+1013904223)%4294967296;return _s/4294967296};

/* ---------- conteudo ---------- */
const QP='tatuagem realismo preto e cinza sp';
const QI='andretatuadoor';
const COLA=[['cigana-braco',300],['lirio-costas',232],['retrato-oculos',286],['raposa-perna',254],['retrato-bone',300],['fada-fineline',240]];
const COLB=[['retrato-bone',244],['nossa-senhora',300],['fada-fineline',222],['lirio-perna',290],['vaso-stencil',260],['cigana-braco',300]];
const SUGG=[['tatuagem realismo ','preto e cinza'],['tatuagem realismo ','braço fechado'],['tatuador realismo ','são paulo']];

const mas=(id,arr)=>{const c=$(id);arr.forEach(([f,h])=>{const d=document.createElement('div');
  d.className='p';d.style.height=h+'px';d.innerHTML=`<img src="../assets/cards/${f}.jpg" alt="">`;c.appendChild(d);});};
mas('#colA',COLA); mas('#colB',COLB);
const PINS=$$('#pmasIn .p');
$('#psugg').innerHTML=SUGG.map(([a,b])=>`<div><span class="mag"></span><span>${a}<b>${b}</b></span></div>`).join('');
const SUGGS=$$('#psugg div');

/* orbita de pins que descolam da tela */
const OF=['retrato-oculos','cigana-braco','retrato-bone','nossa-senhora','raposa-perna','lirio-costas','fada-fineline','lirio-perna','vaso-stencil','retrato-bone'];
const orb=$('#orbit'), OC=[]; srnd(11);
OF.forEach((f,i)=>{const d=document.createElement('div');d.className='ocard';
  d.innerHTML=`<img src="../assets/cards/${f}.jpg" alt="">`;orb.appendChild(d);
  OC.push({el:d,a:i*0.6283+rnd()*.35,r:490+rnd()*230,z:-180+(i%4)*210,yo:(rnd()-.5)*460,rot:(rnd()-.5)*30,sp:.5+rnd()*.5});});

const dust=$('#dust'),PTS=[];srnd(23);
for(let i=0;i<50;i++){const p=document.createElement('div');p.className='pt';dust.appendChild(p);
  PTS.push({el:p,x:rnd()*1080,y:rnd()*1920,r:1.2+rnd()*3,sp:.1+rnd()*.5,ph:rnd()*6.28,a:.05+rnd()*.18,dx:(rnd()-.5)*14});}
(()=>{const c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');
 const d=x.createImageData(200,200);srnd(99);
 for(let i=0;i<d.data.length;i+=4){const v=rnd()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}
 x.putImageData(d,0,0);$('#grain').style.backgroundImage=`url(${c.toDataURL()})`;})();

/* ---------- camera ---------- */
const CLOSE=1.58, WIDE=.95;
function camera(t){
  // perto -> recuo (9.8-11.3) -> perto (12.6-13.9) -> saida (21.2-22.4)
  const back=E.inOutCubic(seg(t,9.80,11.30));
  const inn =E.inOutCubic(seg(t,12.55,13.90));
  const out =E.inOutCubic(seg(t,21.20,22.50));
  let s=lerp(CLOSE,WIDE,back); s=lerp(s,CLOSE,inn); s=lerp(s,.52,out);
  let y=lerp(0,-96,back); y=lerp(y,0,inn); y=lerp(y,-150,out);
  let ry=lerp(0,-13,back); ry=lerp(ry,0,inn); ry=lerp(ry,-18,out);
  let rx=lerp(0,4.5,back); rx=lerp(rx,0,inn); rx=lerp(rx,7,out);
  const drift=Math.sin(t*.55)*(1.0*back*(1-inn)+1.4*out);
  return {s,y,ry:ry+drift,rx,back,inn,out};
}

/* ---------- toque ---------- */
function tap(t,x,y,t0,dur){
  const p=seg(t,t0,t0+dur);
  if(p<=0||p>=1) return null;
  return {x,y,o:(p<.3? p/.3 : 1-(p-.3)/.7), s:lerp(1,.78,E.outCubic(clamp(p/.35))), rp:p, ro:Math.max(0,1-p*1.6), rs:lerp(.7,2.9,E.outCubic(p))};
}

window.seek=function(t){
  t=clamp(t,0,DUR);
  const C=camera(t);

  /* ambiente */
  $('#g1').style.transform=`translate(${-20+Math.sin(t*.26)*120}px,${240+Math.cos(t*.2)*150}px)`;
  $('#g2').style.transform=`translate(${420+Math.cos(t*.32+1)*110}px,${lerp(1200,1460,seg(t,19,23))+Math.sin(t*.24+2)*90}px)`;
  $('#g3').style.transform=`translate(${-80+Math.sin(t*.18+3)*90}px,${700+Math.cos(t*.16)*110}px)`;
  $('#amb').style.opacity=(lerp(.5,1,seg(t,0,1.6))*(1-.15*seg(t,21.4,23))).toFixed(3);
  $('#g2').style.opacity=clamp(.18+.5*seg(t,15.3,16.6)-.2*seg(t,21,22)+.6*seg(t,22.4,23.4)).toFixed(3);
  // luz que a tela joga no ambiente (clara no Pinterest, some no escuro)
  $('#spill').style.opacity=(clamp(seg(t,.4,1.4)*(1-seg(t,12.1,12.9))*(.34+.3*C.back))+ .10*seg(t,12.9,13.9)).toFixed(3);
  PTS.forEach(p=>{const y=(p.y-t*p.sp*52)%1920,yy=y<0?y+1920:y;
    p.el.style.cssText=`width:${p.r}px;height:${p.r}px;left:${(p.x+Math.sin(t*.4+p.ph)*p.dx)}px;top:${yy}px;opacity:${(p.a*(.4+.6*Math.sin(t*1.1+p.ph)**2)).toFixed(3)};filter:blur(${p.r>3?1.4:.5}px)`;});

  /* rig */
  const rigBlur = lerp(0,13,E.inCubic(seg(t,21.6,22.6)));
  $('#rig').style.transform=`translateY(${C.y.toFixed(1)}px) scale(${C.s.toFixed(4)})`;
  $('#phone').style.transform=`rotateY(${C.ry.toFixed(2)}deg) rotateX(${C.rx.toFixed(2)}deg)`;
  $('#rig').style.filter=`blur(${rigBlur.toFixed(2)}px)`;
  $('#rig').style.opacity=(1-seg(t,21.9,22.9)).toFixed(3);
  $('#sheen').style.setProperty('--psweep',`${lerp(-50,210,E.inOutCubic(seg(t,9.9,11.6)))}%`);
  $('#phone').style.boxShadow=`0 70px 160px rgba(0,0,0,.88),0 0 0 1px rgba(255,255,255,.09),0 0 ${(90*C.back*(1-C.inn)).toFixed(0)}px rgba(255,255,255,${(.10*C.back*(1-C.inn)).toFixed(3)})`;

  /* ================= PINTEREST ================= */
  const nP=Math.floor(E.lin(seg(t,.55,3.20))*QP.length);
  const showCaretP = t<3.35 && (t<3.0 || Math.floor(t*2.2)%2===0);
  $('#pq').innerHTML = (nP? QP.slice(0,nP) : '<span style="color:#767676">Buscar</span>') + (showCaretP?'<span id="pcaret"></span>':'');
  const sgIn=E.outCubic(seg(t,1.55,2.05)), sgOut=seg(t,3.30,3.55);
  $('#psugg').style.opacity=(sgIn*(1-sgOut)).toFixed(3);
  SUGGS.forEach((d,i)=>{const p=E.outCubic(seg(t,1.55+i*.13,2.05+i*.13));
    d.style.opacity=p.toFixed(2);d.style.transform=`translateY(${lerp(12,0,p)}px)`;
    d.style.background = (i===0 && t>3.05 && t<3.42) ? '#F2F2F2':'transparent';});
  const ld=seg(t,3.42,4.18);
  $('#pload').style.opacity=(ld>0&&ld<1?1:0).toFixed(2);
  $('#pload').style.transform=`translateX(-50%) rotate(${t*720}deg)`;
  // mosaico
  PINS.forEach((p,i)=>{const pp = t<3.42 ? 1 : E.outCubic(seg(t,4.10+i*.055,4.70+i*.055));
    p.style.opacity=pp.toFixed(3);p.style.transform=`translateY(${lerp(34,0,pp)}px) scale(${lerp(.94,1,pp)})`;});
  // feed de abertura rola de leve; depois da busca, rola de verdade
  const scroll = t<3.8 ? lerp(168,312,E.inOutCubic(seg(t,0,3.3)))
                       : lerp(0,430,E.inOutCubic(seg(t,4.95,7.45)));
  $('#pmasIn').style.transform=`translateY(${-scroll.toFixed(1)}px)`;
  $('#pmas').style.opacity=(1-seg(t,3.42,3.70)+seg(t,4.05,4.30)).toFixed(3);
  $('#pmas').style.filter=`brightness(${lerp(1,.46,sgIn*(1-sgOut))})`;
  // detalhe do pin
  const pinOff=1-seg(t,12.28,12.58);
  const dIn=E.outExpo(seg(t,7.95,8.75));
  $('#pdet').style.opacity=((dIn>0?1:0)*pinOff).toFixed(3);
  $('#pin').style.opacity=pinOff.toFixed(3);
  $('#pdet').style.transform=`translateY(${lerp(100,0,dIn).toFixed(2)}%)`;
  $('#pin').style.filter=`brightness(${lerp(1,.55,dIn)})`;
  $('#pin').style.transform=`scale(${lerp(1,.97,dIn)})`;

  /* ================= TROCA DE APP ================= */
  const dk=$('#dock'), dkIn=E.outBack(seg(t,10.55,11.45)), dkOut=seg(t,12.35,12.75);
  dk.style.opacity=(clamp(seg(t,10.55,11.05))*(1-dkOut)).toFixed(3);
  dk.style.transform=`translateX(-50%) translateY(${lerp(70,0,clamp(dkIn))+lerp(0,40,dkOut)}px) scale(${lerp(.86,1,clamp(dkIn))})`;
  const dg=seg(t,11.95,12.35);
  $('#dockglow').style.opacity=(dg>0&&dg<1?(1-dg):0).toFixed(3);
  $$('.ic')[2].style.transform=`scale(${1+.16*Math.sin(Math.PI*clamp(seg(t,11.95,12.4)))})`;
  const fl=$('#flood'), flIn=seg(t,12.12,12.52), flOut=seg(t,12.72,13.25);
  fl.style.opacity=(flIn*(1-flOut)).toFixed(3);
  fl.style.transform=`scale(${lerp(.05,1.6,E.outExpo(flIn))})`;
  fl.style.borderRadius=`${lerp(50,0,E.outExpo(flIn))}%`;
  fl.style.filter=`blur(${lerp(0,26,flOut).toFixed(1)}px)`;
  // pins descolam da tela e orbitam
  const oIn=E.outExpo(seg(t,9.85,11.15)), oOut=seg(t,11.9,12.5);
  OC.forEach((c,i)=>{
    const a=c.a+t*.17*c.sp, r=lerp(50,c.r,oIn), z=lerp(60,c.z,oIn);
    c.el.style.opacity=(oIn*(1-oOut)).toFixed(3);
    c.el.style.transform=`translate3d(${(Math.cos(a)*r).toFixed(1)}px,${(Math.sin(a)*r*.62+c.yo*oIn*.35).toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(Math.sin(a)*18).toFixed(1)}deg) rotateZ(${(c.rot*oIn).toFixed(1)}deg) scale(${lerp(.3,1,oIn).toFixed(3)})`;
    c.el.style.filter=`blur(${(lerp(6,0,oIn)+lerp(0,8,oOut)).toFixed(1)}px) brightness(${lerp(.6,1.05,oIn).toFixed(2)})`;});

  /* ================= INSTAGRAM ================= */
  $('#ig').style.opacity=clamp(seg(t,12.30,12.60)).toFixed(3);
  const nI=Math.floor(E.lin(seg(t,13.25,14.45))*QI.length);
  const showCaretI = t>13.0 && t<14.75 && (t<14.45 || Math.floor(t*2.4)%2===0);
  $('#iq').innerHTML=(nI? QI.slice(0,nI) : '<span style="color:#8E8E93">Pesquisar</span>')+(showCaretI?'<span id="icaret"></span>':'');
  const rIn=E.outCubic(seg(t,14.45,14.90));
  $('#ires').style.opacity=(rIn*(1-seg(t,15.45,15.75))).toFixed(3);
  $('#ires .row').style.transform=`translateY(${lerp(14,0,rIn)}px)`;
  $('#ires .row').style.background=(t>15.05&&t<15.5)?'#1C1C1E':'transparent';
  // perfil
  const prIn=E.outExpo(seg(t,15.45,16.15));
  $('#iprof').style.opacity=prIn.toFixed(3);
  $('#iprofIn').style.transform=`translateY(${(lerp(46,0,prIn)-lerp(0,130,E.inOutCubic(seg(t,16.5,18.9)))).toFixed(1)}px)`;
  const lkHot=seg(t,19.25,19.55)*(1-seg(t,20.6,21.0));
  $('#ilink').style.background=lkHot>.02?`rgba(132,160,247,${(lkHot*.20).toFixed(3)})`:'transparent';
  $('#ilink').style.textShadow=lkHot>.02?`0 0 ${(16*lkHot).toFixed(0)}px rgba(132,160,247,${(lkHot*.8).toFixed(2)})`:'none';
  const shIn=E.outExpo(seg(t,19.70,20.45));
  $('#isheet').style.transform=`translateY(${lerp(100,0,shIn).toFixed(2)}%)`;
  $('#iprof').style.filter=`brightness(${lerp(1,.62,shIn)})`;

  /* ================= TOQUES ================= */
  const T = tap(t,305,579,7.52,.48)        // pin no mosaico
         || tap(t,540,1683,11.92,.52)      // icone do Instagram
         || tap(t,300,225,15.05,.45)       // resultado da busca
         || tap(t,290,409,19.22,.45);      // link da bio
  const tp=$('#tap'), rp=$('#ripple');
  if(T){ tp.style.cssText+=''; tp.style.left=T.x+'px';tp.style.top=T.y+'px';tp.style.opacity=(T.o*.95).toFixed(3);
         tp.style.transform=`scale(${T.s.toFixed(3)})`;
         rp.style.left=T.x+'px';rp.style.top=T.y+'px';rp.style.opacity=(T.ro*.6).toFixed(3);
         rp.style.transform=`scale(${T.rs.toFixed(3)})`; }
  else { tp.style.opacity=0; rp.style.opacity=0; }

  /* ================= MARCA ================= */
  const sb=$('#sigbg');
  sb.style.opacity=(E.outCubic(seg(t,21.5,22.7))*.30*(1-seg(t,24.3,25.0))).toFixed(3);
  sb.style.transform=`scale(${lerp(1.18,1,E.outCubic(seg(t,21.5,24.4))).toFixed(3)}) rotate(${(t*.5).toFixed(2)}deg)`;
  const sIn=E.outExpo(seg(t,21.70,22.60));
  const sg=$('#sig');
  sg.style.opacity=sIn.toFixed(3);
  sg.style.transform=`translateY(${lerp(22,0,sIn)}px)`;
  sg.querySelector('.w').style.letterSpacing=`${lerp(.60,.40,sIn)}em`;
  sg.querySelector('.w').style.textIndent=`${lerp(.60,.40,sIn)}em`;
  sg.querySelector('.w').style.filter=`blur(${lerp(10,0,sIn).toFixed(2)}px)`;
  sg.querySelector('.r').style.width=`${(E.outExpo(seg(t,22.15,23.1))*470).toFixed(0)}px`;
  sg.querySelector('.s').style.opacity=E.outCubic(seg(t,22.4,23.1)).toFixed(3);
  const cIn=E.outExpo(seg(t,22.65,23.45)), ct=$('#cta');
  ct.style.opacity=cIn.toFixed(3);
  ct.style.transform=`translateY(${lerp(26,0,cIn)}px)`;
  ct.style.filter=`blur(${lerp(11,0,cIn).toFixed(2)}px)`;
  const hIn=clamp(E.outBack(seg(t,23.30,24.05))), hd=$('#handle');
  hd.style.opacity=clamp(seg(t,23.30,23.80)).toFixed(3);
  hd.style.transform=`translateX(-50%) translateY(${lerp(24,0,hIn)}px) scale(${lerp(.94,1,hIn)})`;
  hd.querySelector('.dot').style.boxShadow=`0 0 ${(14+10*Math.sin(t*4)**2).toFixed(0)}px var(--green)`;

  /* acabamento */
  $('#flash').style.opacity=Math.max(
    seg(t,3.40,3.45)*(1-seg(t,3.45,3.70))*.16,
    seg(t,12.42,12.48)*(1-seg(t,12.48,12.80))*.20).toFixed(3);
  $('#fade').style.opacity=Math.max(1-seg(t,0,.45),seg(t,24.42,25.0)).toFixed(3);
  srnd(Math.round(t*1000)+13);
  $('#grain').style.backgroundPosition=`${(rnd()*200)|0}px ${(rnd()*200)|0}px`;
};
window.DUR=DUR; window.seek(0);
})();
