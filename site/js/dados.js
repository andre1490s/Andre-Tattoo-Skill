/* =====================================================================
   ANDRE TATTOO — dados do site
   Este é o ÚNICO arquivo que precisa ser editado no dia a dia.
   Galeria, avaliações e contato saem daqui.
   ===================================================================== */

window.DADOS = {

  /* ---------- 1. CONTATO ---------- */
  whatsapp: "5511982713543",            // DDI + DDD + número, só dígitos
  instagram: "andretatuadoor",
  mensagem: "Oi Andre! Vim pelo site e quero fazer uma tattoo.",

  /* ---------- 2. GOOGLE ----------
     nota e total aparecem no bloco de avaliações.
     url: link do Perfil da Empresa (botão "Ver no Google"); vazio esconde o botão.
     avaliacoes: SÓ texto real de cliente. Lista vazia = nenhum card aparece.
  ------------------------------------- */
  google: {
    nota: "5,0",
    total: "",                          // ex.: "23" — vazio não mostra a contagem
    url: "",                            // ex.: "https://g.page/r/..."
    avaliacoes: [
      // { nome:"Marina", peca:"Lírio nas costas", texto:"..." },
    ]
  },

  /* ---------- 3. TRABALHOS ----------
     Para publicar uma peça nova:
     1) salve a foto em img/ (WebP, ~1200px de largura, até ~150 KB)
     2) copie uma linha abaixo e troque os dados
     A PRIMEIRA da lista é a peça grande da galeria — coloque ali o trabalho mais forte.
  ------------------------------------- */
  trabalhos: [
    { img:"samurai",  cap:"Braço fechado · Samurai",   alt:"Braço fechado em realismo preto e cinza com samurai, dragão e portal" },
    { img:"leao",     cap:"Realismo · Leão",           alt:"Leão em realismo preto e cinza no antebraço, com cruz e figura em oração entre as nuvens" },
    { img:"arcanjo",  cap:"Realismo · Arcanjo",        alt:"Arcanjo em realismo preto e cinza no antebraço" },
    { img:"rostos",   cap:"Realismo · Rostos",         alt:"Composição de rostos em realismo no antebraço" },
    { img:"retrato",  cap:"Realismo · Retrato",        alt:"Retrato realista no braço" },
    { img:"urso",     cap:"Realismo · Urso",           alt:"Urso com lua e montanhas em realismo no braço" },
    { img:"cigana",   cap:"Realismo · Cigana",         alt:"Cigana de capuz com lua na testa, segurando uma galáxia, em realismo preto e cinza no braço" },
    { img:"peitoral", cap:"Blackwork · Peitoral",      alt:"Fera em blackwork no peitoral" },
    { img:"raposa",   cap:"Blackwork · Raposa",        alt:"Raposa em blackwork pela perna" },
    { img:"pet",      cap:"Realismo colorido · Pet",   alt:"Cachorrinho em realismo colorido com flores no antebraço" }
  ]
};
