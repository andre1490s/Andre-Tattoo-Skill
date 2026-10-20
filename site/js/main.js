/* =====================================================================
   ANDRE TATTOO — interações
   Sem bibliotecas. O conteúdo que importa sai de js/dados.js.
   ===================================================================== */
(function(){
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = window.DADOS || {};
  var $ = function(s){ return document.querySelector(s); };

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ---------------------------------------------------------------
     1. CONTATO — um número só, vindo do dados.js
  --------------------------------------------------------------- */
  (function contato(){
    var num = String(D.whatsapp || '').replace(/\D/g,'');
    if(num){
      var wa = 'https://wa.me/' + num + '?text=' + encodeURIComponent(D.mensagem || '');
      [].forEach.call(document.querySelectorAll('a[href*="wa.me"]'), function(a){ a.href = wa; });
    }
    if(D.instagram){
      var ig = 'https://www.instagram.com/' + D.instagram + '/';
      [].forEach.call(document.querySelectorAll('a[href*="instagram.com"]'), function(a){
        a.href = ig;
        if(/^@/.test(a.textContent.trim())) a.textContent = '@' + D.instagram;
      });
    }
  })();

  /* ---------------------------------------------------------------
     2. GALERIA — montada a partir de DADOS.trabalhos
     A primeira peça da lista é a grande; as outras seguem o ritmo da grade.
  --------------------------------------------------------------- */
  (function galeria(){
    var box = $('#gallery'); if(!box) return;
    var lista = D.trabalhos || [];
    if(!lista.length) return;
    box.innerHTML = lista.map(function(o, i){
      return '<button class="work reveal' + (i ? '' : ' big') + '" data-cap="' + esc(o.cap) + '">' +
        '<img src="img/' + esc(o.img) + '.webp" alt="' + esc(o.alt) + '"' +
        (i ? ' loading="lazy"' : '') + ' decoding="async">' +
        '<span class="cap">' + esc((o.cap || '').split('·').pop().trim()) + '</span></button>';
    }).join('');
  })();

  /* ---------------------------------------------------------------
     3. AVALIAÇÕES — nota sempre; cards só com texto real de cliente
  --------------------------------------------------------------- */
  (function avaliacoes(){
    var g = D.google || {}, sec = $('#avaliacoes'); if(!sec) return;
    var nota = $('#revNota'); if(nota && g.nota) nota.textContent = g.nota;
    var total = $('#revTotal');
    if(total && g.total) total.textContent = ' · ' + g.total + ' avaliações';
    var link = $('#revLink');
    if(link && g.url){ link.href = g.url; link.hidden = false; }
    var lista = $('#revList'), itens = g.avaliacoes || [];
    if(!itens.length) sec.classList.add('sem-cards');
    if(lista && itens.length){
      lista.innerHTML = itens.map(function(a){
        return '<blockquote class="rev__card reveal">' +
          '<div class="stars" aria-hidden="true">★★★★★</div>' +
          '<p>' + esc(a.texto) + '</p>' +
          '<cite>' + esc(a.nome) + (a.peca ? '<span>' + esc(a.peca) + '</span>' : '') + '</cite>' +
          '</blockquote>';
      }).join('');
    }
  })();

  /* ---------------------------------------------------------------
     4. ENTRADA SUAVE — só marca o que ainda está abaixo da tela
  --------------------------------------------------------------- */
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target);} });
    },{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){
      if(el.getBoundingClientRect().top > innerHeight){ el.classList.add('pre'); io.observe(el); }
    });
  }

  /* ---------------------------------------------------------------
     5. LINHA DA AGULHA
  --------------------------------------------------------------- */
  var svg = document.getElementById('needle'), track = svg.querySelector('.track'), ink = svg.querySelector('.ink'),
      tip = svg.querySelector('.tip'), ring = svg.querySelector('.tip-ring'), len = 0;
  function build(){
    var W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox','0 0 '+W+' '+H);
    var mobile = W < 900, edgeL = mobile ? 8 : Math.max(18, (W-1180)/2 - 26), edgeR = W - edgeL;
    var ids = ['trabalhos','sobre','avaliacoes','agendar','estudio','fim'];
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

  /* ---------------------------------------------------------------
     6. GALERIA AMPLIADA
  --------------------------------------------------------------- */
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
