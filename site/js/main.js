/* =====================================================================
   ANDRE TATTOO — interações
   Sem bibliotecas. Sem JS o conteúdo continua inteiro e legível.
   ===================================================================== */
(function(){
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* entrada suave: só marca como "pre" o que ainda está abaixo da tela */
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target);} });
    },{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){
      if(el.getBoundingClientRect().top > innerHeight){ el.classList.add('pre'); io.observe(el); }
    });
  }

  /* linha da agulha */
  var svg = document.getElementById('needle'), track = svg.querySelector('.track'), ink = svg.querySelector('.ink'),
      tip = svg.querySelector('.tip'), ring = svg.querySelector('.tip-ring'), len = 0;
  function build(){
    var W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox','0 0 '+W+' '+H);
    var mobile = W < 900, edgeL = mobile ? 8 : Math.max(18, (W-1180)/2 - 26), edgeR = W - edgeL;
    var ids = ['trabalhos','sobre','agendar','estudio','fim'];
    var y0 = document.querySelector('.hero').offsetTop + 40;
    var d = 'M ' + edgeR + ' ' + y0;
    var side = 1, prevY = y0;
    ids.forEach(function(id){
      var el = document.getElementById(id); if(!el) return;
      var top = el.offsetTop, x = side ? edgeL : edgeR;
      var midY = (prevY + top) / 2;
      d += ' C ' + (side?edgeR:edgeL) + ' ' + midY + ', ' + x + ' ' + midY + ', ' + x + ' ' + (top+60);
      d += ' L ' + x + ' ' + (top + el.offsetHeight*0.6);
      prevY = top + el.offsetHeight*0.6; side = 1 - side;
    });
    var fim = document.getElementById('fim');
    var endY = fim.offsetTop + fim.offsetHeight - 70, cx = W/2;
    d += ' C ' + (side?edgeR:edgeL) + ' ' + (endY-120) + ', ' + cx + ' ' + (endY-140) + ', ' + cx + ' ' + endY;
    track.setAttribute('d', d); ink.setAttribute('d', d);
    len = ink.getTotalLength();
    ink.style.strokeDasharray = len; draw();
  }
  function draw(){
    if(!len) return;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = reduce ? 1 : Math.min(1, Math.max(0, (scrollY + innerHeight*0.15) / Math.max(1,max)));
    var l = len * (0.04 + 0.96*p);
    ink.style.strokeDashoffset = len - l;
    var pt = ink.getPointAtLength(l);
    tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y);
    ring.setAttribute('cx', pt.x); ring.setAttribute('cy', pt.y);
  }
  var nav = document.getElementById('nav'), fl = document.getElementById('float'), ticking = false;
  addEventListener('scroll', function(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){
      draw(); nav.classList.toggle('scrolled', scrollY > 10);
      fl.classList.toggle('on', scrollY > innerHeight*0.8 && (innerHeight + scrollY) < document.documentElement.scrollHeight - 400);
      ticking = false;
    });
  }, {passive:true});
  var rt; addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(build, 150); });
  addEventListener('load', build);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  [].forEach.call(document.images, function(im){ if(!im.complete) im.addEventListener('load', function(){ clearTimeout(rt); rt = setTimeout(build, 120); }); });
  build();

  /* galeria ampliada */
  var works = [].slice.call(document.querySelectorAll('.work')), lb = document.getElementById('lb'),
      lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lbcap'), cur = 0, last = null;
  function show(i){
    cur = (i + works.length) % works.length;
    var im = works[cur].querySelector('img');
    lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = works[cur].dataset.cap;
  }
  works.forEach(function(w,i){ w.addEventListener('click', function(){ last = w; show(i); lb.hidden = false; document.body.style.overflow='hidden'; lb.querySelector('.x').focus(); }); });
  function close(){ lb.hidden = true; document.body.style.overflow=''; if(last) last.focus(); }
  lb.querySelector('.x').addEventListener('click', close);
  lb.querySelector('.prev').addEventListener('click', function(e){ e.stopPropagation(); show(cur-1); });
  lb.querySelector('.next').addEventListener('click', function(e){ e.stopPropagation(); show(cur+1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
  addEventListener('keydown', function(e){
    if(lb.hidden) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight') show(cur+1);
    if(e.key === 'ArrowLeft') show(cur-1);
  });
  var sx = null;
  lb.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', function(e){ if(sx === null) return; var dx = e.changedTouches[0].clientX - sx; if(Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
})();
