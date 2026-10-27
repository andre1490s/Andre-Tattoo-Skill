# Contexto de marca: André Tattoo

Fonte única de verdade para todas as skills. Se um fato mudar, atualize só aqui.
Itens marcados **[confirmar]** ainda não foram informados pelo André e não devem ser tratados como fato.

## Identidade
- Marca: André Tattoo. Instagram: @andretatuadoor.
- **YouTube:** canal **André Tatuador**, `youtube.com/@andretatuadoor` (criado pelo André em 18/10/2026). A marca do estúdio continua André Tattoo: o canal é um palco dela. Projeto, régua de monetização e prazo de 31/01/2027 em `youtube/`.
- Posicionamento principal: tatuagem de alto padrão, com forte ênfase em **realismo preto e cinza**.
- Outros trabalhos: fine line, aquarela, realismo colorido e trabalhos delicados/femininos.
- A marca deve transmitir qualidade, precisão, experiência, estética e confiança.
- Evitar na edição de vídeo: estética genérica de "vídeo de tatuador", excesso de efeitos, filtros, textos gigantes.

## Identidade visual dos posts (aprovada pelo André em 2026-10-09)
- **Padrão editorial:** foto real da tattoo tratada por IA só no fundo e na luz (fundo escuro, luz lateral quente, tinta preta e cinza neutra), formato 4:5. Textos no **canto superior esquerdo**: título serifado creme em caixa alta (até 3 palavras), palavra cursiva dourada (o nome do elemento), uma linha de significado (até 8 palavras) e rodapé centralizado só com **"ANDRE TATTOO"**.
- **Dois modos, mesma tipografia:** **Delicado** (fine line, floral, aquarela, peças femininas): preto, verde-musgo e marrom, luz de fim de tarde. **Intenso** (animais selvagens, religioso ou épico, peças agressivas): preto-carvão com fumaça e luz dura de claro-escuro, ar mais masculino.
- **A tattoo nunca é alterada pela IA.** Conferir lado a lado com a foto original antes de postar. Legenda de post com arte tratada inclui "Foto tratada, tatuagem real."
- **Legenda de portfólio:** foco no que o elemento representa em tatuagem, não na descrição da foto (técnica no máximo em meia linha).
- **Significado sempre presente:** história do cliente só com autorização; sem ela, o simbolismo tradicional do elemento, apresentado como simbolismo (tabela em `referencias/registro-arte-gemini.md`).
- **Como produzir:** skill `arte-post-gemini` (prompt pronto) e o app do Gemini (grátis). A API do Gemini não tem cota grátis para imagem.
- Referência aprovada: arte do lírio "PUREZA E RECOMEÇO".

## Primeira tela do perfil (aplicado pelo André em 2026-10-20)

Decisões já em produção no @andretatuadoor. Diagnóstico que as motivou: `aprendizados/LE-0008.md`. Plano: `PLANO-30-DIAS-INSTAGRAM.md`.

- **Foto de perfil: o rosto do André**, corte fechado, fundo escuro e luz lateral: o modo Intenso do padrão editorial. Nunca o logo: a marca é o nome dele e o que se contrata é a mão de uma pessoa. O logo completo perde as linhas finas no corte circular do Instagram.
- **O "A" do logo (sem o texto) é selo, não retrato.** Usar em: capas de destaque, último frame dos Reels, favicon do site, marca d'água discreta. O logo completo fica para site, cartão e impresso.
- **Versões do logo [pendência de design]:** falta a versão "marca": só o A, traço engrossado, sem o círculo fino e sem texto, para qualquer uso abaixo de 60px. A versão atual só funciona em tamanho grande.
- **Bio:** linha 1 carrega a promessa de recorrência ("Toda semana uma pele sendo transformada"), que é o motivo de seguir; linha 2 junta prova social e os serviços de ticket alto (coberturas e fechamentos); depois endereço e CTA. Sem preço, sem garantia de resultado.
- **Campo nome:** `André | Tatuagem Realista | Zona Leste SP`: indexado na busca, não mexer.
- **Destaques:** `PROCESSO` e `CUIDADOS` vêm antes dos transacionais, porque são os únicos que dão motivo para seguir em vez de pedir algo. Capas idênticas com o A funcionam até cinco destaques; acima disso, diferenciar.
- **`Indique e Ganhe` fica fora do ar** enquanto as regras do programa não existirem (ver "Indique e Ganhe" abaixo).
- **Os três posts fixados são Reels de transformação**, não fotos de peça pronta: portfólio confirma quem já decidiu, transformação recruta quem acabou de chegar.

## Objetivo comercial
Aumentar autoridade, atrair clientes com maior poder aquisitivo, elevar ticket e preencher a agenda com projetos de maior valor.

## Canal
Instagram como canal principal, salvo instrução diferente.

## Tom de voz
- Formal, com toques ocasionais de humor/comédia. **Sério e técnico quando o assunto é tattoo.**
- Quase nenhuma gíria.
- Emojis: quase nenhum (no máximo o mínimo necessário), para não parecer robô.
- Direto, brasileiro, natural, profissional, sem linguagem robótica ou corporativa excessiva.
- **Travessão e meia-risca: proibidos.** Nenhum texto que sai da marca usa o traço longo (em dash) nem o traço médio (en dash). Quebrar em duas frases, ou usar vírgula, dois-pontos ou parênteses. Motivo (dado pelo André em 2026-10-27): esse traço virou assinatura de texto gerado por IA e o perfil não pode passar essa impressão. Vale para legenda, carrossel, artigo, roteiro, mensagem de cliente, post, anúncio e qualquer outro material, sem exceção. Hífen de palavra composta (meio-tom, cover-up) continua normal. O `scripts/validar.py` cobra a regra: erro em material público, aviso no interno antigo.
- **Tratamento:** íntimo, pelo nome do cliente ou "você" (nunca "senhor/senhora").
- **Evolução do vínculo:** começa formal no primeiro contato e ganha intimidade ao longo da sessão, criando vínculo. Mensagens iniciais e de orçamento ficam no registro formal; pós-sessão e recorrência podem ser mais próximas.

## Regras de comunicação (valem para todas as skills)
- Nunca criar comunicação que pareça desespero por agenda ou desconto permanente.
- Descontos e ofertas devem ter motivo estratégico, prazo e limite.
- Não prometer resultados garantidos.
- Dados insuficientes: declarar a hipótese em vez de inventar números.
- **Preço em público:** nunca citar valor em post, comentário ou legenda (nem "a partir de"). Valor só na conversa privada, e sempre passado pelo André.
- **Anúncio pago (Meta Ads):** autorizado pelo André a partir de 08/10/2026, começando com R$ 20/dia, objetivo conversas no WhatsApp. Sem preço, promoção ou antes/depois na peça. Nada vai ao ar nem gasta sem aprovação dele. Valem o `gestor-de-trafego` e o plano do artifact "Plano de Anúncios".
- Não criar escassez falsa; urgência só quando verdadeira.
- Evitar clichês ("cada tatuagem conta uma história") sem contexto real e exageros ("exclusivo", "único", "melhor do Brasil").

## Serviços e preços
Estilos que faz: realismo, fine line, coberturas (cover-up), aquarela e, de resto, praticamente todos os estilos. **Foco: preto e cinza.**
**Não faz: maori** (estilo de alta dificuldade). Se um lead pedir maori, a skill não promete: avisa o André e segue a orientação dele.

Preços de referência (informados pelo André; moeda: **real, R$**):
- Mínimo: **R$ 250** por tattoo (substitui o R$ 200 que constava nas skills antigas).
- Fechamento de costas: pode chegar a **R$ 5.000**.

**Regra de ouro: o preço final de qualquer tattoo é passado SOMENTE pelo André.** Nenhuma skill informa, confirma ou promete valor final ao cliente. As skills qualificam o projeto (ideia, tamanho, local, referência, prazo), organizam o briefing e preparam a conversa; o valor sai do André. Os números acima servem só para o André e para análise interna, nunca para citar a um cliente.

Sinal (política do André):
- Trabalhos até R$ 1.000 (inclui pequenos e médios, ex.: R$ 500): **R$ 100**.
- Trabalhos **acima de R$ 1.000**: **20% do valor**.
- **O sinal não é reembolsado em caso de cancelamento ou reagendamento.** As skills comunicam a regra com clareza e sem dureza, antes da cobrança. Exceções são decisão exclusiva do André; nenhuma skill oferece, sugere ou negocia exceção.
- **[confirmar]** valor exato de R$ 1.000 (entra na faixa de R$ 100 ou na de 20%?) e formas de pagamento aceitas.

## Políticas operacionais (confirmadas pelo André)
- **Meta mensal do estúdio:** R$ 20.000 de entradas. Se o André informar outra meta para um mês específico, vale a dele.
- **Retoque:** a partir de 40 dias da sessão, se necessário, depois que o André avaliar por foto ou pessoalmente.
  - Falha na aplicação: retoque sem custo.
  - Inflamação ou desgaste por cuidados inadequados do cliente: a área é refeita e o valor é cobrado novamente.
  - Com o cliente, explicar com educação, sem acusar. Quem decide cada caso é o André; nenhuma skill promete retoque gratuito antes dele ver.
- **Idade mínima:** 18 anos. Qualquer indício de menor de idade: informar a regra.
- **Trabalho grande:** um por dia. Alertar se houver mais de um no mesmo dia.
- **"Indique e Ganhe":** existe, mas as regras ainda **não foram definidas**. Nenhuma skill menciona o programa até o André definir.

## Estúdio
- Endereço: Av. Melchert, 606, Vila Matilde (São Paulo/SP presumido, **[confirmar]**).
- Horário: segunda a sábado, das 9h às 22h. Domingo e feriado: **[confirmar]**.
- Canal de agendamento: **link na bio** do Instagram (@andretatuadoor). O link leva **direto ao WhatsApp, com formulário**.
- **[confirmar]** se atende só com hora marcada.
