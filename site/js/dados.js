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

  /* ---------- 2. FORMULÁRIO ----------
     Para onde o pedido é enviado antes de abrir o WhatsApp.
     É o endereço do fluxo "Leads do site" no n8n.
     ATENÇÃO: endereço de ngrok gratuito muda quando o n8n reinicia.
     Se o formulário parar de gravar, é só trocar esta linha.
     Vazio = o site só abre o WhatsApp, sem gravar nada. */
  webhook: "https://unsaddle-arrange-track.ngrok-free.dev/webhook/lead-andre-tattoo",

  /* ---------- 3. DÚVIDAS ----------
     Respondem antes do formulário: quem chega no WhatsApp já chega decidido.
     REGRA: nenhum valor, nenhuma faixa de preço, nenhum "a partir de".
     Preço é conversa sua com o cliente, não conteúdo de site. */
  duvidas: [
    { p:"Como funciona o sinal?",
      r:"O sinal reserva a sua data na agenda e é abatido na sessão. Ele <strong>não é devolvido em cancelamento ou reagendamento</strong>: aquele dia sai da agenda e não volta a ser vendido. Combino tudo com você antes." },
    { p:"E o retoque?",
      r:"A partir de 40 dias da sessão, se for necessário, depois de eu avaliar por foto ou pessoalmente. Falha minha na aplicação, eu refaço. Área inflamada ou desgastada por cuidado inadequado precisa ser refeita do zero — explico isso antes, para não ter susto depois." },
    { p:"Dá para cobrir uma tatuagem antiga?",
      r:"Na maioria dos casos, sim. Mande uma foto da peça atual com boa luz: eu digo o que é possível esconder, se vale clarear antes e quais desenhos funcionam naquele formato. Cobertura exige honestidade — se não for dar bom resultado, eu falo." },
    { p:"Quanto tempo leva para ter o desenho?",
      r:"O desenho é feito depois da data marcada, e você vê antes da sessão. Ajuste faz parte: mexemos no que for preciso antes de aplicar o stencil. O que não dá é redesenhar o projeto inteiro na cadeira." },
    { p:"Como é a higiene no estúdio?",
      r:"Agulhas e insumos descartáveis, abertos na sua frente a cada sessão. Atendimento com hora marcada, em ambiente reservado." },
    { p:"Você faz maori?",
      r:"Não. É um estilo de alta dificuldade, com repertório próprio, e prefiro não entregar o aproximado. Se é isso que você quer, posso tentar indicar alguém." },
    { p:"Menor de idade pode tatuar?",
      r:"Não atendo menores de 18 anos, com ou sem autorização dos pais. Traga documento com foto no dia da sessão." },
    { p:"Como me preparo para a sessão?",
      r:"Durma bem, coma antes de vir e evite álcool nas 24 horas anteriores. Roupa confortável que dê acesso à região. Sessão longa tem pausa — é só pedir. Pode trazer um acompanhante." }
  ],

  /* ---------- 4. GOOGLE ----------
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
    { img:"justica",  cap:"Realismo · Dama da Justiça", alt:"Dama da Justiça com balança e espada, em realismo preto e cinza no antebraço" },
    { img:"retrato-oculos", cap:"Realismo · Retrato",   alt:"Retrato masculino de óculos em realismo preto e cinza, com respingos de tinta, na panturrilha" },
    { img:"samurai",  cap:"Braço fechado · Samurai",   alt:"Braço fechado em realismo preto e cinza com samurai, dragão e portal" },
    { img:"poseidon", cap:"Realismo · Poseidon",       alt:"Rosto de Poseidon com tridente e grega, em realismo preto e cinza no antebraço" },
    { img:"leao",     cap:"Realismo · Leão",           alt:"Leão em realismo preto e cinza no antebraço, com cruz e figura em oração entre as nuvens" },
    { img:"fera",     cap:"Blackwork · Pontilhismo",   alt:"Peça em blackwork com sombreado em pontilhismo no antebraço" },
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
