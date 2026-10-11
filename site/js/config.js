/* =====================================================================
   ANDRE TATTOO — configuração do site
   Este é o único arquivo que precisa ser editado no dia a dia.
   ===================================================================== */

window.SITE = {
  /* ---------------------------------------------------------------
     1. CONTATO  — PREENCHER o WhatsApp antes de publicar.
     Formato: código do país + DDD + número, só dígitos. Ex.: 5511912345678
     Enquanto estiver vazio, os botões de orçamento levam ao Direct
     do Instagram em vez de abrir um WhatsApp inexistente.
  --------------------------------------------------------------- */
  whatsapp: "",
  instagram: "andretatuadoor",
  email: "",

  /* ---------------------------------------------------------------
     2. ESTÚDIO
  --------------------------------------------------------------- */
  estudio: {
    endereco: "Av. Melchert, 606 — Vila Matilde",
    cidade: "São Paulo, SP",
    horario: "Segunda a sábado, 9h às 22h",
    atendimento: "Com hora marcada",
    maps: "https://www.google.com/maps/search/?api=1&query=Av.+Melchert,+606+-+Vila+Matilde,+Sao+Paulo"
  },

  /* ---------------------------------------------------------------
     3. PORTFÓLIO
     Para publicar uma tattoo: salve a foto em  img/portfolio/
     e acrescente uma linha aqui. Nada mais precisa ser mexido.

       src   : caminho do arquivo (deixe "" para o espaço ficar reservado)
       alt   : descrição da imagem (acessibilidade e Google)
       titulo: até 3 palavras, caixa alta no site
       palavra: a palavra em cursiva dourada (o elemento)
       significado: até 8 palavras
       estilo: "realismo" | "fineline" | "colorido" | "coverup" | "delicado"
       local : região do corpo
       tratada: true se a foto passou por tratamento de fundo e luz por IA
                (acrescenta o aviso "Foto tratada, tatuagem real.")
  --------------------------------------------------------------- */
  portfolio: [
    { src: "", alt: "Leão em realismo preto e cinza no antebraço", titulo: "Força Serena", palavra: "leão", significado: "Coragem que não precisa rugir", estilo: "realismo", local: "Antebraço", tratada: false },
    { src: "", alt: "Lírio em fine line no braço", titulo: "Pureza e Recomeço", palavra: "lírio", significado: "O que floresce depois do inverno", estilo: "fineline", local: "Braço", tratada: true },
    { src: "", alt: "Retrato em realismo preto e cinza nas costas", titulo: "Memória Viva", palavra: "retrato", significado: "Quem a gente carrega na pele", estilo: "realismo", local: "Costas", tratada: false },
    { src: "", alt: "Rosa delicada em fine line na costela", titulo: "Delicadeza Firme", palavra: "rosa", significado: "Beleza que escolheu ter espinhos", estilo: "delicado", local: "Costela", tratada: false },
    { src: "", alt: "Cobertura de tatuagem antiga em preto e cinza", titulo: "Virada de Página", palavra: "cover-up", significado: "A pele aceita ser reescrita", estilo: "coverup", local: "Ombro", tratada: false },
    { src: "", alt: "Beija-flor em aquarela no ombro", titulo: "Movimento Leve", palavra: "aquarela", significado: "Cor que respira junto com a pele", estilo: "colorido", local: "Ombro", tratada: false },
    { src: "", alt: "Olho em realismo preto e cinza com alto contraste", titulo: "Olhar Direto", palavra: "realismo", significado: "Luz e sombra no lugar exato", estilo: "realismo", local: "Braço", tratada: false },
    { src: "", alt: "Composição floral fine line no antebraço", titulo: "Linha Contínua", palavra: "fine line", significado: "O mínimo dito com precisão", estilo: "fineline", local: "Antebraço", tratada: false }
  ],

  /* ---------------------------------------------------------------
     4. FOTOS DO ARTISTA E DO ESTÚDIO (opcional)
     Salve em img/estudio/ e aponte aqui. "" deixa o espaço reservado.
     retrato      -> foto que aparece na seção "Sobre"
     fotosEstudio -> três fotos do ambiente (ordem: ambiente, bancada, detalhe)
  --------------------------------------------------------------- */
  retrato: "",
  fotosEstudio: ["", "", ""]
};
