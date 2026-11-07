/* Paginas de conteudo: liga WhatsApp, Instagram e o ano do rodape.
   Todo o conteudo das paginas esta no HTML — este arquivo nao escreve texto,
   para a pagina continuar completa se o script nao carregar. */
(function () {
  "use strict";
  var CFG = window.SITE || {};
  var NUM = (CFG.whatsapp || "").replace(/\D/g, "");
  var IG  = "https://www.instagram.com/" + (CFG.instagram || "andretatuadoor") + "/";
  var TXT = "Olá, André. Vim por uma página do site e queria falar sobre um projeto.";

  Array.prototype.forEach.call(document.querySelectorAll("[data-ig]"), function (a) {
    a.href = IG; a.target = "_blank"; a.rel = "noopener";
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-wa]"), function (a) {
    a.href = NUM ? "https://wa.me/" + NUM + "?text=" + encodeURIComponent(TXT) : IG;
    a.target = "_blank"; a.rel = "noopener";
  });
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
