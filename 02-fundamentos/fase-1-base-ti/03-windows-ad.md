# Módulo 3 — Windows e Active Directory (semanas 8–10)

## Objetivo
Entender o ambiente que a maioria das empresas usa e onde ficam as evidências de ataque.

## Conteúdo
**Semana 8 — Windows**
- Contas, grupos, UAC, serviços, registro, tarefas agendadas
- Sistema de arquivos NTFS e permissões
- PowerShell básico: `Get-Process`, `Get-Service`, `Get-EventLog`/`Get-WinEvent`
- Ferramentas: Sysinternals (Process Explorer, Autoruns, TCPView)

**Semana 9 — Active Directory**
- Domínio, DC, OU, usuários, grupos, GPO
- DNS e Kerberos/NTLM (conceito)
- Trilha de autenticação: como um logon acontece

**Semana 10 — Logs e eventos**
| Event ID | Significado |
|---|---|
| 4624 / 4625 | Logon com sucesso / falha |
| 4648 | Logon com credenciais explícitas |
| 4672 | Privilégios especiais atribuídos |
| 4688 | Novo processo criado |
| 4720 / 4732 | Usuário criado / adicionado a grupo |
| 7045 | Novo serviço instalado |
| 1102 | Log de auditoria apagado |

- Sysmon: instalar e ler eventos (1, 3, 11)
- Conceitos de ataque: pass-the-hash, Kerberoasting, persistência (para reconhecer na defesa)

## Prática
- [ ] Montar um lab com 1 DC + 1 cliente Windows (VMs, avaliação gratuita da Microsoft)
- [ ] Criar OUs, usuários, grupos e uma GPO de senha
- [ ] Gerar falhas de login e encontrar o evento 4625 com PowerShell
- [ ] Instalar Sysmon e observar a criação de processos

## Mini-projeto
**"Linha do tempo de um logon"**: documente os eventos gerados em um login normal e em um login falho, com IDs e campos importantes.

## Materiais
- Microsoft Learn — Windows Server e AD 🆓
- Sysinternals Suite 🆓
- TryHackMe — *Windows Fundamentals* e *Active Directory Basics*
- Ultimate Windows Security (referência de Event IDs)

## Você está pronto quando…
Diante de uma sequência de eventos 4625 seguida de 4624, você explica o que pode ter acontecido.
