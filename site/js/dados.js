/* =====================================================================
   ANDRE TATTOO — dados do site
   Este é o ÚNICO arquivo que precisa ser editado no dia a dia.
   Galeria, avaliações e contato saem daqui.
   ===================================================================== */

window.DADOS = {

  /* ---------- 1. CONTATO ---------- */
  whatsapp: "5511982713543",            // DDI + DDD + número, só dígitos
  telefone: "(11) 98271-3543",          // como aparece escrito no rodapé
  instagram: "andretatuadoor",
  tiktok: "andretattoo.ink",
  /* Mensagem que já vem escrita quando a pessoa abre o WhatsApp pelo site.
     Cada botão manda uma versão diferente: assim, pela frase, você sabe de
     onde ela saiu — quem escreve "vi os trabalhos" já desceu a página
     inteira e chega mais quente que quem clicou no topo. */
  mensagem: "Oi, André! Vim pelo site e quero fazer uma tattoo.",
  mensagens: {
    topo:    "Oi, André! Vim pelo site e quero fazer uma tattoo.",
    obras:   "Oi, André! Vi os trabalhos no site e quero fazer uma tattoo.",
    estudio: "Oi, André! Vim pelo site e queria saber como agendar.",
    barra:   "Oi, André! Vim pelo site e quero fazer uma tattoo."
  },

  /* ---------- 2. GOOGLE ----------
     nota e total aparecem no bloco de avaliações.
     url: link do Perfil da Empresa (botão "Ver no Google"); vazio esconde o botão.
     avaliacoes: SÓ texto real de cliente. Lista vazia = nenhum card aparece.
  ------------------------------------- */
  google: {
    nota: "5,0",
    total: "228",                       // vazio não mostra a contagem
    url: "https://share.google/JyrQZJZmjx97Fmlcr",

    /* Avaliações REAIS, copiadas do Perfil da Empresa no Google.
       Limpeza permitida: tirar emoji e saudação, corrigir ortografia.
       Proibido: reescrever, resumir com palavras novas ou citar preço. */
    avaliacoes: [
      { nome:"Estéphane P.", quando:"há 3 anos",
        texto:"Melhor tatuador. Não troco por nada, mesmo morando do outro lado da cidade. 17 tatuagens feitas com ele foram poucas, tenho uma lista ainda pra fazer. E sempre com muita paciência e força de vontade." },
      { nome:"Roger R.", quando:"há 2 anos",
        texto:"O André é super atencioso, me ajudou a escolher o desenho pra minha tatuagem com toda a paciência do mundo. Muito talentoso, desenha bem pra caramba e tem a mão bem leve. Super recomendo." },
      { nome:"Kauê", quando:"há 3 anos",
        texto:"Local muito bom, a preparação e a higienização de tudo. O André é sensacional no que faz. Mesmo eu com um pouco de medo, me fez sentir confortável — e quando pensei que não, já tinha acabado. Com certeza irei mais vezes." },
      { nome:"Luis A.", quando:"há 2 anos",
        texto:"Excelente profissional. Fiquei totalmente satisfeito com minha tatuagem e já vamos agendar mais. Pra quem procura um profissional, pode confiar." },
      { nome:"Dayanne L.", quando:"há 3 anos",
        texto:"Melhor tatuador da região, super cuidadoso e educado, os traços são perfeitos. Obrigado André pelo trabalho, aguardo ansiosamente para fazer outro." },
      { nome:"Renê S.", quando:"há 3 anos",
        texto:"Excelente profissional, muito criativo, várias ideias e projetos, cara humilde. Fiz algumas tatuagens e com certeza vou fazer mais." }
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
