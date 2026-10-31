/* =====================================================================
   ANDRE TATTOO — configuração do site
   Único arquivo que precisa ser editado no dia a dia.
   ===================================================================== */

window.SITE = {

  /* ---------- 0. VISUAL ----------
     "escuro" = fundo preto (atual) | "claro" = fundo osso, estilo galeria  */
  tema: "escuro",

  /* ---------- 1. CONTATO ---------- */
  whatsapp: "5511982713543",          // DDI + DDD + número, só dígitos
  instagram: "andretatuadoor",

  /* ---------- 2. ESTÚDIO ---------- */
  estudio: {
    endereco: "Av. Melchert, 606 — Vila Matilde",
    cidade: "São Paulo, SP",
    horario: "Segunda a sábado, 9h às 22h",
    atendimento: "Somente com hora marcada",
    maps: "https://www.google.com/maps/search/?api=1&query=Av.+Melchert,+606+-+Vila+Matilde,+Sao+Paulo"
  },

  /* ---------- 3. PORTFÓLIO ----------
     Para publicar uma peça nova:
     1) salve a foto em img/portfolio/  (JPG e WEBP, 1200px e 640px de largura)
     2) copie uma linha abaixo e troque os dados.
     estilo: "realismo" | "fineline" | "blackwork" | "lettering"
     destaque: true  -> aparece também no slider do topo
  ------------------------------------- */
  portfolio: [
    { img:"retrato-bone",    estilo:"realismo",  local:"Braço",      titulo:"Memória Viva",       palavra:"retrato",       significado:"Quem a gente carrega na pele",        alt:"Retrato masculino em realismo preto e cinza no braço", destaque:true },
    { img:"nossa-senhora",   estilo:"realismo",  local:"Antebraço",  titulo:"Fé e Amparo",        palavra:"Nossa Senhora", significado:"Proteção que se carrega em silêncio", alt:"Nossa Senhora com coroa de espinhos e rosa em realismo preto e cinza", destaque:true },
    { img:"fada-fineline",   estilo:"fineline",  local:"Antebraço",  titulo:"Leveza e Recomeço",  palavra:"fada",          significado:"O que ainda acredita em magia",       alt:"Fada em fine line com pontilhismo no antebraço", destaque:true },
    { img:"raposa-perna",    estilo:"blackwork", local:"Perna",      titulo:"Astúcia Silenciosa", palavra:"raposa",        significado:"Inteligência que não faz barulho",    alt:"Raposa em blackwork com traços de aquarela preta na perna", destaque:true },
    { img:"cigana-braco",    estilo:"realismo",  local:"Braço",      titulo:"Mistério e Intuição",palavra:"cigana",        significado:"O que se enxerga de olhos fechados",  alt:"Cigana com manto e lua em realismo preto e cinza no braço", destaque:true },
    { img:"lirio-costas",    estilo:"fineline",  local:"Costas",     titulo:"Pureza e Recomeço",  palavra:"lírio",         significado:"O que floresce depois do inverno",    alt:"Lírio em fine line com sombreado suave nas costas", destaque:true },
    { img:"retrato-oculos",  estilo:"realismo",  local:"Panturrilha",titulo:"Olhar Direto",       palavra:"retrato",       significado:"Luz e sombra no lugar exato",         alt:"Retrato com óculos em realismo preto e cinza na panturrilha" },
    { img:"lirio-perna",     estilo:"fineline",  local:"Perna",      titulo:"Floração Contínua",  palavra:"lírios",        significado:"Beleza que atravessa a pele",         alt:"Composição de lírios em fine line na perna" }
  ],

  /* ---------- 4. PROCESSO (stencil -> resultado) ---------- */
  processo: [
    { img:"vaso-stencil", alt:"Stencil de vaso grego com rosas aplicado na costela",
      legenda:"Projeto nas costelas", nota:"Nada começa antes de você aprovar o desenho no espelho. Posição, escala e fluxo são decididos com a peça já na pele." }
  ],

  /* ---------- 5. DEPOIMENTOS ----------
     DESLIGADO até você me mandar depoimentos REAIS de clientes.
     Para ligar: ativo: true e preencha a lista (nome, texto, peça).
     Não invente nem use texto genérico — o cliente percebe.
  ------------------------------------- */
  depoimentos: {
    ativo: false,
    googleUrl: "",            // link do seu Perfil da Empresa no Google
    lista: [
      // { nome:"Marina", peca:"Lírio nas costas", texto:"..." },
    ]
  },

  /* ---------- 6. CLUBE 15 ----------
     Pré-reserva da agenda 2027. Regras completas em clube-15/REGULAMENTO.md.

     Para atualizar as DATAS e as VAGAS: abra o app Caixa > Mais > Clube 15 >
     "Datas para o site", copie o texto e troque este bloco inteiro por ele.

     assinatura: link de cobrança recorrente (Asaas, InfinitePay, Mercado Pago).
                 Enquanto estiver vazio, a página manda o cliente falar com você
                 no WhatsApp em vez de mostrar um botão de pagar que não existe.
  ------------------------------------- */
  clube: {
    ativo: true,
    assinatura: "",
    vagas: 15,
    ocupadas: 0,
    mensalidade: 150,
    atualizado: "",
    datas: [
      // { data:"2027-01-12", hora:"09:00", obs:"dia inteiro" },
    ]
  },

  /* ---------- 7. MEDIÇÃO (CRO) ----------
     Cole os IDs quando criar as contas. Vazio = nada é carregado.
  ------------------------------------- */
  analytics: { ga4: "", metaPixel: "" }
};
