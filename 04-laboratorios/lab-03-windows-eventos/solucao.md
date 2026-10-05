# Gabarito — Lab 03

**Resumo:** força bruta por RDP contra `administrator` a partir de `203.0.113.50`, logon bem-sucedido, reconhecimento, criação de conta, serviço de persistência e limpeza de logs.

| Hora (UTC) | Evento | O que aconteceu |
|---|---|---|
| 02:10–02:14 | 4625 x38 | Falhas em `administrator`, logon tipo 10 (RDP), IP externo |
| 02:14:32 | 4624 | Sucesso do mesmo IP (tipo 10) → **conta comprometida** |
| 02:14:32 | 4672 | Privilégios especiais atribuídos (conta admin) |
| 02:15:10 | 4688 | `whoami /all` → reconhecimento de privilégios |
| 02:16:02 | 4688 + 4720 | `net user suporte ... /add` → conta criada |
| 02:16:20 | 4732 | `suporte` adicionada a Administrators → persistência |
| 02:19:45 | 7045 | Serviço `Updater` (`C:\ProgramData\upd.exe`) → persistência |
| 02:31:10 | 1102 | Log de segurança apagado → encobrimento (defesa evasiva) |

**Respostas rápidas**
- Falhas por IP: `203.0.113.50` é externo (fora de 10.0.0.0/24).
- LogonType 10 = RemoteInteractive (RDP).
- Persistência: 4720 (usuário), 4732 (grupo admin), 7045 (serviço).
- 1102 vem por último porque o atacante apaga rastros depois de agir.

**MITRE:** T1110 (Brute Force), T1078 (Valid Accounts), T1033/T1087 (Discovery), T1136.001 (Create Account), T1543.003 (Windows Service), T1070.001 (Clear Windows Event Logs).

**Ações do SOC:** bloquear o IP, desabilitar `administrator` e `suporte`, isolar o host, remover o serviço, preservar evidências antes de reiniciar, resetar credenciais, revisar exposição de RDP.
