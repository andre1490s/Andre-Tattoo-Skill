/* =====================================================================
   ANDRE TATTOO: interações
   Sem bibliotecas. O conteúdo que importa sai de js/dados.js.
   ===================================================================== */
(function(){
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = window.DADOS || {};
  var $ = function(s){ return document.querySelector(s); };

  /* Fica vazia de propósito: se o André não tiver colado os códigos de medição
     no dados.js, todo mundo continua chamando esta função e ela não faz nada.
     Assim nenhum outro bloco precisa saber se existe medição ou não. */
  var marcaEvento = function(){};

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ---------------------------------------------------------------
     0. ABERTURA: a logo sai e o site entra. Nunca prende a página:
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
      }, 500);
    }
    /* Encurtada a pedido do Andre (10/11/2026): a cortina começa a subir em
       1,2s. O esboço fecha em ~1,1s e a arte final entra até ~1,15s. */
    setTimeout(sai, 1200);
    addEventListener('pointerdown', sai);   /* quem tem pressa, pula */
    addEventListener('keydown', sai);
  })();

  /* ---------------------------------------------------------------
     0b. VÍDEO DO TOPO: quem pediu menos movimento no sistema não recebe
     movimento nenhum. O poster continua aparecendo, então o topo nunca
     fica vazio, e o controle aparece para a pessoa dar play se quiser.
  --------------------------------------------------------------- */
  (function filme(){
    var v = document.querySelector('.tv__tela');
    if(!v || !reduce) return;
    /* quem pede menos movimento no sistema fica com o quadro de capa e o
       controle de play, em vez do vídeo rodando sozinho */
    v.removeAttribute('autoplay');
    v.setAttribute('controls', '');
    try { v.pause(); } catch(e){}
  })();

  /* ---------------------------------------------------------------
     1. CONTATO: um número só, vindo do dados.js
  --------------------------------------------------------------- */
  (function contato(){
    var num = String(D.whatsapp || '').replace(/\D/g,'');
    if(num){
      var msgs = D.mensagens || {};
      [].forEach.call(document.querySelectorAll('a[href*="wa.me"]'), function(a){
        var texto = msgs[a.getAttribute('data-wa')] || D.mensagem || '';
        a.href = 'https://wa.me/' + num + (texto ? '?text=' + encodeURIComponent(texto) : '');
      });
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
     2. GALERIA: montada a partir de DADOS.trabalhos
     Todas do mesmo tamanho, três por fileira (duas no celular). A ordem da lista é a
     ordem da galeria: as primeiras são as que mais aparecem.
  --------------------------------------------------------------- */
  (function galeria(){
    var box = $('#gallery'); if(!box) return;
    var lista = D.trabalhos || [];
    if(!lista.length) return;

    /* O build.py ja gravou a galeria no index.html, para o Google e os
       rastreadores de IA enxergarem as fotos sem executar JavaScript.
       Nas paginas de conteudo a galeria e uma selecao propria, menor que a
       lista inteira: ali o JS nao pode tocar.
       Na home, se o HTML bate com o dados.js, tambem nao mexemos. Se alguem
       editou o dados.js e esqueceu de rodar o build, remontamos aqui: o site
       continua certo para quem visita, so volta a ficar invisivel para os
       rastreadores ate o build rodar de novo. */
    if(box.getAttribute('data-fonte') === 'pagina') return;
    if(box.querySelectorAll('.work').length === lista.length) return;

    box.innerHTML = lista.map(function(o, i){
      return '<button class="work reveal" data-cap="' + esc(o.cap) + '">' +
        '<img src="img/' + esc(o.img) + '.webp" srcset="img/' + esc(o.img) + '-600.webp 600w, img/' +
        esc(o.img) + '.webp 1200w" sizes="(max-width:900px) 50vw, 380px" alt="' + esc(o.alt) + '"' +
        (i ? ' loading="lazy"' : '') + ' decoding="async">' +
        '<span class="cap">' + esc((o.cap || '').split('·').pop().trim()) + '</span></button>';
    }).join('');

  })();

  /* ---------------------------------------------------------------
     3. AVALIAÇÕES: nota sempre; cards só com texto real de cliente
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
          '<cite>' + esc(a.nome) + '</cite>' +
          '</blockquote>';
      }).join('');
    }
  })();

  /* ---------------------------------------------------------------
     3b. DÚVIDAS: a sanfona e os dados estruturados saem da mesma lista,
     para a resposta do site e a que o Google lê nunca divergirem.
  --------------------------------------------------------------- */
  (function duvidas(){
    var caixa = $('#acc'), lista = D.duvidas || [];
    if(!caixa || !lista.length) return;

    /* Mesma logica da galeria: o build.py ja gravou as duvidas e o JSON-LD do
       FAQ no HTML. So remontamos se o HTML estiver defasado. */
    var jaNoHtml = caixa.getAttribute('data-fonte') === 'pagina'
                || caixa.querySelectorAll('details').length === lista.length;

    if(!jaNoHtml) caixa.innerHTML = lista.map(function(d){
      return '<details class="acc__item reveal"><summary><span>' + esc(d.p) + '</span>' +
        '<i aria-hidden="true"></i></summary><div class="acc__corpo"><p>' + d.r + '</p></div></details>';
    }).join('');

    /* abre uma, fecha as outras */
    var itens = [].slice.call(caixa.querySelectorAll('details'));
    itens.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(d.open) itens.forEach(function(o){ if(o !== d) o.open = false; });
      });
    });

    var marcacao = {
      '@context':'https://schema.org', '@type':'FAQPage',
      mainEntity: lista.map(function(d){
        return { '@type':'Question', name: d.p,
                 acceptedAnswer: { '@type':'Answer', text: String(d.r).replace(/<[^>]+>/g, '') } };
      })
    };
    /* So injeta se o build nao tiver gravado antes: dois FAQPage na mesma
       pagina confundem o Google. */
    if(!jaNoHtml){
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(marcacao);
      document.head.appendChild(s);
    }
  })();

  /* ---------------------------------------------------------------
     3c. CLUBE 15: os quinze risquinhos, o que inclui e o regulamento.
     Os mesmos dados alimentam o convite da home e a página do clube:
     o que você escrever uma vez no dados.js aparece nos dois lugares.
  --------------------------------------------------------------- */
  (function clube(){
    var C = D.clube; if(!C) return;
    var total = Math.max(0, C.vagas|0);
    var presas = Math.min(total, Math.max(0, C.ocupadas|0));
    var livres = total - presas;

    /* os quinze traços: cheio é vaga com dono, vazado é vaga aberta */
    [].forEach.call(document.querySelectorAll('[data-clube="marcas"]'), function(el){
      var m = '';
      for(var i = 0; i < total; i++){
        m += '<i class="marca' + (i < presas ? ' is-presa' : '') + '" style="--i:' + i + '"></i>';
      }
      el.innerHTML = m;
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', livres + ' de ' + total + ' vagas abertas');
    });

    var frase = livres === 0 ? 'vagas esgotadas'
              : livres === 1 ? 'última vaga'
              : livres + ' vagas abertas';
    [].forEach.call(document.querySelectorAll('[data-clube="vagas"]'), function(el){
      el.textContent = frase;
    });
    [].forEach.call(document.querySelectorAll('[data-clube="chamada"]'), function(el){
      el.textContent = C.chamada || '';
    });
    [].forEach.call(document.querySelectorAll('[data-clube="resumo"]'), function(el){
      el.textContent = C.resumo || '';
    });

    /* sem vaga o botão não some: vira lista de espera. O bloco 1 já montou o
       href, então aqui só trocamos o texto da mensagem e o rótulo. */
    if(livres === 0){
      var num = String(D.whatsapp || '').replace(/\D/g, '');
      var espera = (D.mensagens && D.mensagens.clubeEspera) ||
                   'Oi, André! O Clube 15 está cheio. Quero entrar na lista de espera.';
      [].forEach.call(document.querySelectorAll('[data-clube="entrar"]'), function(a){
        if(num) a.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(espera);
        var rotulo = a.querySelector('[data-clube="rotulo"]') || a;
        rotulo.textContent = 'Entrar na lista de espera';
      });
    }

    [].forEach.call(document.querySelectorAll('[data-clube="inclui"]'), function(el){
      el.innerHTML = (C.inclui || []).map(function(x){
        return '<li class="inclui__item reveal"><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p></li>';
      }).join('');
    });

    [].forEach.call(document.querySelectorAll('[data-clube="regras"]'), function(el){
      el.innerHTML = (C.regras || []).map(function(x){
        return '<details class="acc__item reveal"><summary><span>' + esc(x.p) + '</span>' +
          '<i aria-hidden="true"></i></summary><div class="acc__corpo"><p>' + esc(x.r) + '</p></div></details>';
      }).join('');
      var itens = [].slice.call(el.querySelectorAll('details'));
      itens.forEach(function(d){
        d.addEventListener('toggle', function(){
          if(d.open) itens.forEach(function(o){ if(o !== d) o.open = false; });
        });
      });
    });
  })();

  /* mais blocos entram ao rolar: títulos, nota, formulário, rodapé */
  ['.head', '.score', '.form', '.studio figure', '.final .wrap', '.foot__id', '.redes']
    .forEach(function(sel){
      [].forEach.call(document.querySelectorAll(sel), function(el){ el.classList.add('reveal'); });
    });

  /* ---------------------------------------------------------------
     4. ENTRADA SUAVE: só marca o que ainda está abaixo da tela
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
  /* Tudo daqui para baixo tolera elemento ausente. O motivo é concreto: a
     página do clube não é obrigada a ter os mesmos pedaços da home, e um
     getElementById vazio aqui derrubaria o formulário lá embaixo junto. */
  var svg = document.getElementById('needle');
  var track = svg && svg.querySelector('.track'), ink = svg && svg.querySelector('.ink'),
      rastro = svg && svg.querySelector('.rastro'), tip = svg && svg.querySelector('.tip'),
      ring = svg && svg.querySelector('.tip-ring'), len = 0;
  /* com mouse o fio segue a mão; no toque continua a costura ligada à rolagem */
  var FIO = matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce;
  function build(){
    if(!ink) return;
    var W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox','0 0 '+W+' '+H);
    var mobile = W < 900, edgeL = mobile ? 8 : Math.max(18, (W-1180)/2 - 26), edgeR = W - edgeL;
    /* Ordem do documento, com as seções das DUAS páginas na mesma lista: o que
       não existir na página atual é pulado abaixo. Sem as âncoras da página do
       clube o fio virava um risco diagonal atravessando o texto. */
    var ids = ['trabalhos','sobre','avaliacoes','clube',
               'inclui','regras','entrar',
               'duvidas','agendar','estudio','fim'];
    var heroEl = document.querySelector('.hero');
    var y0 = (heroEl ? heroEl.offsetTop : 0) + 40;
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
    var endY = fim ? fim.offsetTop + fim.offsetHeight - 70
                   : Math.max(y0 + 200, H - 140);
    var cx = W/2;
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
      draw();
      if(nav) nav.classList.toggle('scrolled', scrollY > 10);
      if(fl) fl.classList.toggle('on', scrollY > innerHeight*0.8 && (innerHeight + scrollY) < document.documentElement.scrollHeight - 400);
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
     Guarda os últimos pontos do cursor em coordenadas da página, assim o
     fio fica preso ao conteúdo e rola junto, e liga tudo com curvas.
     A cauda se desfaz sozinha quando a mão para.
  --------------------------------------------------------------- */
  if(FIO && svg){
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
  /* A clube-15.html nao tem o elemento #lb. Sem esta guarda, a linha abaixo
     estourava "Cannot read properties of null" e TUDO o que vem depois parava
     de rodar naquela pagina, inclusive a medicao la embaixo: o Analytics e o
     Pixel nunca carregavam na pagina do clube. Verificado em 08/11/2026. */
  var works = [].slice.call(document.querySelectorAll('.work')), lb = document.getElementById('lb');
  if(lb){
  var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lbcap'), cur = 0, last = null;
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

  } /* fim do if(lb) */

  /* ---------------------------------------------------------------
     7. FORMULÁRIO: grava o pedido e abre o WhatsApp
     A janela do WhatsApp é aberta DENTRO do clique, senão o navegador
     bloqueia. O envio ao n8n corre em paralelo e em silêncio: se ele
     estiver fora do ar, a pessoa ainda fala com o André do mesmo jeito.
  --------------------------------------------------------------- */
  (function formulario(){
    var f = document.getElementById('form'); if(!f) return;
    var erro = document.getElementById('formErro');
    var botao = document.getElementById('formEnviar');
    var num = String(D.whatsapp || '').replace(/\D/g, '');

    /* o mesmo formulário serve a home e a página do clube: cada uma declara
       quais campos tem, e de qual mensagem do dados.js parte o recado */
    function campo(nome){
      var el = f.elements[nome];
      return el ? String(el.value).trim() : '';
    }
    var chaveWa = f.getAttribute('data-wa') || 'topo';

    /* máscara do telefone, enquanto digita */
    var fone = f.elements.whatsapp;
    fone.addEventListener('input', function(){
      var v = fone.value.replace(/\D/g, '').slice(0, 11);
      if(v.length > 7) v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
      else if(v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
      else if(v.length) v = '(' + v;
      fone.value = v;
    });

    function recado(d){
      var L = [(D.mensagens && D.mensagens[chaveWa]) || D.mensagem || 'Oi, André! Vim pelo site.', ''];
      if(d.nome)   L.push('Nome: ' + d.nome);
      if(d.ideia)  L.push('Ideia: ' + d.ideia);
      if(d.local)  L.push('Região: ' + d.local);
      if(d.quando) L.push('Quando posso: ' + d.quando);
      return L.join('\n');
    }

    f.addEventListener('submit', function(e){
      e.preventDefault();
      if(botao.disabled) return;

      var d = {
        nome:     campo('nome'),
        whatsapp: campo('whatsapp'),
        ideia:    campo('ideia'),
        local:    campo('local'),
        quando:   campo('quando'),
        origem:   f.getAttribute('data-origem') || 'formulario'
      };

      if(!d.nome || !d.ideia){ erro.textContent = f.getAttribute('data-erro') || 'Preencha seu nome e o que você quer tatuar.'; return; }
      if(d.whatsapp.replace(/\D/g, '').length < 10){ erro.textContent = 'Confira o seu WhatsApp com DDD.'; return; }
      if(f.elements.idade && !f.elements.idade.checked){ erro.textContent = 'Confirme que você tem 18 anos ou mais.'; return; }
      erro.textContent = '';

      var url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(recado(d));
      var janela = num ? window.open(url, '_blank') : null;
      if(janela){ try { janela.opener = null; } catch(err){} }

      /* DUAS CÓPIAS do mesmo lead, de propósito.

         1) Netlify: roda no mesmo lugar onde o site está publicado. Nunca cai
            junto com o n8n e manda e-mail na hora. É a rede de segurança.
         2) n8n: grava na tabela e avisa no Telegram. Só funciona enquanto o
            n8n estiver no ar.

         As duas correm em silêncio DEPOIS que o WhatsApp já abriu, porque o
         WhatsApp é o que realmente importa e não pode esperar por nada. */

      var nomeForm = f.getAttribute('name');
      if(nomeForm){
        try {
          var corpo = new URLSearchParams();
          corpo.append('form-name', nomeForm);
          corpo.append('nome', d.nome);
          corpo.append('whatsapp', d.whatsapp);
          corpo.append('ideia', d.ideia);
          if(d.local)  corpo.append('local', d.local);
          if(d.quando) corpo.append('quando', d.quando);
          corpo.append('origem', d.origem);
          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: corpo.toString(),
            keepalive: true
          }).catch(function(){});
        } catch(err){}
      }

      if(D.webhook){
        try {
          fetch(D.webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(d),
            keepalive: true
          }).catch(function(){});
        } catch(err){}
      }

      marcaEvento('generate_lead', 'Lead', { origem: d.origem });

      botao.innerHTML = '<span class="dot"></span>Pedido enviado';
      botao.disabled = true;
      f.classList.add('is-enviado');
      if(num && !janela) location.href = url;   /* bloqueou a janela: vai direto */
    });
  })();

  /* ---------------------------------------------------------------
     8. MEDIÇÃO: Google Analytics e Pixel da Meta

     Os dois ficam DESLIGADOS enquanto os códigos estiverem vazios no
     dados.js: nenhum arquivo é baixado e nada é enviado. Para ligar é
     só colar os códigos lá e publicar. Vale para o site inteiro, porque
     todas as páginas carregam este arquivo.

     NÃO medimos visita, medimos contato:
       whatsapp      quem clicou para chamar, e de QUAL botão saiu
       generate_lead quem preencheu o formulário inteiro
       clube_15      quem foi olhar o clube

     É isso que diz onde vale pôr esforço e dinheiro de anúncio, e é
     disso que o Meta aprende quem procurar. Contagem de visita não
     responde nenhuma das duas perguntas.
  --------------------------------------------------------------- */
  (function medicao(){
    var M  = D.medicao || {};
    var ga = String(M.ga4   || '').trim();
    var px = String(M.pixel || '').trim();
    if(!ga && !px) return;              /* nada colado: o bloco inteiro é um no-op */

    /* ----- Google Analytics ----- */
    if(ga){
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
      document.head.appendChild(g);
      window.gtag('js', new Date());
      window.gtag('config', ga);
    }

    /* ----- Pixel da Meta ----- */
    if(px){
      if(!window.fbq){
        var f = window.fbq = function(){
          f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments);
        };
        if(!window._fbq) window._fbq = f;
        f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
        var pp = document.createElement('script');
        pp.async = true;
        pp.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(pp);
      }
      window.fbq('init', px);
      window.fbq('track', 'PageView');
    }

    /* Daqui para frente marcaEvento faz alguma coisa. Cada envio vai dentro do
       seu try: se um dos dois estiver bloqueado no navegador da pessoa, o outro
       continua funcionando e o site não quebra por causa de medição. */
    marcaEvento = function(nomeGa, nomeMeta, dados){
      var d = dados || {};
      if(ga){ try { window.gtag('event', nomeGa, d); } catch(e){} }
      if(px && nomeMeta){ try { window.fbq('track', nomeMeta, d); } catch(e){} }
    };

    /* Um ouvinte só, na captura, para a página inteira. Na captura porque o
       clique no WhatsApp abre outra janela: se esperássemos a vez normal, em
       alguns navegadores a marcação não sairia a tempo. */
    document.addEventListener('click', function(e){
      var alvo = e.target;
      if(!alvo || !alvo.closest) return;

      var wa = alvo.closest('a[href*="wa.me"]');
      if(wa){
        marcaEvento('whatsapp', 'Contact', {
          botao:  wa.getAttribute('data-wa') || 'outro',
          pagina: location.pathname
        });
        return;
      }

      var cl = alvo.closest('a[href*="clube-15"]');
      if(cl) marcaEvento('clube_15', 'ViewContent', { pagina: location.pathname });
    }, true);
  })();
})();
