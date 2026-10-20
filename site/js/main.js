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
     0. ABERTURA — a logo sai e o site entra. Nunca prende a página:
     se qualquer coisa falhar, o tempo máximo derruba a cortina.
  --------------------------------------------------------------- */
  (function abertura(){
    var raiz = document.documentElement, el = document.getElementById('intro');
    if(!el || !raiz.classList.contains('abertura')) return;
    var saiu = false;
    function sai(){
      if(saiu) return; saiu = true;
      el.classList.add('is-out');
      setTimeout(function(){
        raiz.classList.remove('abertura');
        if(el.parentNode) el.parentNode.removeChild(el);
        build();                       /* a barra de rolagem volta: refaz a linha */
      }, 820);
    }
    setTimeout(sai, 2150);   /* agulha, revelação do A, risco e brilho terminam em ~2,1s */
    addEventListener('pointerdown', sai);   /* quem tem pressa, pula */
    addEventListener('keydown', sai);
  })();

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
        /* só troca o texto em link simples: com ícone dentro, trocar apagaria o SVG */
        if(!a.firstElementChild && /^@/.test(a.textContent.trim())) a.textContent = '@' + D.instagram;
      });
    }
    if(D.tiktok){
      [].forEach.call(document.querySelectorAll('a[href*="tiktok.com"]'), function(a){
        a.href = 'https://www.tiktok.com/@' + D.tiktok;
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

    /* a grade é de 3 por fileira (fora a peça grande e as 2 ao lado dela).
       Se sobrar peça solta na última fileira, as últimas viram meia-largura
       e a fileira fecha — funciona com qualquer quantidade de fotos. */
    var pecas = [].slice.call(box.children);
    if(pecas.length >= 6){
      var resto = (pecas.length - 3) % 3;
      var quantas = resto === 1 ? 4 : (resto === 2 ? 2 : 0);
      if(quantas) pecas.slice(-quantas).forEach(function(el){ el.classList.add('meio'); });
    }
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
          '<cite>' + esc(a.nome) + (a.quando || a.peca ? '<span>' + esc(a.quando || a.peca) + '</span>' : '') + '</cite>' +
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
      rastro = svg.querySelector('.rastro'), tip = svg.querySelector('.tip'), ring = svg.querySelector('.tip-ring'), len = 0;
  /* com mouse o fio segue a mão; no toque continua a costura ligada à rolagem */
  var FIO = matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce;
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
    if(FIO || !len) return;
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
     5b. O FIO QUE SEGUE O MOUSE (só no PC)
     Guarda os últimos pontos do cursor em coordenadas da página — assim o
     fio fica preso ao conteúdo e rola junto — e liga tudo com curvas.
     A cauda se desfaz sozinha quando a mão para.
  --------------------------------------------------------------- */
  if(FIO){
    svg.classList.add('is-mouse');
    document.body.appendChild(svg);      /* vai para o fim: passa acima dos fundos */
    svg.style.opacity = 0;

    var pontos = [], mexeu = 0, rodando = false;

    function curva(ps){
      if(ps.length < 2) return '';
      var d = 'M ' + ps[0][0].toFixed(1) + ' ' + ps[0][1].toFixed(1), i;
      for(i = 1; i < ps.length - 1; i++){
        var mx = (ps[i][0] + ps[i+1][0]) / 2, my = (ps[i][1] + ps[i+1][1]) / 2;
        d += ' Q ' + ps[i][0].toFixed(1) + ' ' + ps[i][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
      }
      var f = ps[ps.length - 1];
      return d + ' L ' + f[0].toFixed(1) + ' ' + f[1].toFixed(1);
    }

    function quadro(agora){
      if(agora - mexeu > 55 && pontos.length) pontos.shift();   /* a cauda encurta */
      rastro.setAttribute('d', curva(pontos));
      var f = pontos[pontos.length - 1];
      if(f){
        tip.setAttribute('cx', f[0]); tip.setAttribute('cy', f[1]);
        ring.setAttribute('cx', f[0]); ring.setAttribute('cy', f[1]);
      }
      svg.style.opacity = pontos.length > 1 ? 1 : 0;
      if(pontos.length) requestAnimationFrame(quadro);
      else { rodando = false; rastro.setAttribute('d', ''); }
    }

    addEventListener('mousemove', function(e){
      var x = e.clientX + pageXOffset, y = e.clientY + pageYOffset;
      var u = pontos[pontos.length - 1];
      if(u && Math.abs(u[0] - x) + Math.abs(u[1] - y) < 7) return;
      pontos.push([x, y]);
      if(pontos.length > 28) pontos.shift();
      mexeu = performance.now();
      if(!rodando){ rodando = true; requestAnimationFrame(quadro); }
    }, {passive:true});
  }

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
