/* =====================================================================
   ANDRE TATTOO — interações
   Sem bibliotecas externas. Tudo degrada bem: se o JS falhar, o
   conteúdo continua legível e os links continuam funcionando.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH  = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------------------------------------------------------
     1. LINKS DE CONTATO (Instagram / WhatsApp / mapa)
  --------------------------------------------------------------- */
  var IG = "https://www.instagram.com/" + (CFG.instagram || "andretatuadoor") + "/";

  function waLink(texto) {
    var num = (CFG.whatsapp || "").replace(/\D/g, "");
    if (!num) return IG;                                  // sem número: cai no Direct
    return "https://wa.me/" + num + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }

  $$("[data-ig]").forEach(function (a) {
    a.href = IG; a.target = "_blank"; a.rel = "noopener";
  });

  var maps = $("#mapsBtn");
  if (maps && CFG.estudio && CFG.estudio.maps) maps.href = CFG.estudio.maps;

  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     2. LOADER
  --------------------------------------------------------------- */
  (function loader() {
    var box = $("#loader"), fill = $("#loaderFill");
    if (!box) return;
    var p = 0;
    var t = setInterval(function () {
      p = Math.min(96, p + Math.random() * 16);
      if (fill) fill.style.width = p + "%";
    }, 130);

    function done() {
      clearInterval(t);
      if (fill) fill.style.width = "100%";
      setTimeout(function () {
        box.classList.add("is-done");
        document.body.classList.remove("is-locked");
        setTimeout(function () { box.remove(); }, 800);
      }, REDUCE ? 10 : 420);
    }
    document.body.classList.add("is-locked");
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done);
    setTimeout(done, 4200);                               // trava de segurança
  })();

  /* ---------------------------------------------------------------
     3. NAVEGAÇÃO
  --------------------------------------------------------------- */
  var nav = $("#nav"), burger = $("#burger"), menu = $("#menu");

  function navH() { return nav ? nav.offsetHeight : 0; }

  function goTo(hash) {
    var el = hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    var y = el ? el.getBoundingClientRect().top + window.pageYOffset - navH() + 1 : 0;
    window.scrollTo({ top: Math.max(0, y), behavior: REDUCE ? "auto" : "smooth" });
  }

  $$("[data-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var h = a.getAttribute("href");
      if (!h || h.charAt(0) !== "#") return;
      e.preventDefault();
      closeMenu();
      goTo(h);
      history.replaceState(null, "", h === "#top" ? location.pathname : h);
    });
  });

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add("is-open"); });
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("is-locked");
    $$(".menu__links a", menu).forEach(function (a, i) {
      a.style.transitionDelay = (0.06 + i * 0.045) + "s";
    });
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("is-locked");
    setTimeout(function () { menu.hidden = true; }, 420);
  }
  if (burger) burger.addEventListener("click", function () {
    burger.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* estado do header, barra de progresso e botão flutuante */
  var bar = $("#scrollbar"), fab = $("#fab"), last = 0;

  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (nav) {
      nav.classList.toggle("is-stuck", y > 40);
      nav.classList.toggle("is-hidden", y > 420 && y > last && (!menu || menu.hidden));
    }
    if (fab) fab.classList.toggle("is-on", y > window.innerHeight * 0.8);
    last = y;
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); rail(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* link ativo */
  var secs = $$("main section[id]");
  var navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window && secs.length) {
    var ioNav = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { ioNav.observe(s); });
  }

  /* ---------------------------------------------------------------
     4. CURSOR
  --------------------------------------------------------------- */
  if (!TOUCH && !REDUCE) {
    var cur = $("#cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
      cur.classList.add("is-on");
    }, { passive: true });
    (function tick() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      requestAnimationFrame(tick);
    })();
    document.addEventListener("mouseover", function (e) {
      var hot = e.target.closest("a,button,summary,.tile,.card,input,textarea,[role=radio],[role=tab]");
      cur.classList.toggle("is-hot", !!hot);
    });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
  }

  /* ---------------------------------------------------------------
     5. FUMAÇA NO HERO (canvas)
  --------------------------------------------------------------- */
  (function smoke() {
    var cv = $("#smoke");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var blobs = [], px = 0.5, py = 0.4, tx = 0.5, ty = 0.4;

    function size() {
      var r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      blobs = [];
      var n = w < 700 ? 5 : 8;
      for (var i = 0; i < n; i++) {
        blobs.push({
          x: Math.random(), y: Math.random(),
          r: 0.18 + Math.random() * 0.3,
          vx: (Math.random() - 0.5) * 0.00045,
          vy: -0.00018 - Math.random() * 0.00032,
          a: 0.05 + Math.random() * 0.09,
          hue: Math.random() < 0.28 ? "gold" : "smoke"
        });
      }
    }

    function paint() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#07080a";
      ctx.fillRect(0, 0, w, h);

      px += (tx - px) * 0.04; py += (ty - py) * 0.04;

      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var cx = (b.x + (px - 0.5) * 0.06) * w;
        var cy = (b.y + (py - 0.5) * 0.05) * h;
        var rad = b.r * Math.max(w, h) * 0.72;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        if (b.hue === "gold") {
          g.addColorStop(0, "rgba(201,162,74," + (b.a * 0.6).toFixed(3) + ")");
          g.addColorStop(0.45, "rgba(150,120,60," + (b.a * 0.18).toFixed(3) + ")");
        } else {
          g.addColorStop(0, "rgba(174,180,191," + b.a.toFixed(3) + ")");
          g.addColorStop(0.45, "rgba(90,98,112," + (b.a * 0.28).toFixed(3) + ")");
        }
        g.addColorStop(1, "rgba(7,8,10,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();

        b.x += b.vx; b.y += b.vy;
        if (b.y < -0.35) { b.y = 1.3; b.x = Math.random(); }
        if (b.x < -0.4) b.x = 1.3;
        if (b.x > 1.4) b.x = -0.3;
      }
    }

    function loop() { paint(); raf = requestAnimationFrame(loop); }
    var raf = null;

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight;
    }, { passive: true });

    window.addEventListener("resize", function () { size(); seed(); if (REDUCE) paint(); });

    size(); seed();
    if (REDUCE) { paint(); return; }
    loop();

    /* economiza bateria: para a animação quando o hero sai da tela */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { if (!raf) loop(); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
      }, { threshold: 0.02 }).observe(cv);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!document.hidden && !raf) loop();
    });
  })();

  /* ---------------------------------------------------------------
     6. REVELAÇÕES AO ROLAR
  --------------------------------------------------------------- */
  /* quebra os títulos em palavras para a entrada linha a linha */
  $$(".reveal-lines").forEach(function (el) {
    var html = el.innerHTML;
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var out = "";
    Array.prototype.forEach.call(tmp.childNodes, function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w.trim()) { out += " "; return; }
          out += '<span class="w"><i>' + w + "</i></span>";
        });
      } else {
        out += '<span class="w w--free"><i>' + n.outerHTML + "</i></span>";
      }
    });
    el.innerHTML = out;
    $$(".w > i", el).forEach(function (i, k) {
      i.style.transitionDelay = (k * 0.055) + "s";
    });
  });

  function revealAll(nodes) {
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var d = parseFloat(el.getAttribute("data-d") || 0) * 0.09;
        el.style.transitionDelay = d + "s";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }
  revealAll($$(".reveal-up, .reveal-scale, .reveal-lines, .step"));

  /* o que já está na primeira tela entra assim que a página abre,
     sem depender de rolagem */
  function primeiraTela() {
    $$(".reveal-up, .reveal-scale, .reveal-lines, .step").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 8 && r.bottom > 0) el.classList.add("is-in");
    });
  }
  window.addEventListener("load", function () { setTimeout(primeiraTela, 60); });
  setTimeout(primeiraTela, 900);

  /* contadores */
  function count(el) {
    var alvo = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (REDUCE) { el.textContent = alvo; return; }
    var ini = performance.now(), dur = 1100;
    (function step(t) {
      var k = Math.min(1, (t - ini) / dur);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(ini);
  }
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var ioC = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        count(en.target); ioC.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { ioC.observe(c); });
  } else counters.forEach(count);

  /* contadores visíveis na abertura */
  setTimeout(function () {
    counters.forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && c.textContent === "0") count(c);
    });
  }, 950);

  /* trilho do processo */
  var railEl = $("#railFill"), stepsEl = $("#steps");
  function rail() {
    if (!railEl || !stepsEl) return;
    var r = stepsEl.getBoundingClientRect();
    var k = (window.innerHeight * 0.72 - r.top) / r.height;
    railEl.style.transform = "scaleY(" + Math.max(0, Math.min(1, k)) + ")";
  }
  rail();

  /* ---------------------------------------------------------------
     7. CARDS: inclinação 3D e luz que segue o ponteiro
  --------------------------------------------------------------- */
  if (!TOUCH && !REDUCE) {
    $$(".tilt").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", (x * 100) + "%");
        el.style.setProperty("--my", (y * 100) + "%");
        el.style.transform = "perspective(900px) rotateY(" + ((x - 0.5) * 5).toFixed(2) +
          "deg) rotateX(" + ((0.5 - y) * 5).toFixed(2) + "deg) translateZ(0)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    /* botões magnéticos */
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = "translate(" + (x * 9).toFixed(1) + "px," + (y * 7).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------
     8. PORTFÓLIO
  --------------------------------------------------------------- */
  var grid = $("#grid");
  var itens = (CFG.portfolio || []).slice();
  var comFoto = itens.filter(function (i) { return i.src; });
  /* Se já houver foto publicada, mostra só as reais.
     Se ainda não houver nenhuma, mostra os espaços reservados
     para o layout não ficar vazio. */
  var lista = comFoto.length ? comFoto : itens;
  var visiveis = [];

  function tile(it, i) {
    var el = document.createElement(it.src ? "button" : "div");
    el.className = "tile" + (it.src ? "" : " tile--empty");
    el.setAttribute("data-estilo", it.estilo || "");
    el.setAttribute("data-i", i);
    if (it.src) {
      el.type = "button";
      el.setAttribute("aria-label", "Ampliar: " + (it.titulo || it.alt || "tatuagem"));
    }

    var html = '<span class="tile__bg"></span>';
    if (it.src) {
      html += '<img src="' + it.src + '" alt="' + (it.alt || "") + '" loading="lazy" decoding="async">';
    } else {
      html += '<span class="tile__slot"><span class="frame__label">Em breve</span></span>';
    }
    html += '<span class="tile__veil"></span>';
    if (it.local) html += '<span class="tile__tag">' + it.local + "</span>";
    html += '<span class="tile__txt">' +
      (it.titulo ? '<span class="tile__t">' + it.titulo + "</span>" : "") +
      (it.palavra ? '<span class="tile__w">' + it.palavra + "</span>" : "") +
      (it.significado ? '<span class="tile__m">' + it.significado + "</span>" : "") +
      "</span>";
    el.innerHTML = html;

    if (it.src) el.addEventListener("click", function () { abreLB(i); });
    return el;
  }

  if (grid) {
    lista.forEach(function (it, i) { grid.appendChild(tile(it, i)); });
    visiveis = $$(".tile", grid);
    revealAll(visiveis);
  }

  /* filtros */
  var filtros = $("#filters");
  if (filtros && grid) {
    filtros.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-f]");
      if (!b) return;
      $$("button", filtros).forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      var f = b.getAttribute("data-f");
      var mostrou = 0;
      visiveis.forEach(function (t) {
        var ok = f === "todos" || t.getAttribute("data-estilo") === f;
        t.classList.toggle("is-out", !ok);
        if (ok) {
          mostrou++;
          t.classList.remove("is-in");
          /* reanima a entrada do que entrou no filtro */
          requestAnimationFrame(function () {
            t.style.transitionDelay = (mostrou * 0.04) + "s";
            t.classList.add("is-in");
          });
        }
      });
      vazio(mostrou === 0, f);
    });
  }

  function vazio(estaVazio, f) {
    var msg = $("#gridEmpty");
    if (!estaVazio) { if (msg) msg.remove(); return; }
    if (msg) return;
    msg = document.createElement("p");
    msg.id = "gridEmpty";
    msg.className = "port__note";
    msg.innerHTML = "Ainda não há trabalho publicado neste estilo. Os mais recentes estão no " +
      '<a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>.';
    grid.parentNode.insertBefore(msg, grid.nextSibling);
  }

  /* ---------------------------------------------------------------
     9. LIGHTBOX
  --------------------------------------------------------------- */
  var lb = $("#lb"), lbMedia = $("#lbMedia"), lbCap = $("#lbCap");
  var navegaveis = lista.map(function (it, i) { return it.src ? i : -1; }).filter(function (i) { return i >= 0; });
  var atual = -1;

  function pinta(i) {
    var it = lista[i];
    if (!it) return;
    atual = i;
    lbMedia.innerHTML = it.src
      ? '<img src="' + it.src + '" alt="' + (it.alt || "") + '">'
      : '<span class="frame__label">Em breve</span>';
    lbCap.innerHTML =
      (it.titulo ? "<b>" + it.titulo + "</b>" : "") +
      (it.palavra ? "<em>" + it.palavra + "</em> " : "") +
      (it.significado ? "— " + it.significado : "") +
      "<small>" + [it.local, estiloNome(it.estilo)].filter(Boolean).join(" · ") +
      (it.tratada ? " · Foto tratada, tatuagem real." : "") + "</small>";
  }

  function estiloNome(k) {
    return ({ realismo: "Realismo preto e cinza", fineline: "Fine line", coverup: "Cobertura",
      colorido: "Aquarela / colorido", delicado: "Delicado" })[k] || "";
  }

  function abreLB(i) {
    if (!lb) return;
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("is-on"); });
    document.body.classList.add("is-locked");
    pinta(i);
    $("#lbX").focus();
  }
  function fechaLB() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("is-on");
    document.body.classList.remove("is-locked");
    setTimeout(function () { lb.hidden = true; lbMedia.innerHTML = ""; }, 380);
  }
  function anda(d) {
    if (!navegaveis.length) return;
    var k = navegaveis.indexOf(atual);
    pinta(navegaveis[(k + d + navegaveis.length) % navegaveis.length]);
  }
  if (lb) {
    $("#lbX").addEventListener("click", fechaLB);
    $("#lbPrev").addEventListener("click", function () { anda(-1); });
    $("#lbNext").addEventListener("click", function () { anda(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) fechaLB(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") fechaLB();
      if (e.key === "ArrowLeft") anda(-1);
      if (e.key === "ArrowRight") anda(1);
    });
    /* arraste no celular */
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) anda(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     10. FAQ — abre um, fecha os outros
  --------------------------------------------------------------- */
  var itemsFaq = $$(".acc__item");
  itemsFaq.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      itemsFaq.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------------------------------------------------------------
     11. FOTOS DO ESTÚDIO E RETRATO
  --------------------------------------------------------------- */
  function põeFoto(sel, src, alt) {
    var el = $('[data-photo="' + sel + '"]');
    if (!el || !src) return;
    var img = document.createElement("img");
    img.src = src; img.alt = alt || ""; img.loading = "lazy"; img.decoding = "async";
    el.appendChild(img);
    var l = $(".frame__label", el), h = $(".frame__hint", el);
    if (l) l.remove();
    if (h) h.remove();
  }
  põeFoto("retrato", CFG.retrato, "André tatuando no estúdio");
  (CFG.fotosEstudio || []).forEach(function (src, i) {
    põeFoto("estudio-" + (i + 1), src, "Estúdio André Tattoo");
  });

  /* ---------------------------------------------------------------
     12. ORÇAMENTO (3 passos → WhatsApp)
  --------------------------------------------------------------- */
  var form = $("#form");
  if (form) {
    var passos = $$(".fs", form);
    var fill = $("#formFill"), agora = $("#stepNow");
    var bPrev = $("#prev"), bNext = $("#next"), bSend = $("#send");
    var erro = $("#err");
    var passo = 1;

    var dados = { nome: "", estilo: "", ideia: "", local: "", tamanho: "15",
      primeira: false, cobrir: false, quando: "", extra: "" };

    /* chips */
    function ligaChips(id, campo) {
      var box = $(id);
      if (!box) return;
      /* um só ponto de tabulação por grupo; as setas andam entre as opções */
      $$("button", box).forEach(function (x, i) { x.tabIndex = i === 0 ? 0 : -1; });
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-v]");
        if (!b) return;
        $$("button", box).forEach(function (x) {
          x.setAttribute("aria-checked", String(x === b));
          x.tabIndex = x === b ? 0 : -1;
        });
        dados[campo] = b.getAttribute("data-v");
        box.classList.remove("has-err");
        previa();
      });
      box.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var bs = $$("button", box);
        var i = bs.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        var alvo = bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length];
        alvo.focus();
        alvo.click();
      });
    }
    ligaChips("#chipsEstilo", "estilo");
    ligaChips("#chipsLocal", "local");
    ligaChips("#chipsQuando", "quando");

    /* campos de texto e caixas */
    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t.name && t.name in dados) {
        dados[t.name] = t.type === "checkbox" ? t.checked : t.value;
      }
      if (t.id === "size") {
        var v = parseInt(t.value, 10);
        $("#sizeOut").textContent = v + " cm";
        $("#rulerBar").style.width = ((v - 3) / 42 * 100).toFixed(1) + "%";
      }
      var f = t.closest(".field, .check");
      if (f) f.classList.remove("has-err");
      previa();
    });
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name && t.name in dados && t.type === "checkbox") dados[t.name] = t.checked;
      previa();
    });

    /* mensagem */
    function mensagem() {
      var L = ["Olá, André. Vim pelo site e queria um orçamento."];
      L.push("");
      if (dados.nome)   L.push("Nome: " + dados.nome.trim());
      if (dados.estilo) L.push("Estilo: " + dados.estilo);
      if (dados.ideia)  L.push("Ideia: " + dados.ideia.trim().replace(/\s+/g, " "));
      if (dados.local)  L.push("Região do corpo: " + dados.local);
      if (dados.tamanho) L.push("Tamanho aproximado: " + dados.tamanho + " cm");
      if (dados.primeira) L.push("É a minha primeira tatuagem.");
      if (dados.cobrir)   L.push("Quero cobrir uma tatuagem antiga (posso mandar foto).");
      if (dados.quando) L.push("Disponibilidade: " + dados.quando);
      if (dados.extra)  L.push("Observações: " + dados.extra.trim().replace(/\s+/g, " "));
      L.push("");
      L.push("Tenho 18 anos ou mais.");
      return L.join("\n");
    }

    function previa() {
      var p = $("#previewTxt");
      if (!p) return;
      var preenchido = dados.nome || dados.estilo || dados.ideia || dados.local || dados.quando;
      p.textContent = preenchido ? mensagem() : "Vá preenchendo ao lado — a mensagem se monta aqui.";
    }

    /* validação */
    function valida(n) {
      var ok = true;
      erro.textContent = "";
      if (n === 1) {
        var nome = form.querySelector('[name="nome"]');
        var ideia = form.querySelector('[name="ideia"]');
        if (!nome.value.trim()) { marca(nome); ok = false; }
        if (!ideia.value.trim()) { marca(ideia); ok = false; }
        if (!dados.estilo) { $("#chipsEstilo").classList.add("has-err"); ok = false; }
        if (!ok) erro.textContent = "Preencha nome, estilo e a ideia para continuar.";
      }
      if (n === 2) {
        if (!dados.local) { $("#chipsLocal").classList.add("has-err"); ok = false;
          erro.textContent = "Escolha a região do corpo."; }
      }
      if (n === 3) {
        var idade = form.querySelector('[name="idade"]');
        if (!dados.quando) { $("#chipsQuando").classList.add("has-err"); ok = false;
          erro.textContent = "Diga quando você pode."; }
        if (!idade.checked) { idade.closest(".check").classList.add("has-err"); ok = false;
          erro.textContent = "Confirme que você tem 18 anos ou mais."; }
      }
      return ok;
    }
    function marca(el) { var f = el.closest(".field"); if (f) f.classList.add("has-err"); }

    function vai(n, mover) {
      passo = Math.max(1, Math.min(3, n));
      passos.forEach(function (fs) {
        fs.classList.toggle("is-on", parseInt(fs.getAttribute("data-step"), 10) === passo);
      });
      if (fill) fill.style.width = (passo / 3 * 100) + "%";
      if (agora) agora.textContent = passo;
      bPrev.disabled = passo === 1;
      bNext.hidden = passo === 3;
      bSend.hidden = passo !== 3;
      erro.textContent = "";
      var topo = form.getBoundingClientRect().top + window.pageYOffset - navH() - 24;
      if (form.getBoundingClientRect().top < 0) window.scrollTo({ top: topo, behavior: REDUCE ? "auto" : "smooth" });
      if (!mover || TOUCH) return;
      var foco = $(".fs.is-on input, .fs.is-on textarea, .fs.is-on button", form);
      if (foco) foco.focus({ preventScroll: true });
    }

    bNext.addEventListener("click", function () { if (valida(passo)) vai(passo + 1, true); });
    bPrev.addEventListener("click", function () { vai(passo - 1, true); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!valida(3)) return;
      var url = waLink(mensagem());
      var aviso = (CFG.whatsapp || "").replace(/\D/g, "")
        ? "Abrindo o WhatsApp"
        : "WhatsApp ainda não configurado — abrindo o Instagram";
      toast(aviso);
      window.open(url, "_blank", "noopener");
    });

    var copy = $("#copyBtn");
    if (copy) copy.addEventListener("click", function () {
      var txt = mensagem();
      function antigo() {
        var ta = document.createElement("textarea");
        ta.value = txt; ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (err) {}
        ta.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { toast("Mensagem copiada"); }, function () {
          antigo(); toast("Mensagem copiada");
        });
      } else { antigo(); toast("Mensagem copiada"); }
    });

    vai(1);
    previa();
  }

  /* ---------------------------------------------------------------
     13. TOAST
  --------------------------------------------------------------- */
  var tEl = $("#toast"), tTimer = null;
  function toast(msg) {
    if (!tEl) return;
    tEl.textContent = msg;
    tEl.classList.add("is-on");
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { tEl.classList.remove("is-on"); }, 2600);
  }

})();
