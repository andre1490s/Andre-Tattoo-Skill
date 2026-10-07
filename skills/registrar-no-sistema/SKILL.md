---
name: "registrar-no-sistema"
description: "Use ao fim de qualquer atendimento, orçamento, sessão, post ou revisão do Andre Tattoo para registrar o cliente e o que foi aprendido no sistema (ciclo de aprendizado entre agentes)."
---

# Registrar no sistema — Andre Tattoo

É o que faz os agentes aprenderem entre si. Toda skill do estúdio termina passando por aqui.

## Onde cada coisa mora
- **Regras oficiais:** documento `claude/cerebro-regras-oficiais.md` do projeto AT Nox (fonte da verdade).
- **Diário de aprendizado:** documento `claude/diario-aprendizado.md` do projeto AT Nox.
- **Clientes, Conteúdo, Metas, Indicações:** Google Planilhas "Sistema Andre Tattoo".
- **Financeiro:** Google Planilhas "Controle Financeiro - Pessoal e Studio" (fluxo do n8n).
- **Agenda:** Google Agenda andre1490s@gmail.com. Padrão de evento: `Tattoo · Nome · Projeto · Grande/Médio/Pequeno`; descrição com `sinal pago` ou `sinal pendente`.

## Passos
1. **Cliente:** montar a linha da aba Clientes com o que mudou (status, datas, sinal, próximo passo). Status possíveis: Novo contato, Faltam informações, Orçamento enviado, Aguardando sinal, Agendado, Sessão feita, Cicatrizado, Perdido.
   - Se houver acesso de escrita à planilha, atualizar direto. Se não, entregar a linha pronta para o Andre colar (colunas na ordem da aba).
2. **Aprendizado:** se aconteceu algo que vale ensinar aos outros agentes, acrescentar uma entrada no diário (seção Entradas), no formato:
   `- AAAA-MM-DD · Fonte · Tipo · o que aconteceu · sugestão · Status: Novo`
   Vale registrar: pergunta de cliente sem resposta nas regras, objeção que se repetiu, orçamento que fechou ou se perdeu (e por quê), post que trouxe mensagem, erro da Sofia, ideia de conteúdo vinda de dúvida real.
   Para editar o diário: ler o documento inteiro, acrescentar a linha e gravar o conteúdo completo de volta no mesmo caminho.
3. **Conteúdo:** post publicado → linha na aba Conteúdo (formato, pilar, ideia) para o relatório medir depois.
4. Dizer ao Andre, em 1 linha, o que foi registrado.

## Regras fixas
- Nunca mudar `claude/cerebro-regras-oficiais.md` sem aprovação explícita do Andre. Aprendizado vira proposta, nunca regra direta.
- Não registrar dado sensível de cliente além do necessário (nome, WhatsApp, projeto, datas). Nada de saúde ou conversa privada no diário: só o padrão aprendido, sem nome.
- Não inventar dado: o que não se sabe fica em branco.
- Evitar entrada duplicada: se o mesmo aprendizado já existe como "Novo", só aumentar a contagem na própria linha ("visto 3x").