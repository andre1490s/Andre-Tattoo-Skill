/* Motor deterministico. window.seek(t) desenha o quadro do instante t. 25,0 s */
(() => {
const DUR=24.0;
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
// pulso de zoom: estouro curto ancorado num impacto sonoro
function punch(t,t0,amt,up=.09,dn=.20){
  const a=seg(t,t0,t0+up), b=seg(t,t0+up,t0+up+dn);
  return amt*(E.outCubic(a)-E.outCubic(b));
}
function camera(t){
  const back=E.inOutCubic(seg(t,7.74,9.10));   // recuo + whip
  const inn =E.inOutCubic(seg(t,10.98,11.76)); // volta para perto
  const out =E.inOutCubic(seg(t,20.62,21.42)); // saida
  let s=lerp(CLOSE,WIDE,back); s=lerp(s,CLOSE,inn); s=lerp(s,.42,out);
  s *= 1 + punch(t,2.42,.10) + punch(t,5.74,.09) + punch(t,10.46,.24,.08,.24) + punch(t,13.98,.07);
  let y=lerp(0,-96,back); y=lerp(y,0,inn); y=lerp(y,-190,out);
  let ry=lerp(0,-13,back); ry=lerp(ry,0,inn); ry=lerp(ry,-20,out);
  let rx=lerp(0,4.5,back); rx=lerp(rx,0,inn); rx=lerp(rx,8,out);
  // whip pan: chicote para a direita e volta na entrada do Instagram
  const w1=seg(t,8.56,8.88), w2=seg(t,11.00,11.30);
  const whip = (w1>0&&w1<1? Math.sin(Math.PI*w1)*720 : 0) - (w2>0&&w2<1? Math.sin(Math.PI*w2)*660 : 0);
  const whipBlur = Math.abs(whip)/8;
  const drift=Math.sin(t*.55)*(1.0*back*(1-inn)+1.4*out);
  return {s,y,ry:ry+drift,rx,back,inn,out,whip,whipBlur};
}

/* ---------- toque ---------- */
function tap(t,x,y,t0,dur){
  const p=seg(t,t0,t0+dur);
  if(p<=0||p>=1) return null;
  return {x,y,o:(p<.3? p/.3 : 1-(p-.3)/.7), s:lerp(1,.78,E.outCubic(clamp(p/.35))),
          ro:Math.max(0,1-p*1.6), rs:lerp(.7,2.9,E.outCubic(p))};
}

const whipb=document.getElementById('whipb');

window.seek=function(t){
  t=clamp(t,0,DUR);
  const C=camera(t);

  /* ===== ambiente ===== */
  $('#g1').style.transform=`translate(${-20+Math.sin(t*.26)*120}px,${240+Math.cos(t*.2)*150}px)`;
  $('#g2').style.transform=`translate(${420+Math.cos(t*.32+1)*110}px,${lerp(1200,1460,seg(t,18,22))+Math.sin(t*.24+2)*90}px)`;
  $('#g3').style.transform=`translate(${-80+Math.sin(t*.18+3)*90}px,${700+Math.cos(t*.16)*110}px)`;
  $('#amb').style.opacity=(lerp(.5,1,seg(t,0,1.4))*(1-.15*seg(t,20.8,22.4))).toFixed(3);
  $('#g2').style.opacity=clamp(.18+.5*seg(t,14,15.2)-.2*seg(t,20.4,21.4)+.65*seg(t,21.4,22.4)).toFixed(3);
  $('#spill').style.opacity=(clamp(seg(t,.3,1.1)*(1-seg(t,10.3,10.9))*(.34+.3*C.back))+.10*seg(t,11.4,12.4)).toFixed(3);
  PTS.forEach(p=>{const y=(p.y-t*p.sp*52)%1920,yy=y<0?y+1920:y;
    p.el.style.cssText=`width:${p.r}px;height:${p.r}px;left:${(p.x+Math.sin(t*.4+p.ph)*p.dx)}px;top:${yy}px;opacity:${(p.a*(.4+.6*Math.sin(t*1.1+p.ph)**2)).toFixed(3)};filter:blur(${p.r>3?1.4:.5}px)`;});

  /* ===== rig ===== */
  whipb.setAttribute('stdDeviation', `${C.whipBlur.toFixed(1)} 0`);
  const rigBlur = lerp(0,15,E.inCubic(seg(t,20.72,21.42)));
  $('#rig').style.transform=`translate(${C.whip.toFixed(1)}px,${C.y.toFixed(1)}px) scale(${C.s.toFixed(4)})`;
  $('#phone').style.transform=`rotateY(${C.ry.toFixed(2)}deg) rotateX(${C.rx.toFixed(2)}deg)`;
  $('#rig').style.filter = (C.whipBlur>0.4? `url(#whipx) ` : '') + `blur(${rigBlur.toFixed(2)}px)`;
  $('#rig').style.opacity=(1-seg(t,20.88,21.46)).toFixed(3);
  $('#sheen').style.setProperty('--psweep',`${lerp(-50,210,E.inOutCubic(seg(t,7.8,9.4)))}%`);
  $('#phone').style.boxShadow=`0 70px 160px rgba(0,0,0,.88),0 0 0 1px rgba(255,255,255,.09),0 0 ${(90*C.back*(1-C.inn)).toFixed(0)}px rgba(255,255,255,${(.10*C.back*(1-C.inn)).toFixed(3)})`;

  /* ===== PINTEREST ===== */
  const nP=Math.floor(E.lin(seg(t,.35,2.10))*QP.length);
  const showCaretP = t<2.46 && (t<2.1 || Math.floor(t*3)%2===0);
  $('#pq').innerHTML = (nP? QP.slice(0,nP) : '<span style="color:#767676">Buscar</span>') + (showCaretP?'<span id="pcaret"></span>':'');
  const sgIn=E.outCubic(seg(t,1.00,1.40)), sgOut=seg(t,2.38,2.56);
  $('#psugg').style.opacity=(sgIn*(1-sgOut)).toFixed(3);
  SUGGS.forEach((d,i)=>{const p=E.outCubic(seg(t,1.00+i*.09,1.40+i*.09));
    d.style.opacity=p.toFixed(2);d.style.transform=`translateY(${lerp(12,0,p)}px)`;
    d.style.background=(i===0&&t>2.22&&t<2.52)?'#F2F2F2':'transparent';});
  const ld=seg(t,2.50,2.98);
  $('#pload').style.opacity=(ld>0&&ld<1?1:0).toFixed(2);
  $('#pload').style.transform=`translateX(-50%) rotate(${t*900}deg)`;
  PINS.forEach((p,i)=>{const pp = t<2.48 ? 1 : E.outCubic(seg(t,2.92+i*.035,3.34+i*.035));
    p.style.opacity=pp.toFixed(3);p.style.transform=`translateY(${lerp(40,0,pp)}px) scale(${lerp(.92,1,pp)})`;});
  const scroll = t<2.8 ? lerp(168,312,E.inOutCubic(seg(t,0,2.3)))
                       : lerp(0,430,E.inOutCubic(seg(t,3.40,5.66)));
  $('#pmasIn').style.transform=`translateY(${-scroll.toFixed(1)}px)`;
  $('#pmas').style.opacity=(1-seg(t,2.48,2.70)+seg(t,2.88,3.06)).toFixed(3);
  $('#pmas').style.filter=`brightness(${lerp(1,.46,sgIn*(1-sgOut))})`;
  const pinOff=1-seg(t,10.42,10.62);
  const dIn=E.outExpo(seg(t,6.08,6.56));
  $('#pdet').style.opacity=((dIn>0?1:0)*pinOff).toFixed(3);
  $('#pdet').style.transform=`translateY(${lerp(100,0,dIn).toFixed(2)}%)`;
  $('#pin').style.opacity=pinOff.toFixed(3);
  $('#pin').style.filter=`brightness(${lerp(1,.55,dIn)})`;
  $('#pin').style.transform=`scale(${lerp(1,.97,dIn)})`;

  /* ===== TROCA DE APP ===== */
  const dk=$('#dock'), dkIn=E.outBack(seg(t,9.16,9.74)), dkOut=seg(t,10.50,10.84);
  dk.style.opacity=(clamp(seg(t,9.16,9.58))*(1-dkOut)).toFixed(3);
  dk.style.transform=`translateX(-50%) translateY(${lerp(80,0,clamp(dkIn))+lerp(0,50,dkOut)}px) scale(${lerp(.84,1,clamp(dkIn))})`;
  const dg=seg(t,10.14,10.50);
  $('#dockglow').style.opacity=(dg>0&&dg<1?(1-dg):0).toFixed(3);
  $$('.ic')[2].style.transform=`scale(${1+.22*Math.sin(Math.PI*clamp(seg(t,10.14,10.58)))})`;
  // estouro do Instagram em tela cheia
  const bIn=seg(t,10.36,10.62), bOut=seg(t,10.86,11.30), bst=$('#igburst');
  bst.style.opacity=(E.outExpo(bIn)*(1-E.inOutCubic(bOut))).toFixed(3);
  bst.style.transform=`scale(${lerp(.04,1.25,E.outExpo(bIn))*lerp(1,1.5,bOut)})`;
  bst.style.borderRadius=`${lerp(50,0,E.outExpo(bIn))}%`;
  bst.style.filter=`blur(${lerp(0,34,bOut).toFixed(1)}px)`;
  bst.querySelector('.gl').style.transform=`scale(${lerp(.3,1,E.outBack(clamp(seg(t,10.44,10.78))))*lerp(1,2.4,bOut)})`;
  bst.querySelector('.gl').style.opacity=(clamp(seg(t,10.44,10.62))*(1-seg(t,10.80,11.05))).toFixed(2);
  const fl=$('#flood'); fl.style.opacity=(seg(t,10.60,10.80)*(1-seg(t,11.00,11.45))).toFixed(3);
  fl.style.transform='scale(1.6)'; fl.style.borderRadius='0'; fl.style.filter=`blur(${lerp(0,26,seg(t,11.0,11.45)).toFixed(1)}px)`;
  // pins descolam e orbitam
  const oIn=E.outExpo(seg(t,7.75,9.05)), oOut=seg(t,9.85,10.45);
  OC.forEach((c,i)=>{
    const a=c.a+t*.19*c.sp, r=lerp(50,c.r,oIn), z=lerp(60,c.z,oIn);
    c.el.style.opacity=(oIn*(1-oOut)).toFixed(3);
    c.el.style.transform=`translate3d(${(Math.cos(a)*r).toFixed(1)}px,${(Math.sin(a)*r*.62+c.yo*oIn*.35).toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(Math.sin(a)*18).toFixed(1)}deg) rotateZ(${(c.rot*oIn).toFixed(1)}deg) scale(${lerp(.3,1,oIn).toFixed(3)})`;
    c.el.style.filter=`blur(${(lerp(6,0,oIn)+lerp(0,8,oOut)).toFixed(1)}px) brightness(${lerp(.6,1.05,oIn).toFixed(2)})`;});

  /* ===== INSTAGRAM ===== */
  $('#ig').style.opacity=clamp(seg(t,10.56,10.80)).toFixed(3);
  const nI=Math.floor(E.lin(seg(t,11.55,12.62))*QI.length);
  const showCaretI = t>11.35 && t<12.95 && (t<12.62 || Math.floor(t*3)%2===0);
  $('#iq').innerHTML=(nI? QI.slice(0,nI) : '<span style="color:#8E8E93">Pesquisar</span>')+(showCaretI?'<span id="icaret"></span>':'');
  const rIn=E.outCubic(seg(t,12.62,12.98));
  $('#ires').style.opacity=(rIn*(1-seg(t,13.70,13.95))).toFixed(3);
  $('#ires .row').style.transform=`translateY(${lerp(14,0,rIn)}px)`;
  $('#ires .row').style.background=(t>13.36&&t<13.76)?'#1C1C1E':'transparent';
  const prIn=E.outExpo(seg(t,13.72,14.18));
  $('#iprof').style.opacity=prIn.toFixed(3);
  $('#iprofIn').style.transform=`translateY(${(lerp(46,0,prIn)-lerp(0,130,E.inOutCubic(seg(t,14.50,16.40)))).toFixed(1)}px)`;

  /* ===== DESTAQUE DO LINK ===== */
  const spIn=E.outCubic(seg(t,16.90,17.38)), spOut=seg(t,19.00,19.42);
  const spot=$('#spot'), spA=spIn*(1-spOut);
  spot.style.opacity=spA.toFixed(3);
  spot.style.background=`radial-gradient(circle ${lerp(620,330,spIn).toFixed(0)}px at 290px 409px,transparent 0%,transparent 62%,rgba(0,0,0,.86) 100%)`;
  const rm=$('#ringmark'), rmP=E.outCubic(seg(t,17.28,17.88));
  rm.style.opacity=(clamp(seg(t,17.30,17.45))*(1-spOut)).toFixed(3);
  const el=rm.querySelector('ellipse'), L=1080;
  el.style.strokeDasharray=L; el.style.strokeDashoffset=(L*(1-rmP)).toFixed(1);
  const ar=$('#arrow'), arP=clamp(seg(t,17.80,18.10));
  ar.style.opacity=(arP*(1-spOut)).toFixed(3);
  ar.style.left='269px'; ar.style.top=`${(486+Math.sin(t*6.5)*10).toFixed(0)}px`;
  const aq=$('#aqui'); aq.style.opacity=(clamp(seg(t,17.95,18.3))*(1-spOut)).toFixed(3);
  aq.style.left='112px'; aq.style.top='548px';
  const lkHot=seg(t,17.10,17.50)*(1-spOut);
  $('#ilink').style.background=lkHot>.02?`rgba(132,160,247,${(lkHot*.22).toFixed(3)})`:'transparent';
  $('#ilink').style.textShadow=lkHot>.02?`0 0 ${(20*lkHot).toFixed(0)}px rgba(132,160,247,${(lkHot*.85).toFixed(2)})`:'none';
  $('#ilink').style.transformOrigin='left center';
  $('#ilink').style.transform=`scale(${(1+.14*lkHot).toFixed(3)})`;
  const shIn=E.outExpo(seg(t,19.42,19.92));
  $('#isheet').style.transform=`translateY(${lerp(100,0,shIn).toFixed(2)}%)`;
  $('#iprof').style.filter=`brightness(${lerp(1,.62,shIn)})`;

  /* ===== TOQUES ===== */
  const T = tap(t,305,579,5.76,.40)
         || tap(t,540,1683,10.16,.44)
         || tap(t,300,225,13.36,.40)
         || tap(t,290,409,18.52,.46);
  const tp=$('#tap'), rp=$('#ripple');
  if(T){ tp.style.left=T.x+'px';tp.style.top=T.y+'px';tp.style.opacity=(T.o*.95).toFixed(3);
         tp.style.transform=`scale(${T.s.toFixed(3)})`;
         rp.style.left=T.x+'px';rp.style.top=T.y+'px';rp.style.opacity=(T.ro*.6).toFixed(3);
         rp.style.transform=`scale(${T.rs.toFixed(3)})`; }
  else { tp.style.opacity=0; rp.style.opacity=0; }

  /* ===== MARCA FINAL ===== */
  const sb=$('#sigbg');
  sb.style.opacity=(E.outCubic(seg(t,20.8,21.9))*.28*(1-seg(t,23.4,24.0))).toFixed(3);
  sb.style.transform=`scale(${lerp(1.18,1,E.outCubic(seg(t,20.8,23.5))).toFixed(3)}) rotate(${(t*.5).toFixed(2)}deg)`;
  const lgIn=E.outBack(clamp(seg(t,20.95,21.70))), lg=$('#logo');
  lg.style.opacity=clamp(seg(t,20.95,21.30)).toFixed(3);
  lg.style.transform=`scale(${lerp(.72,1,lgIn).toFixed(3)}) rotate(${lerp(-9,0,lgIn).toFixed(2)}deg)`;
  lg.querySelector('img').style.filter=`drop-shadow(0 26px 60px rgba(0,0,0,.8)) blur(${lerp(14,0,E.outCubic(seg(t,20.95,21.55))).toFixed(2)}px)`;
  lg.querySelector('.sweep i').style.left=`${lerp(-30,112,E.inOutCubic(seg(t,21.45,22.30))).toFixed(1)}%`;
  const ha=lg.querySelector('.halo'), haP=E.outExpo(seg(t,21.40,22.20));
  ha.style.opacity=(haP*(1-haP*.45)).toFixed(3);
  ha.style.transform=`scale(${lerp(.86,1.1,haP).toFixed(3)})`;
  const wIn=E.outExpo(seg(t,21.75,22.45)), wm=$('#wm');
  wm.style.opacity=wIn.toFixed(3);
  wm.querySelector('.w').style.letterSpacing=`${lerp(.60,.40,wIn)}em`;
  wm.querySelector('.w').style.textIndent=`${lerp(.60,.40,wIn)}em`;
  wm.querySelector('.w').style.filter=`blur(${lerp(10,0,wIn).toFixed(2)}px)`;
  wm.querySelector('.r').style.width=`${(E.outExpo(seg(t,22.05,22.75))*440).toFixed(0)}px`;
  wm.querySelector('.s').style.opacity=E.outCubic(seg(t,22.25,22.85)).toFixed(3);
  const cIn=E.outExpo(seg(t,22.40,23.00)), ct=$('#cta');
  ct.style.opacity=cIn.toFixed(3);
  ct.style.transform=`translateY(${lerp(24,0,cIn)}px)`;
  ct.style.filter=`blur(${lerp(10,0,cIn).toFixed(2)}px)`;
  const hIn=clamp(E.outBack(seg(t,22.85,23.45))), hd=$('#handle');
  hd.style.opacity=clamp(seg(t,22.85,23.25)).toFixed(3);
  hd.style.transform=`translateX(-50%) translateY(${lerp(22,0,hIn)}px) scale(${lerp(.94,1,hIn)})`;
  hd.querySelector('.dot').style.boxShadow=`0 0 ${(14+10*Math.sin(t*4)**2).toFixed(0)}px var(--green)`;

  /* ===== acabamento ===== */
  $('#flash').style.opacity=Math.max(
    seg(t,2.48,2.52)*(1-seg(t,2.52,2.72))*.20,
    seg(t,5.76,5.80)*(1-seg(t,5.80,5.98))*.14,
    seg(t,10.44,10.49)*(1-seg(t,10.49,10.72))*.34,
    seg(t,20.98,21.02)*(1-seg(t,21.02,21.26))*.26).toFixed(3);
  $('#fade').style.opacity=Math.max(1-seg(t,0,.35),seg(t,23.55,24.0)).toFixed(3);
  srnd(Math.round(t*1000)+13);
  $('#grain').style.backgroundPosition=`${(rnd()*200)|0}px ${(rnd()*200)|0}px`;
};
window.DUR=DUR; window.seek(0);
})();
