/* =====================================================================
   ANDRE TATTOO — interações (v2, arquitetura de conversão)
   Sem bibliotecas. Degrada bem: sem JS, o conteúdo continua legível.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH  = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------------------------------------------------------
     1. MEDIÇÃO (CRO) — só carrega se houver ID no config
  --------------------------------------------------------------- */
  (function medir() {
    var a = CFG.analytics || {};
    if (a.ga4) {
      var s = document.createElement("script");
      s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + a.ga4;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", a.ga4);
    }
    if (a.metaPixel) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq("init", a.metaPixel); window.fbq("track", "PageView");
    }
  })();

  function track(nome, dados) {
    if (window.gtag) window.gtag("event", nome, dados || {});
    if (window.fbq) window.fbq("trackCustom", nome, dados || {});
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-ev]");
    if (el) track(el.getAttribute("data-ev"));
  });

  /* ---------------------------------------------------------------
     1b. TEMA (escuro | claro) — definido em config.js
  --------------------------------------------------------------- */
  (function tema() {
    var guardado = null;
    try { guardado = localStorage.getItem("andre-tema"); } catch (e) {}
    var atual = guardado || CFG.tema || "escuro";
    function poe(t) {
      atual = t;
      document.documentElement.setAttribute("data-tema", t);
      $$("#tema button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-t") === t));
      });
      try { localStorage.setItem("andre-tema", t); } catch (e) {}
    }
    poe(atual);
    var box = $("#tema");
    if (!box) return;                       /* site publicado: sem seletor */
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-t]");
      if (b) { poe(b.getAttribute("data-t")); track("tema", { escolha: atual }); }
    });
  })();

  /* ---------------------------------------------------------------
     2. CONTATO
  --------------------------------------------------------------- */
  var IG  = "https://www.instagram.com/" + (CFG.instagram || "andretatuadoor") + "/";
  var NUM = (CFG.whatsapp || "").replace(/\D/g, "");

  function waLink(texto) {
    if (!NUM) return IG;
    return "https://wa.me/" + NUM + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }
  $$("[data-ig]").forEach(function (a) { a.href = IG; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink("Olá, André. Vim pelo site e queria conversar sobre uma tatuagem.");
    a.target = "_blank"; a.rel = "noopener";
  });
  var maps = $("#mapsBtn");
  if (maps && CFG.estudio && CFG.estudio.maps) maps.href = CFG.estudio.maps;
  var year = $("#year"); if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     3. LOADER
  --------------------------------------------------------------- */
  (function loader() {
    var box = $("#loader"); if (!box) return;
    function done() {
      box.classList.add("is-done");
      document.body.classList.remove("is-locked");
      setTimeout(function () { box.remove(); }, 800);
    }
    document.body.classList.add("is-locked");
    if (document.readyState === "complete") setTimeout(done, 350);
    else window.addEventListener("load", function () { setTimeout(done, 350); });
    setTimeout(done, 3500);
  })();

  /* ---------------------------------------------------------------
     4. VÍDEO DO TOPO — carrega só quando dá, nunca atrapalha
  --------------------------------------------------------------- */
  (function heroVideo() {
    var v = $("#heroVideo"); if (!v) return;
    var mobile = window.matchMedia("(max-width: 760px)").matches;
    var con = navigator.connection || {};
    var economiza = con.saveData === true || /2g/.test(con.effectiveType || "");
    if (REDUCE || economiza) return;                 /* fica só o poster */

    var base = mobile ? "video/hero-mobile" : "video/hero-desktop";
    [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(function (f) {
      var s = document.createElement("source");
      s.src = base + "." + f[0]; s.type = f[1];
      v.appendChild(s);
    });
    v.load();
    v.addEventListener("error", function () { v.classList.remove("is-on"); }, true);
    v.addEventListener("canplay", function () {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
      v.classList.add("is-on");
      track("video_play", { local: "hero" });
    }, { once: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) v.pause(); else v.play().catch(function () {});
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es[0].isIntersecting ? v.play().catch(function () {}) : v.pause();
      }, { threshold: 0.05 }).observe(v);
    }
  })();

  /* vídeo da seção processo: toca quando aparece */
  (function obraVideo() {
    var v = $("#obraVideo"); if (!v || REDUCE) return;
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { v.preload = "auto"; v.play().catch(function () {}); }
      else v.pause();
    }, { threshold: 0.3 }).observe(v);
  })();

  /* ---------------------------------------------------------------
     5. NAVEGAÇÃO
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
      e.preventDefault(); closeMenu(); goTo(h);
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
    $$(".menu__links a", menu).forEach(function (a, i) { a.style.transitionDelay = (0.05 + i * 0.04) + "s"; });
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

  var bar = $("#scrollbar"), fixa = $("#bar"), last = 0;
  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (nav) {
      nav.classList.toggle("is-stuck", y > 40);
      nav.classList.toggle("is-hidden", y > 420 && y > last && (!menu || menu.hidden));
    }
    if (fixa) fixa.classList.toggle("is-on", y > window.innerHeight * 0.65);
    last = y;
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); rail(); ticking = false; });
  }, { passive: true });

  var secs = $$("main section[id]"), navLinks = $$(".nav__links a");
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
     6. CURSOR
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
      cur.classList.toggle("is-hot",
        !!e.target.closest("a,button,summary,.tile,.card,.slide,input,textarea,label,[role=radio],[role=tab]"));
    });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
  }

  /* ---------------------------------------------------------------
     7. REVELAÇÕES
  --------------------------------------------------------------- */
  $$(".reveal-lines").forEach(function (el) {
    var tmp = document.createElement("div"); tmp.innerHTML = el.innerHTML;
    var out = "";
    Array.prototype.forEach.call(tmp.childNodes, function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w.trim()) { out += " "; return; }
          out += '<span class="w"><i>' + w + "</i></span>";
        });
      } else out += '<span class="w w--free"><i>' + n.outerHTML + "</i></span>";
    });
    el.innerHTML = out;
    $$(".w > i", el).forEach(function (i, k) { i.style.transitionDelay = (k * 0.05) + "s"; });
  });

  function revealAll(nodes) {
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); }); return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.style.transitionDelay = (parseFloat(el.getAttribute("data-d") || 0) * 0.09) + "s";
        el.classList.add("is-in"); io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    nodes.forEach(function (n) { io.observe(n); });
  }
  revealAll($$(".reveal-up, .reveal-scale, .reveal-lines, .step"));

  function primeiraTela() {
    $$(".reveal-up, .reveal-scale, .reveal-lines, .step").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 8 && r.bottom > 0) el.classList.add("is-in");
    });
  }
  window.addEventListener("load", function () { setTimeout(primeiraTela, 60); });
  setTimeout(primeiraTela, 900);

  var railEl = $("#railFill"), stepsEl = $("#steps");
  function rail() {
    if (!railEl || !stepsEl) return;
    var r = stepsEl.getBoundingClientRect();
    railEl.style.transform = "scaleY(" + Math.max(0, Math.min(1, (window.innerHeight * 0.72 - r.top) / r.height)) + ")";
  }

  if (!TOUCH && !REDUCE) {
    $$(".tilt").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", (x * 100) + "%");
        el.style.setProperty("--my", (y * 100) + "%");
        el.style.transform = "perspective(900px) rotateY(" + ((x - .5) * 4).toFixed(2) +
          "deg) rotateX(" + ((.5 - y) * 4).toFixed(2) + "deg)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + (((e.clientX - r.left - r.width / 2) / r.width) * 8).toFixed(1) +
          "px," + (((e.clientY - r.top - r.height / 2) / r.height) * 6).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------
     8. PORTFÓLIO, SLIDER E PROCESSO
  --------------------------------------------------------------- */
  var OBRAS = (CFG.portfolio || []).filter(function (o) { return o.img; });

  var NOMES = { realismo:"Realismo preto e cinza", fineline:"Fine line", blackwork:"Blackwork",
                lettering:"Lettering", coverup:"Cobertura" };

  /* o navegador escolhe o arquivo pelo tamanho real exibido: economiza dados no celular */
  function fig(nome, alt, sizes) {
    var b = "img/portfolio/" + nome;
    var set = b + "-sm.EXT 640w, " + b + ".EXT 1200w";
    var s = sizes ? ' sizes="' + sizes + '"' : "";
    return '<picture>' +
      '<source type="image/webp" srcset="' + set.replace(/EXT/g, "webp") + '"' + s + ">" +
      '<img src="' + b + '-sm.jpg" srcset="' + set.replace(/EXT/g, "jpg") + '"' + s +
      ' alt="' + alt + '" loading="lazy" decoding="async"></picture>';
  }

  /* --- slider de destaques --- */
  var trilho = $("#slideTrack");
  var destaques = OBRAS.filter(function (o) { return o.destaque; });
  if (trilho && destaques.length) {
    destaques.forEach(function (o) {
      var i = OBRAS.indexOf(o);
      var b = document.createElement("button");
      b.type = "button"; b.className = "slide";
      b.setAttribute("aria-label", "Ampliar: " + o.titulo);
      b.innerHTML = fig(o.img, o.alt, "(max-width:760px) 78vw, 430px") +
        '<span class="slide__veil"></span>' +
        (o.local ? '<span class="slide__tag">' + o.local + "</span>" : "") +
        '<span class="slide__txt"><span class="slide__t">' + o.titulo + "</span>" +
        '<span class="slide__w">' + o.palavra + "</span>" +
        '<span class="slide__m">' + o.significado + "</span></span>";
      b.addEventListener("click", function () { abreLB(i); });
      trilho.appendChild(b);
    });

    var slider = $("#slider"), dots = $("#slideDots");
    destaques.forEach(function (_, i) {
      var d = document.createElement("i"); if (!i) d.className = "is-on"; dots.appendChild(d);
    });
    function passo() { var s = trilho.querySelector(".slide"); return s ? s.offsetWidth + 18 : 400; }
    function anda(d) { slider.scrollBy({ left: d * passo(), behavior: REDUCE ? "auto" : "smooth" }); }
    $("#slidePrev").addEventListener("click", function () { anda(-1); });
    $("#slideNext").addEventListener("click", function () { anda(1); });
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); anda(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); anda(-1); }
    });
    slider.addEventListener("scroll", function () {
      var k = Math.round(slider.scrollLeft / passo());
      $$("i", dots).forEach(function (d, i) { d.classList.toggle("is-on", i === k); });
      $("#slidePrev").disabled = slider.scrollLeft < 8;
      $("#slideNext").disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
    }, { passive: true });
  }

  /* --- grade do portfólio --- */
  var grid = $("#grid"), tiles = [];
  if (grid) {
    OBRAS.forEach(function (o, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "tile"; b.setAttribute("data-estilo", o.estilo || "");
      b.setAttribute("aria-label", "Ampliar: " + o.titulo);
      b.innerHTML = fig(o.img, o.alt, "(max-width:620px) 92vw, 300px") +
        '<span class="tile__veil"></span>' +
        (o.local ? '<span class="tile__tag">' + o.local + "</span>" : "") +
        '<span class="tile__txt"><span class="tile__t">' + o.titulo + "</span>" +
        '<span class="tile__w">' + o.palavra + "</span>" +
        '<span class="tile__m">' + o.significado + "</span></span>";
      b.addEventListener("click", function () { abreLB(i); });
      grid.appendChild(b);
    });
    tiles = $$(".tile", grid);
    revealAll(tiles);
  }

  var filtros = $("#filters");
  if (filtros && grid) {
    filtros.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-f]"); if (!b) return;
      $$("button", filtros).forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      var f = b.getAttribute("data-f"), n = 0;
      tiles.forEach(function (t) {
        var ok = f === "todos" || t.getAttribute("data-estilo") === f;
        t.classList.toggle("is-out", !ok);
        if (ok) { n++; t.classList.remove("is-in");
          requestAnimationFrame(function () { t.style.transitionDelay = (n * .04) + "s"; t.classList.add("is-in"); }); }
      });
      track("portfolio_filtro", { estilo: f });
    });
  }

  /* --- bastidor --- */
  var bast = $("#bastGrid");
  if (bast) (CFG.processo || []).forEach(function (p, i) {
    var f = document.createElement("figure");
    f.className = "bast__card reveal-scale"; f.setAttribute("data-d", i);
    f.innerHTML = fig(p.img, p.alt, "(max-width:760px) 92vw, 420px") +
      "<figcaption><b>" + p.legenda + "</b><p>" + p.nota + "</p></figcaption>";
    bast.appendChild(f);
    revealAll([f]);
  });

  /* --- depoimentos (só se houver reais) --- */
  (function depo() {
    var d = CFG.depoimentos || {}, sec = $("#depoimentos");
    if (!sec || !d.ativo || !d.lista || !d.lista.length) return;
    sec.hidden = false;
    var lista = $("#depoList");
    d.lista.forEach(function (x) {
      var el = document.createElement("blockquote");
      el.className = "depo__card reveal-up";
      el.innerHTML = "<p>" + x.texto + "</p><b>" + x.nome + "</b>" +
        (x.peca ? "<small>" + x.peca + "</small>" : "");
      lista.appendChild(el); revealAll([el]);
    });
    if (d.googleUrl) {
      var g = $("#depoGoogle"); g.hidden = false;
      g.innerHTML = '<a href="' + d.googleUrl + '" target="_blank" rel="noopener">Ver todas as avaliações no Google</a>';
    }
  })();

  /* ---------------------------------------------------------------
     9. LIGHTBOX
  --------------------------------------------------------------- */
  var lb = $("#lb"), lbMedia = $("#lbMedia"), lbCap = $("#lbCap"), atual = -1;

  function pinta(i) {
    var o = OBRAS[i]; if (!o) return;
    atual = i;
    lbMedia.innerHTML = fig(o.img, o.alt, "(max-width:900px) 94vw, 880px");
    lbCap.innerHTML = "<b>" + o.titulo + "</b><em>" + o.palavra + "</em> — " + o.significado +
      "<small>" + [o.local, NOMES[o.estilo] || ""].filter(Boolean).join(" · ") +
      (o.tratada ? " · Foto tratada, tatuagem real." : "") + "</small>";
  }
  function abreLB(i) {
    if (!lb) return;
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("is-on"); });
    document.body.classList.add("is-locked");
    pinta(i); $("#lbX").focus();
    track("portfolio_ampliar", { peca: OBRAS[i] && OBRAS[i].img });
  }
  function fechaLB() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("is-on");
    document.body.classList.remove("is-locked");
    setTimeout(function () { lb.hidden = true; lbMedia.innerHTML = ""; }, 380);
  }
  function anda2(d) { pinta((atual + d + OBRAS.length) % OBRAS.length); }
  if (lb) {
    $("#lbX").addEventListener("click", fechaLB);
    $("#lbPrev").addEventListener("click", function () { anda2(-1); });
    $("#lbNext").addEventListener("click", function () { anda2(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) fechaLB(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") fechaLB();
      if (e.key === "ArrowLeft") anda2(-1);
      if (e.key === "ArrowRight") anda2(1);
    });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) anda2(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* --- FAQ: abre um, fecha os outros --- */
  var faq = $$(".acc__item");
  faq.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      track("faq_abrir", { pergunta: (d.querySelector("summary span") || {}).textContent });
      faq.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------------------------------------------------------------
     10. AGENDAMENTO — 3 passos, upload, servidor + WhatsApp
  --------------------------------------------------------------- */
  var form = $("#form");
  if (form) {
    var passos = $$(".fs", form), fill = $("#formFill");
    var agora = $("#stepNow"), nomePasso = $("#stepName");
    var bPrev = $("#prev"), bNext = $("#next"), bSend = $("#send"), erro = $("#err");
    var NOMES_PASSO = { 1: "o projeto", 2: "a pele", 3: "a agenda" };
    var passo = 1, enviando = false, arquivos = [];

    var d = { nome:"", estilo:"", ideia:"", local:"", tamanho:"15", primeira:false,
              cobertura:false, whatsapp:"", quando:[], data:"", observacoes:"" };

    /* ---- chips ---- */
    function chipsUnico(id, campo, hidden) {
      var box = $(id); if (!box) return;
      $$("button", box).forEach(function (x, i) { x.tabIndex = i ? -1 : 0; });
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-v]"); if (!b) return;
        $$("button", box).forEach(function (x) {
          x.setAttribute("aria-checked", String(x === b)); x.tabIndex = x === b ? 0 : -1;
        });
        d[campo] = b.getAttribute("data-v");
        if (hidden) $(hidden).value = d[campo];
        box.classList.remove("has-err"); previa();
      });
      box.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var bs = $$("button", box), i = bs.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        var alvo = bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length];
        alvo.focus(); alvo.click();
      });
    }
    chipsUnico("#chipsEstilo", "estilo", "#fEstilo");
    chipsUnico("#chipsLocal", "local", "#fLocal");

    var boxQ = $("#chipsQuando");
    if (boxQ) boxQ.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-v]"); if (!b) return;
      var v = b.getAttribute("data-v"), on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", String(!on));
      if (on) d.quando = d.quando.filter(function (x) { return x !== v; });
      else d.quando.push(v);
      $("#fQuando").value = d.quando.join(", ");
      boxQ.classList.remove("has-err"); previa();
    });

    /* ---- campos ---- */
    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t.name && t.name in d && t.type !== "checkbox" && t.type !== "file") d[t.name] = t.value;
      if (t.id === "size") {
        var v = parseInt(t.value, 10);
        $("#sizeOut").textContent = v + " cm";
        $("#rulerBar").style.width = ((v - 3) / 42 * 100).toFixed(1) + "%";
        d.tamanho = String(v);
      }
      if (t.id === "fone") { t.value = mascara(t.value); d.whatsapp = t.value; }
      var f = t.closest(".field, .check"); if (f) f.classList.remove("has-err");
      previa();
    });
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.type === "checkbox" && t.name in d) d[t.name] = t.checked;
      previa();
    });

    function mascara(v) {
      v = v.replace(/\D/g, "").slice(0, 11);
      if (v.length <= 2) return v.replace(/(\d{0,2})/, "($1");
      if (v.length <= 6) return v.replace(/(\d{2})(\d{0,4})/, "($1) $2");
      if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    /* ---- upload de referências ---- */
    var inpRefs = $("#refs"), prev = $("#refsPrev"), drop = $("#drop");
    var MAX_ARQ = 4, MAX_MB = 6;

    function sincroniza() {
      var dt = new DataTransfer();
      arquivos.forEach(function (f) { dt.items.add(f); });
      inpRefs.files = dt.files;
    }
    function desenhaPrev() {
      prev.innerHTML = "";
      arquivos.forEach(function (f, i) {
        var fig = document.createElement("figure");
        var url = URL.createObjectURL(f);
        fig.innerHTML = '<img src="' + url + '" alt="Referência ' + (i + 1) + '">' +
          '<button type="button" aria-label="Remover imagem">✕</button>';
        fig.querySelector("button").addEventListener("click", function () {
          URL.revokeObjectURL(url);
          arquivos.splice(i, 1); sincroniza(); desenhaPrev(); previa();
        });
        prev.appendChild(fig);
      });
    }
    if (inpRefs) {
      inpRefs.addEventListener("change", function () {
        var novos = Array.prototype.slice.call(inpRefs.files);
        novos.forEach(function (f) {
          if (arquivos.length >= MAX_ARQ) return toast("Máximo de " + MAX_ARQ + " imagens");
          if (f.size > MAX_MB * 1024 * 1024) return toast("Imagem acima de " + MAX_MB + " MB");
          if (!/^image\//.test(f.type)) return toast("Só imagens, por favor");
          arquivos.push(f);
        });
        sincroniza(); desenhaPrev(); previa();
        track("form_upload", { qtd: arquivos.length });
      });
      ["dragover", "dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) {
          e.preventDefault();
          drop.classList.toggle("is-over", ev === "dragover");
          if (ev === "drop" && e.dataTransfer && e.dataTransfer.files.length) {
            Array.prototype.slice.call(e.dataTransfer.files).forEach(function (f) {
              if (arquivos.length < MAX_ARQ && /^image\//.test(f.type) && f.size <= MAX_MB * 1024 * 1024) arquivos.push(f);
            });
            sincroniza(); desenhaPrev(); previa();
          }
        });
      });
    }

    /* ---- mensagem ---- */
    function mensagem() {
      var L = ["Olá, André. Vim pelo site e quero agendar uma avaliação.", ""];
      if (d.nome)     L.push("Nome: " + d.nome.trim());
      if (d.estilo)   L.push("Estilo: " + d.estilo);
      if (d.ideia)    L.push("Ideia: " + d.ideia.trim().replace(/\s+/g, " "));
      if (d.local)    L.push("Região do corpo: " + d.local);
      if (d.tamanho)  L.push("Tamanho aproximado: " + d.tamanho + " cm");
      if (d.cobertura) L.push("É cobertura de uma tattoo antiga.");
      if (d.primeira)  L.push("É a minha primeira tatuagem.");
      if (arquivos.length) L.push("Enviei " + arquivos.length + " imagem(ns) de referência pelo site.");
      if (d.quando.length) L.push("Disponibilidade: " + d.quando.join(", "));
      if (d.data)     L.push("Data desejada: " + dataBR(d.data));
      if (d.observacoes) L.push("Observações: " + d.observacoes.trim().replace(/\s+/g, " "));
      L.push("", "Tenho 18 anos ou mais.");
      return L.join("\n");
    }
    function dataBR(v) {
      var p = (v || "").split("-");
      return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : v;
    }
    function previa() {
      var p = $("#previewTxt"); if (!p) return;
      var algo = d.nome || d.estilo || d.ideia || d.local || d.quando.length;
      p.textContent = algo ? mensagem() : "Vá preenchendo ao lado — a mensagem se monta aqui.";
    }

    /* ---- validação ---- */
    function valida(n) {
      var ok = true; erro.textContent = "";
      if (n === 1) {
        var nome = form.querySelector('[name="nome"]'), ideia = form.querySelector('[name="ideia"]');
        if (!nome.value.trim()) { marca(nome); ok = false; }
        if (!ideia.value.trim()) { marca(ideia); ok = false; }
        if (!d.estilo) { $("#chipsEstilo").classList.add("has-err"); ok = false; }
        if (!ok) erro.textContent = "Preencha nome, estilo e a ideia para continuar.";
      }
      if (n === 2 && !d.local) {
        $("#chipsLocal").classList.add("has-err"); ok = false;
        erro.textContent = "Escolha a região do corpo.";
      }
      if (n === 3) {
        var fone = $("#fone"), idade = form.querySelector('[name="idade"]');
        if (fone.value.replace(/\D/g, "").length < 10) { marca(fone); ok = false;
          erro.textContent = "Confira o seu WhatsApp com DDD."; }
        if (!d.quando.length) { $("#chipsQuando").classList.add("has-err"); ok = false;
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
      if (nomePasso) nomePasso.textContent = NOMES_PASSO[passo];
      bPrev.disabled = passo === 1;
      bNext.hidden = passo === 3;
      bSend.hidden = passo !== 3;
      erro.textContent = "";
      if (!mover) return;
      track("form_passo" + passo);
      var topo = form.getBoundingClientRect().top + window.pageYOffset - navH() - 20;
      if (form.getBoundingClientRect().top < 0) window.scrollTo({ top: topo, behavior: REDUCE ? "auto" : "smooth" });
      if (TOUCH) return;
      var foco = $(".fs.is-on input, .fs.is-on textarea, .fs.is-on button", form);
      if (foco) foco.focus({ preventScroll: true });
    }
    bNext.addEventListener("click", function () { if (valida(passo)) vai(passo + 1, true); });
    bPrev.addEventListener("click", function () { vai(passo - 1, true); });
    form.addEventListener("focusin", function once() { track("form_inicio"); form.removeEventListener("focusin", once); });

    /* ---- envio: abre o WhatsApp na hora e grava no servidor em paralelo ---- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (enviando || !valida(3)) return;
      enviando = true;
      bSend.querySelector("span").textContent = "Enviando...";

      var texto = mensagem();
      var url = waLink(texto);
      /* abre dentro do gesto do clique, senão o navegador bloqueia.
         sem "noopener" aqui porque precisamos saber se abriu — e limpamos o opener na sequência */
      var win = window.open(url, "_blank");
      if (win) { try { win.opener = null; } catch (err) {} }

      var fd = new FormData(form);
      fd.set("resumo", texto);
      fetch("/", { method: "POST", body: fd })
        .then(function (r) { return r.ok ? "ok" : "falhou"; })
        .catch(function () { return "falhou"; })
        .then(function (res) {
          track("form_envio", { servidor: res, imagens: arquivos.length });
          form.classList.add("is-sent");
          bSend.querySelector("span").textContent = "Enviado";
          toast(NUM ? "Pedido enviado — confira o WhatsApp" : "Pedido enviado");
          if (!win) location.href = url;                  /* popup bloqueado: vai direto */
          enviando = false;
        });
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
        navigator.clipboard.writeText(txt).then(function () { toast("Mensagem copiada"); },
          function () { antigo(); toast("Mensagem copiada"); });
      } else { antigo(); toast("Mensagem copiada"); }
      track("form_copiar");
    });

    var direto = $("#waDireto");
    if (direto) { direto.href = waLink("Olá, André. Vim pelo site e queria conversar sobre uma tatuagem.");
      direto.target = "_blank"; direto.rel = "noopener"; }

    vai(1); previa();
  }

  /* ---------------------------------------------------------------
     11. TOAST
  --------------------------------------------------------------- */
  var tEl = $("#toast"), tTimer = null;
  function toast(msg) {
    if (!tEl) return;
    tEl.textContent = msg; tEl.classList.add("is-on");
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { tEl.classList.remove("is-on"); }, 2800);
  }

  onScroll();
})();
