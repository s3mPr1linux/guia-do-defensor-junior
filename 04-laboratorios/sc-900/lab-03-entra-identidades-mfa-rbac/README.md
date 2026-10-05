# Lab 03 — Entra ID: usuários, grupos, MFA, SSPR e RBAC

**Domínio 2** · **Nível:** Iniciante · **Tempo:** ~2 h · **Custo:** zero ou baixo (ver abaixo)

## Pré-requisitos
- Um **tenant de estudo** do Microsoft Entra (conta pessoal nova + tenant de avaliação/desenvolvedor). **Nunca use o tenant da empresa.**
- Para o RBAC do Azure (Parte 4): uma assinatura de estudo com orçamento e alerta de custo.
- Recursos como SSPR e algumas políticas dependem da licença; confira o que o seu tenant oferece.

## Parte 1 — Identidades
1. No centro de administração do Entra, crie 3 usuários de teste: `ana.teste`, `bruno.teste`, `carla.teste`.
2. Crie os grupos `SOC-Analistas` e `Financeiro` e adicione os usuários.
3. Registre um **dispositivo** de teste ou localize a página de dispositivos e descreva os tipos (registrado, ingressado, híbrido).
4. Localize onde ficam **identidades externas** (convidados) e **identidades de carga de trabalho/aplicativos**. Anote quais tipos de identidade você encontrou no portal (inclusive qualquer item relacionado a agentes, se disponível).

## Parte 2 — Autenticação e MFA
5. Veja os **métodos de autenticação** habilitados. Quais são passwordless?
6. Ative o **Security defaults** (se ainda não houver Acesso Condicional) e faça login com um usuário de teste para registrar o Authenticator.
7. Configure o **SSPR** para o grupo `Financeiro` (se disponível) e teste a redefinição.
8. Veja a **proteção de senha** (lista de senhas proibidas) e tente criar uma senha como `Empresa2026`.

## Parte 3 — Funções do Entra
9. Atribua ao `bruno.teste` a função **Leitor de Segurança** (ou similar) e confirme o que ele **não** consegue fazer.
10. Liste quantos **Administradores Globais** existem. Por que o ideal é ter poucos?

## Parte 4 — RBAC do Azure
11. Em um grupo de recursos de estudo, atribua **Leitor** ao `carla.teste` e **Colaborador** ao `ana.teste`.
12. Tente criar um recurso com cada usuário e compare.

## Limpeza
Remova atribuições, usuários, grupos e o grupo de recursos de teste.

## O que documentar
Prints (sem e-mails reais) e uma tabela: recurso → o que fiz → conceito SC-900.

> Os nomes de menus mudam. Se um caminho não existir, procure na documentação do Microsoft Entra e anote a diferença no seu relatório.

Gabarito e discussão: [solucao.md](solucao.md)
