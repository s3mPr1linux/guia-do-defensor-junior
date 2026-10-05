# Domínio 2 — Recursos do Microsoft Entra (25–30%)

## 2.1 Entra ID e tipos de identidade
- **Microsoft Entra ID:** serviço de identidade e acesso em nuvem (antigo Azure AD). Um **tenant** é a instância dedicada de uma organização.
- Edições: **Free**, **P1**, **P2** e o complemento **ID Governance**. Confira o que cada uma inclui na documentação atual.

| Tipo de identidade | O que é |
|---|---|
| Usuário | Pessoa (funcionário ou convidado) |
| Grupo | Conjunto de usuários para atribuir acesso |
| Dispositivo | Computador/celular registrado, ingressado ou híbrido |
| Entidade de serviço / identidade de carga de trabalho | Identidade de aplicativos e serviços |
| Identidade gerenciada | Identidade de recurso Azure, sem segredo para administrar |
| Identidade externa | Parceiros e clientes |
| **ID do agente** (citada no guia) | Identidade para agentes de IA, tratados como identidades não humanas |

### Identidade híbrida
Integra o AD local ao Entra ID: **Entra Connect** (ou Cloud Sync) sincroniza identidades. Autenticação: sincronização de hash de senha, autenticação pass-through ou federação (AD FS).

## 2.2 Autenticação
- **Métodos:** senha, Microsoft Authenticator, chaves FIDO2/passkeys, Windows Hello para Empresas, SMS/voz, tokens OATH, Temporary Access Pass.
- **Sem senha (passwordless):** mais seguro e mais prático.
- **MFA:** combina fatores de categorias diferentes (algo que você sabe, tem, é). *Security defaults* ativa proteções básicas gratuitas.
- **Senha:** redefinição por autoatendimento (**SSPR**), **proteção de senha** (lista de senhas proibidas, personalizada e para o AD local) e bloqueio inteligente.

## 2.3 Gerenciamento de acesso
### Acesso Condicional
Motor "se... então": **sinais** (usuário/grupo, aplicativo, local, dispositivo, risco) → **decisão** (bloquear, exigir MFA, exigir dispositivo em conformidade, termos de uso, controles de sessão). Use o modo **somente relatório** antes de impor. Requer licença P1 ou superior.

### Funções e RBAC
- **Funções do Entra:** administram o diretório (ex.: Administrador Global, Administrador de Usuários).
- **RBAC do Azure:** administra recursos do Azure (Proprietário, Colaborador, Leitor).
- **Privilégio mínimo:** conceda só o necessário; mantenha poucos Administradores Globais.

## 2.4 Proteção e governança de identidade
| Recurso | Para que serve |
|---|---|
| **ID Governance** | Ciclo de vida de acesso (pacotes de acesso, fluxos de trabalho) |
| **Revisões de acesso** | Revisão periódica de quem ainda precisa de acesso |
| **PIM** | Acesso privilegiado **just-in-time**, com aprovação, duração limitada e auditoria |
| **ID Protection** | Detecta riscos de usuário e de entrada; alimenta políticas baseadas em risco |

## Perguntas de revisão
1. O que diferencia uma função do Entra de uma função do RBAC do Azure?
2. Quando usar o modo somente relatório do Acesso Condicional?
3. Qual problema o PIM resolve?
4. O que é uma identidade gerenciada e por que é melhor que senha em código?
5. Cite 3 métodos sem senha.

## Pegadinhas de prova
- **Acesso Condicional** decide o acesso; **ID Protection** detecta risco; **PIM** dá privilégio temporário.
- SMS é MFA, mas **menos seguro** que Authenticator ou FIDO2.
- Federação ≠ sincronização de identidades.
