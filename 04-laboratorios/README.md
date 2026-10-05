# Laboratórios

Cada lab segue o [template](_template/README.md): objetivo, pré-requisitos, preparação, passo a passo, gabarito e o que documentar.

## Fase 1 — Base de TI
| Lab | Nível | Tempo | Tema | Precisa de Docker? |
|---|---|---|---|---|
| [lab-01-wireshark](lab-01-wireshark/) | Iniciante | ~2 h | DNS, TCP, HTTP e port scan | Sim |
| [lab-02-linux-logs](lab-02-linux-logs/) | Iniciante | ~2 h | Força bruta SSH e logs Linux | Sim |
| [lab-03-windows-eventos](lab-03-windows-eventos/) | Iniciante | ~2 h | Eventos Windows e linha do tempo | Não |
| [lab-04-cacador-forca-bruta](lab-04-cacador-forca-bruta/) | Iniciante | ~3 h | Scripting Python + regex | Não |

## Trilha SC-900 (Microsoft Security, Compliance and Identity)
12 labs de identidade (Entra), segurança (Azure, Defender, Sentinel) e conformidade (Purview): veja o [índice dos labs SC-900](sc-900/README.md). Alguns rodam offline; outros pedem tenant ou assinatura **de estudo** e podem gerar custo.

## Próximos (planejados)
Phishing · Wazuh/SIEM · Sigma e hunting · Ransomware IR · Hardening CIS

## Regras
- Somente ambientes **isolados e próprios**. Nunca aponte ferramentas para alvos reais.
- Os labs não publicam portas no seu computador; o tráfego fica na rede interna do Docker.
- Não versione senhas reais, chaves nem logs de produção.
- Resolva primeiro, olhe o gabarito depois.
