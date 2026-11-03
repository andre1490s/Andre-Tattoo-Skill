/* =====================================================================
   ANDRE TATTOO · dados do site
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
     onde ela saiu. Quem escreve "vi os trabalhos" já desceu a página
     inteira e chega mais quente que quem clicou no topo. */
  mensagem: "Oi, André! Vim pelo site e quero fazer uma tattoo.",
  mensagens: {
    topo:    "Oi, André! Vim pelo site e quero fazer uma tattoo.",
    obras:   "Oi, André! Vi os trabalhos no site e quero fazer uma tattoo.",
    estudio: "Oi, André! Vim pelo site e queria saber como agendar.",
    barra:   "Oi, André! Vim pelo site e quero fazer uma tattoo.",
    clube:   "Oi, André! Vim pelo site e quero entrar no Clube 15. Ainda tem vaga?",
    /* usada sozinha quando as 15 vagas estão ocupadas */
    clubeEspera: "Oi, André! O Clube 15 está cheio. Quero entrar na lista de espera."
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
    { p:"Quanto tempo leva para ter o desenho?",
      r:"O desenho é feito depois da data marcada, e você vê antes da sessão. Ajuste faz parte: mexemos no que for preciso antes de aplicar o stencil. O que não dá é redesenhar o projeto inteiro na cadeira." },
    { p:"Como é a higiene no estúdio?",
      r:"Agulhas e insumos descartáveis, abertos na sua frente a cada sessão. Atendimento com hora marcada, em ambiente reservado." },
    { p:"Como me preparo para a sessão?",
      r:"Durma bem, coma antes de vir e evite álcool nas 24 horas anteriores. Roupa confortável que dê acesso à região. Sessão longa tem pausa, é só pedir. Pode trazer um acompanhante." }
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
      { nome:"Estéphane P.",
        texto:"Melhor tatuador. Não troco por nada, mesmo morando do outro lado da cidade. 17 tatuagens feitas com ele foram poucas, tenho uma lista ainda pra fazer. E sempre com muita paciência e força de vontade." },
      { nome:"Roger R.",
        texto:"O André é super atencioso, me ajudou a escolher o desenho pra minha tatuagem com toda a paciência do mundo. Muito talentoso, desenha bem pra caramba e tem a mão bem leve. Super recomendo." },
      { nome:"Kauê",
        texto:"Local muito bom, a preparação e a higienização de tudo. O André é sensacional no que faz. Mesmo eu com um pouco de medo, me fez sentir confortável, e quando pensei que não, já tinha acabado. Com certeza irei mais vezes." },
      { nome:"Luis A.",
        texto:"Excelente profissional. Fiquei totalmente satisfeito com minha tatuagem e já vamos agendar mais. Pra quem procura um profissional, pode confiar." },
      { nome:"Dayanne L.",
        texto:"Melhor tatuador da região, super cuidadoso e educado, os traços são perfeitos. Obrigado André pelo trabalho, aguardo ansiosamente para fazer outro." },
      { nome:"Renê S.",
        texto:"Excelente profissional, muito criativo, várias ideias e projetos, cara humilde. Fiz algumas tatuagens e com certeza vou fazer mais." }
    ]
  },

  /* ---------- 5. CLUBE 15 ----------
     Grupo fechado de 15 clientes. Entrada paga uma vez só.
     A REGRA DA CASA VALE AQUI TAMBÉM: nenhum valor escrito no site.
     Quem quer entrar cai no WhatsApp e o valor sai na conversa.

     ocupadas: quantas das 15 já têm dono. É o ÚNICO número que você mexe
     no dia a dia; os quinze risquinhos do site se pintam sozinhos a partir
     dele. Mantenha honesto: escassez inventada queima a sua palavra, e
     cliente que descobre não volta.
  ------------------------------------- */
  clube: {
    vagas: 15,
    ocupadas: 0,

    chamada: "Quinze pessoas. Nem uma a mais.",
    resumo: "O Clube 15 é um grupo fechado de quinze clientes. A entrada é paga uma vez só e a vaga é sua enquanto você quiser. Enquanto as quinze estiverem ocupadas, ninguém entra.",

    /* o que o membro leva */
    inclui: [
      { t:"Agenda antes de todo mundo",
        d:"Quando o mês abre, a sua data já está separada. Você não disputa horário com ninguém." },
      { t:"Projeto que não se repete",
        d:"O desenho é autoral e não vai para mais ninguém. Nem parecido." },
      { t:"Retoque incluso",
        d:"O que precisar de ajuste depois da cicatrização entra na sua vaga." },
      { t:"Canal direto comigo",
        d:"Você fala comigo, não com recado. Dúvida de cuidado, ideia nova, remarcação." },
      { t:"Primeiro a ver",
        d:"Desenho novo que eu crio, membro vê antes de ir para o Instagram." }
    ],

    /* todo o esquema por escrito: é isto que a pessoa lê antes de decidir */
    regras: [
      { p:"Quantas vagas são?",
        r:"Quinze, e o número não muda. Quando as quinze estão ocupadas, a entrada fecha e só reabre se alguém sair." },
      { p:"Como eu entro?",
        r:"Pelo botão desta página. Você me chama no WhatsApp, eu confirmo se tem vaga aberta e combino tudo com você por lá." },
      { p:"Quanto custa a entrada?",
        r:"O valor eu passo na conversa, junto com tudo o que entra na sua vaga. Valor de tattoo e de clube eu não publico no site: isso é conversa minha com você." },
      { p:"É mensalidade?",
        r:"Não. Você paga uma vez, na entrada, e não tem cobrança nova depois." },
      { p:"A vaga é minha até quando?",
        r:"Enquanto você quiser. Não tem renovação nem prazo para acabar." },
      { p:"Posso passar a minha vaga para outra pessoa?",
        r:"Não. A vaga é pessoal e não transfere." },
      { p:"E se eu quiser sair?",
        r:"É só me avisar. A vaga volta para a fila e quem está esperando entra." },
      { p:"Membro ainda paga a sessão?",
        r:"Paga. O clube trata de prioridade na agenda, projeto exclusivo e retoque. A sessão a gente combina como sempre." }
    ]
  },

  /* ---------- 3. TRABALHOS ----------
     Para publicar uma peça nova:
     1) salve a foto em img/ (WebP, ~1200px de largura, até ~150 KB)
     2) copie uma linha abaixo e troque os dados
     Todas aparecem do mesmo tamanho, três por fileira. A ordem da lista é a
     ordem da galeria: as primeiras são as que mais aparecem.
  ------------------------------------- */
  trabalhos: [
    { img:"justica",  cap:"Realismo · Dama da Justiça", alt:"Dama da Justiça com balança e espada, em realismo preto e cinza no antebraço" },
    { img:"retrato-oculos", cap:"Realismo · Retrato",   alt:"Retrato masculino de óculos em realismo preto e cinza, com respingos de tinta, na panturrilha" },
    { img:"poseidon", cap:"Realismo · Poseidon",       alt:"Rosto de Poseidon com tridente e grega, em realismo preto e cinza no antebraço" },
    { img:"leao",     cap:"Realismo · Leão",           alt:"Leão em realismo preto e cinza no antebraço, com cruz e figura em oração entre as nuvens" },
    { img:"fera",     cap:"Blackwork · Pontilhismo",   alt:"Peça em blackwork com sombreado em pontilhismo no antebraço" },
    { img:"arcanjo",  cap:"Realismo · Arcanjo",        alt:"Arcanjo em realismo preto e cinza no antebraço" },
    { img:"rostos",   cap:"Realismo · Rostos",         alt:"Composição de rostos em realismo no antebraço" },
    { img:"retrato",  cap:"Realismo · Retrato",        alt:"Retrato realista no braço" },
    { img:"urso",     cap:"Realismo · Urso",           alt:"Urso com lua e montanhas em realismo no braço" },
    { img:"cigana",   cap:"Realismo · Cigana",         alt:"Cigana de capuz com lua na testa, segurando uma galáxia, em realismo preto e cinza no braço" },
    { img:"raposa",   cap:"Blackwork · Raposa",        alt:"Raposa em blackwork pela perna" },
    { img:"pet",      cap:"Realismo colorido · Pet",   alt:"Cachorrinho em realismo colorido com flores no antebraço" }
  ]
};
