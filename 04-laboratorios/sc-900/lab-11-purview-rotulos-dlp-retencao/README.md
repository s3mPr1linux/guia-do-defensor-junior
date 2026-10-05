# Lab 11 — Purview: classificação, rótulos, DLP, retenção e registros

**Domínio 4** · **Nível:** Intermediário · **Tempo:** ~2,5 h · **Licença:** parte dos recursos exige Microsoft 365 E3/E5 ou trial; confirme na documentação atual. Use **somente dados fictícios**.

## Preparação
Tenant de estudo, site do SharePoint de teste e uma pasta com arquivos fictícios (ex.: um `.txt` com números de cartão **de teste** e um CPF **fictício inválido**).

## Parte 1 — Classificação de dados
1. Veja os **tipos de informação confidencial** disponíveis (cartão de crédito, CPF etc.) e o que são **classificadores treináveis**.
2. Use o **Explorador de conteúdo** e o **Explorador de atividades** (se disponíveis) e descreva a diferença.

## Parte 2 — Rótulos de confidencialidade
3. Crie os rótulos **Público**, **Interno** e **Confidencial** (este com criptografia e marca d'água).
4. Publique-os por uma **política de rótulo** para um grupo de teste.
5. Aplique o rótulo Confidencial a um documento e tente abrir com um usuário **fora** do grupo autorizado.

## Parte 3 — DLP
6. Crie uma política de DLP: se um documento ou e-mail contiver ≥ 1 número de cartão de teste e for compartilhado externamente → **bloquear** e **notificar** o usuário. Comece em **modo de teste**.
7. Gere um caso de teste e veja o relatório de correspondências.
8. Por que começar em modo de teste ou só auditoria?

## Parte 4 — Retenção e registros
9. Crie uma **política de retenção** (ex.: reter 7 anos e depois excluir) para um site de teste.
10. Crie um **rótulo de retenção** e marque-o como **registro** (se disponível). O que muda?
11. Explique a diferença entre **política de retenção**, **rótulo de retenção** e **gerenciamento de registros**.

## Limpeza
Remova políticas, rótulos e o site de teste. Alterações podem levar tempo para propagar.

## O que documentar
Tabela: recurso → configuração → resultado → conceito do SC-900. Sem dados reais.

Gabarito: [solucao.md](solucao.md)
