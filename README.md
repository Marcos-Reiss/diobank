# DioBank

Um chat demonstrativo em português para entender saldos, transações e padrões de gasto. O cenário é um app bancário: o cliente já está no banco quando consulta suas finanças.

> **Demonstração:** os dados deste repositório foram criados para o projeto. Nenhum banco está conectado. As respostas são calculadas localmente, sem modelo de IA, sem conta de usuário e sem enviar dados a um serviço externo.

## Dados e regras

O painel simula duas contas e movimentações de agosto a outubro de 2026. O saldo representa a posição em **31/10/2026**; filtros históricos não recalculam esse saldo. Valores internos são armazenados em centavos. Na fonte Plaid, valor positivo significa saída e negativo significa entrada; a tela deste protótipo mostra o formato mais familiar, saídas negativas e entradas positivas. Transferências internas não fazem parte deste conjunto de demonstração.

O chat responde sobre saldo/contas, transações e gastos. Os padrões calculados são categoria de maior gasto, estabelecimentos com recorrência e variação entre meses presentes no recorte. Perguntas fora desse escopo recebem orientação. Datas relativas usam 31/10/2026 como referência.

## Executar localmente (Windows)

Requer Node.js e npm.

```powershell
npm install
npm run dev
```

Para compilar e conferir:

```powershell
npm test
npm run build
```

## MCPs para a IA de desenvolvimento

Estes servidores ajudam o agente durante a construção e a consulta de documentação. **O app publicado não chama esses MCPs.** Não compartilhe nem envie chaves em mensagens, commits, capturas ou arquivos versionados.

### Pluggy Docs (Streamable HTTP)

No Codex, adicione um servidor HTTP remoto com URL `https://mcp.pluggy.ai/mcp`. O servidor disponibiliza a documentação pública sem chave. Verifique com `/mcp` e pergunte: “Usando as fontes da Pluggy, o que é um Item?”.

```powershell
codex mcp add pluggy-docs --url https://mcp.pluggy.ai/mcp
codex mcp list
```

Fonte: [MCP Server — Pluggy Docs](https://docs.pluggy.ai/en/docs/developer-tools/mcp).

### Plaid Sandbox (STDIO)

Instale `uv` e obtenha Client ID e secret em Developers → Keys na Plaid Dashboard. Use somente as credenciais Sandbox. O pacote `mcp-server-plaid` lê `PLAID_CLIENT_ID` e `PLAID_SECRET` do ambiente. O comando abaixo configura essas variáveis apenas para o servidor MCP do Codex; substitua os placeholders localmente e nunca faça commit do comando com os valores.

```powershell
codex mcp add plaid --env PLAID_CLIENT_ID=SEU_CLIENT_ID_SANDBOX --env PLAID_SECRET=SEU_SECRET_SANDBOX -- uvx mcp-server-plaid
codex mcp list
```

No Windows, o campo do comando pode exigir o caminho absoluto de `uvx.exe`, que você encontra com `Get-Command uvx`. Se o Codex já estiver aberto, reinicie-o após adicionar o servidor. Crie um Item sandbox e peça contas, saldos e transações. A Plaid Sandbox é um laboratório e não representa Open Finance brasileiro.

Fonte: [mcp-server-plaid no PyPI](https://pypi.org/project/mcp-server-plaid/).

## Prompt preparado para Lovable

O guia das páginas 25–28 não foi incluído na pasta; este prompt foi elaborado a partir do enunciado do desafio. Ele está pronto para colar no modo de chat do Lovable e discutir antes de construir. Não houve execução no Lovable nesta entrega.

> **OpenSpec — DioBank:** Crie um web app responsivo em português do Brasil para um cliente que já está no app do banco e quer entender contas, saldos, transações e padrões de gasto. Use React e TypeScript. Construa uma interface bancária sóbria em azul-marinho, verde e fundo claro, com resumo de duas contas fictícias, lista de transações filtrável por data/categoria/conta e chat com sugestões de perguntas. Use exclusivamente dados locais claramente identificados como fictícios, sem login e sem declarar conexão bancária ou IA real. A referência temporal é 31/10/2026. O saldo é um snapshot dessa data; consultas históricas usam os registros disponíveis. Use valores em centavos e declare a regra de sinais usada pelo provedor. O chat deve responder a saldo, transações, gastos por período/categoria/conta, categoria de maior gasto, estabelecimentos recorrentes e comparação dos dois últimos meses completos no recorte; para pergunta não suportada, explicar a limitação. Combine os filtros correntes com os citados na pergunta e mostre o período respondido. Não invente dados. Inclua tratamento de listas vazias, teclado, foco visível e layout móvel. Gere README com origem e limitações dos dados e instruções de evolução para Plaid Sandbox por backend seguro.

## Melhoria escolhida

Filtros combinados por período, categoria e conta. Na interface eles atualizam a tabela e o contexto padrão do chat; filtros mencionados em uma pergunta valem apenas para aquela resposta.

## Publicação e evidências

- App: [DioBank no GitHub Pages](https://marcos-reiss.github.io/diobank/)
- Código: [Marcos-Reiss/diobank](https://github.com/Marcos-Reiss/diobank)
- Capturas do app: `docs/evidence/` (serão incluídas após abrir e conferir a versão publicada).
- Consultas Plaid via MCP e tabelas na IA: pendentes; não fazem parte desta demonstração local.

## Evolução

Para conectar dados reais ou Sandbox, mova credenciais para um backend, implemente consentimento e autorização, valide usuário/conta no servidor e nunca exponha secrets no navegador. O app estático atual não tem esse backend.
