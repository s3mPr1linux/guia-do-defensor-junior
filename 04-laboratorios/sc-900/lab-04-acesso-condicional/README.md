# Lab 04 — Acesso Condicional (modo somente relatório)

**Domínio 2** · **Nível:** Iniciante/Intermediário · **Tempo:** ~1,5 h · **Licença:** Entra ID P1 ou superior (avaliação gratuita pode ser suficiente; confirme)

## Objetivo
Criar políticas de Acesso Condicional **sem impor**, avaliar o impacto e entender "sinais → decisão → controles".

## Preparação
- Tenant de estudo com os usuários do [Lab 03](../lab-03-entra-identidades-mfa-rbac/README.md).
- Crie uma conta de **emergência (break-glass)** e a **exclua** de todas as políticas. Guarde as credenciais fora do GitHub.
- **Desative o Security defaults** antes de criar políticas (eles não coexistem).

## Política A — MFA para administradores
1. Atribuições: função Administrador Global (e funções administrativas); aplicativos: todos.
2. Controle: **Exigir autenticação multifator**.
3. Estado: **Somente relatório**.

## Política B — Bloquear países que sua empresa fictícia não atende
1. Crie um **local nomeado** com os países permitidos.
2. Condição: locais → todos, exceto os permitidos.
3. Controle: **Bloquear acesso**. Estado: **Somente relatório**.

## Política C — Exigir dispositivo em conformidade para o grupo `Financeiro`
1. Aplicativos: Office 365. Controle: exigir dispositivo em conformidade (ou ingressado híbrido).
2. Estado: **Somente relatório**.

## Avaliação
3. Use a ferramenta **What If** com `ana.teste` de um país bloqueado: quais políticas se aplicariam?
4. Faça alguns logins de teste e veja em **Logs de entrada → Acesso condicional** o resultado "somente relatório".
5. Em qual caso a Política B bloquearia o usuário se estivesse **ativada**? Qual o risco de ativar sem testar?

## Limpeza
Exclua ou desabilite as políticas de teste.

## O que documentar
Uma tabela política → sinais → controle → resultado do What If.

Gabarito: [solucao.md](solucao.md)
