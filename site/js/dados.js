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
    /* Esta precisa chegar diferente das outras: quando ela aparecer no seu
       WhatsApp, você tem que saber na primeira linha que é alguém decidido a
       entrar no clube, e não mais um orçamento de tattoo. */
    clube:   "Oi, André! QUERO ENTRAR NO CLUBE 15. Li o regulamento no site e quero uma das quinze vagas. Ainda tem?",
    /* usada sozinha quando as 15 vagas estão ocupadas */
    clubeEspera: "Oi, André! QUERO ENTRAR NO CLUBE 15, mas vi no site que as quinze vagas estão ocupadas. Me coloca na lista de espera?"
  },

  /* ---------- 1b. MEDIÇÃO ----------
     Os dois campos abaixo são a ÚNICA coisa que você precisa colar para o site
     começar a medir. Enquanto estiverem vazios, nada é carregado e nada é
     enviado: o site funciona igual, só não conta nada.

     ga4:   código do Google Analytics, começa com G-
            (analytics.google.com > Administrador > Fluxos de dados > Web)
     pixel: código do Pixel da Meta, uns 15 dígitos
            (facebook.com/events_manager2 > Conjuntos de dados, do tipo Web)

     Nenhum dos dois é senha: os dois ficam visíveis no código de qualquer site
     que os usa. Pode colar aqui sem medo.

     O que é medido NÃO é visita, é contato: clique no WhatsApp (com o botão de
     onde saiu), formulário enviado e interesse no Clube 15. Visita não paga
     conta. Conversa paga. */
  medicao: {
    ga4:   "G-81HPQZ847M",
    pixel: "2572740583206164"
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
    total: "230",                       // vazio não mostra a contagem
                                        // conferido no Perfil da Empresa em 08/11/2026.
                                        // Este número é escrito à mão: reveja de vez em
                                        // quando, ou deixe vazio para não envelhecer.
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
    resumo: "O Clube 15 é um grupo fechado de quinze clientes. A entrada é paga uma vez só e volta pra você, abatida da sua próxima tattoo. A vaga é sua enquanto quiser, e enquanto as quinze estiverem ocupadas, ninguém entra.",

    /* o que o membro leva. São seis: o site desenha em duas fileiras de três. */
    inclui: [
      { t:"A entrada vira crédito",
        d:"O que você paga para entrar é abatido da sua próxima tattoo. Na prática, a vaga não te custa nada a mais." },
      { t:"Agenda antes de todo mundo",
        d:"Datas novas eu solto primeiro no WhatsApp, só para os quinze. Quem responde primeiro escolhe primeiro." },
      { t:"Projeto que não se repete",
        d:"O desenho é autoral e não vai para mais ninguém. Nem parecido." },
      { t:"Canal direto comigo",
        d:"Você fala comigo, não com recado. Dúvida de cuidado, ideia nova, remarcação." }
    ],

    /* todo o esquema por escrito: é isto que a pessoa lê antes de decidir */
    regras: [
      { p:"Quantas vagas são?",
        r:"Quinze, e o número não muda. Quando as quinze estão ocupadas, a entrada fecha e só reabre se alguém sair." },
      { p:"Como eu entro?",
        r:"Pelo botão desta página. Você me chama no WhatsApp, eu confirmo se tem vaga aberta e combino tudo com você por lá." },
      { p:"Quanto custa a entrada?",
        r:"O valor eu passo na conversa. E ele não é um custo a mais: a entrada é <strong>abatida da sua próxima tattoo</strong>. Valor de tattoo e de clube eu não publico no site, isso é conversa minha com você." },
      { p:"Como funciona esse abatimento?",
        r:"O que você pagou para entrar é descontado do valor da tattoo que você vier fazer comigo. Combinamos isso por escrito no WhatsApp antes de você pagar qualquer coisa." },
      { p:"Como funciona a prioridade na agenda?",
        r:"Quando eu abro datas novas, mando primeiro no WhatsApp, só para os quinze. Atendo <strong>por ordem de resposta, um de cada vez</strong>: quem responde primeiro escolhe primeiro, e enquanto eu estou fechando com uma pessoa as outras esperam a vez. O que sobrar vai para o público." },
      { p:"É mensalidade?",
        r:"Não. Você paga uma vez, na entrada, e não tem cobrança nova depois." },
      { p:"A vaga é minha até quando?",
        r:"Enquanto você quiser. Não tem renovação nem prazo para acabar." },
      { p:"Posso passar a minha vaga para outra pessoa?",
        r:"Não. A vaga é pessoal e não transfere." },
      { p:"E se eu quiser sair?",
        r:"É só me avisar. A vaga volta para a fila e quem está esperando entra." },
      { p:"Membro ainda paga a sessão?",
        r:"Paga, já com a entrada abatida. O clube trata de prioridade na agenda e de projeto exclusivo." }
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
