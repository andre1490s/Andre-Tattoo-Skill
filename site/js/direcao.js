/* =====================================================================
   Direção "Carvão, Prata e Lâmina" — amostra (etapa 1)
   Lenis (rolagem com inércia) + GSAP/ScrollTrigger + a lente.
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUZ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOQUE = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- rolagem com inércia ---------- */
  if (!REDUZ) {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var alvo = document.querySelector(a.getAttribute("href"));
        if (!alvo) return;
        e.preventDefault(); lenis.scrollTo(alvo, { offset: 0 });
      });
    });
  }

  /* ---------- vídeo do topo ---------- */
  (function video() {
    var v = $("#vid"); if (!v) return;
    var con = navigator.connection || {};
    if (REDUZ || con.saveData === true || /2g/.test(con.effectiveType || "")) return;
    var movel = window.matchMedia("(max-width: 760px)").matches;
    var base = movel ? "video/hero-mobile" : "video/hero-desktop";
    [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(function (f) {
      var s = document.createElement("source");
      s.src = base + "." + f[0]; s.type = f[1]; v.appendChild(s);
    });
    v.load();
    v.addEventListener("canplay", function () {
      v.play().catch(function () {}); v.classList.add("on");
    }, { once: true });
  })();

  /* ---------- abertura ---------- */
  if (!REDUZ) {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.25 });
    tl.to(".mono__anel", { opacity: .9, strokeDashoffset: 0, duration: 1.5 })
      .to(".mono__a", { strokeDashoffset: 0, duration: 1.1 }, "-=1.05")
      /* varredura metálica: desloca o gradiente do traço */
      .fromTo(".mono__a", { attr: { "stroke-width": 7 } }, { attr: { "stroke-width": 5 }, duration: .7 }, "-=.5")
      .to(".nome__m em", { y: "0%", duration: 1.25, stagger: .11 }, "-=.9")
      .to("#dadoEntrada", { opacity: 1, duration: .9 }, "-=.6")
      .to(".fio i", { scaleY: 1, duration: 1.1 }, "-=.7");
  }

  /* ---------- parallax e revelações ---------- */
  if (!REDUZ) {
    gsap.to("#pecaImg", {
      yPercent: -12, ease: "none",
      scrollTrigger: { trigger: ".peca__quadro", start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.from(".ficha", {
      y: 48, opacity: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: ".ficha", start: "top 88%" }
    });
    gsap.utils.toArray(".cab, .lente, .paleta, .tipo, .fecho .h2, .fecho .apoio, .fecho .btn")
      .forEach(function (el) {
        gsap.from(el, {
          y: 26, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" }
        });
      });
    gsap.from(".cor", {
      y: 20, opacity: 0, duration: .8, stagger: .07, ease: "power3.out",
      scrollTrigger: { trigger: ".paleta", start: "top 88%" }
    });
  }

  /* ---------- A LENTE ---------- */
  (function lupa() {
    var cx = $("#lente"), img = $("#lenteImg"), vidro = $(".lente__vidro", cx);
    if (!cx || !img || !vidro) return;
    var Z = 2.4, r = 0, ligado = false;

    function medidas() {
      r = vidro.offsetWidth / 2;
      vidro.style.backgroundImage = "url(" + img.currentSrc + ")";
      vidro.style.backgroundSize = (img.clientWidth * Z) + "px " + (img.clientHeight * Z) + "px";
    }
    function move(x, y) {
      var c = cx.getBoundingClientRect();
      var px = Math.max(0, Math.min(c.width, x - c.left));
      var py = Math.max(0, Math.min(c.height, y - c.top));
      vidro.style.left = px + "px";
      vidro.style.top = py + "px";
      vidro.style.backgroundPosition = (-(px * Z - r)) + "px " + (-(py * Z - r)) + "px";
    }
    function liga(on) {
      ligado = on;
      vidro.classList.toggle("on", on);
      cx.classList.toggle("ativa", on);
    }

    if (img.complete) medidas(); else img.addEventListener("load", medidas);
    window.addEventListener("resize", medidas, { passive: true });

    if (!TOQUE) {
      cx.addEventListener("mouseenter", function (e) { medidas(); liga(true); move(e.clientX, e.clientY); });
      cx.addEventListener("mousemove", function (e) { if (ligado) move(e.clientX, e.clientY); });
      cx.addEventListener("mouseleave", function () { liga(false); });
    } else {
      cx.addEventListener("touchstart", function (e) {
        medidas(); liga(true); move(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      cx.addEventListener("touchmove", function (e) {
        if (!ligado) return;
        move(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      ["touchend", "touchcancel"].forEach(function (ev) {
        cx.addEventListener(ev, function () { liga(false); }, { passive: true });
      });
    }
    /* teclado: liga no centro */
    cx.addEventListener("focus", function () {
      var c = cx.getBoundingClientRect();
      medidas(); liga(true); move(c.left + c.width / 2, c.top + c.height / 2);
    });
    cx.addEventListener("blur", function () { liga(false); });
  })();
})();
