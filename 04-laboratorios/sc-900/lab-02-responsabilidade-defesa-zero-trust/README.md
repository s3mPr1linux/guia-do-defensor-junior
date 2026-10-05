# Lab 02 — Responsabilidade compartilhada, defesa em profundidade e Zero Trust (estudo de caso)

**Domínio 1** · **Nível:** Iniciante · **Tempo:** ~1,5 h · **Custo:** zero · **Precisa de:** papel ou draw.io

## Cenário
A empresa fictícia **Mar Azul Logística** tem: (a) um ERP em VMs no Azure (IaaS), (b) um site em Azure App Service (PaaS), (c) e-mail no Microsoft 365 (SaaS), (d) 120 notebooks e (e) um AD no escritório.

## Parte 1 — Responsabilidade compartilhada
Preencha, para cada item, quem é responsável (empresa, Microsoft ou compartilhado):
| Item | Responsável |
|---|---|
| Patches do SO das VMs do ERP | ? |
| Patches do SO do App Service | ? |
| Código do site | ? |
| Dados dos e-mails | ? |
| Contas de usuário do M365 | ? |
| Segurança física do datacenter | ? |
| Notebooks dos funcionários | ? |

## Parte 2 — Defesa em profundidade
Para um ataque de phishing que tenta chegar ao ERP, desenhe **uma camada de controle por nível**: física, identidade, perímetro, rede, computação, aplicativo, dados. Indique um controle por camada.

## Parte 3 — Zero Trust
Reescreva a regra "quem está na rede do escritório pode acessar o ERP" aplicando os 3 princípios (verificar explicitamente, privilégio mínimo, presumir violação). Dê 1 controle por princípio.

## Parte 4 — GRC
Classifique cada ação como **governança**, **risco** ou **conformidade**:
a) Definir a política de senhas. b) Registrar e priorizar a ameaça de ransomware. c) Provar à auditoria que os logs são guardados por 12 meses. d) Aprovar o orçamento de segurança.

## O que documentar
O diagrama (Parte 2) e a tabela (Parte 1) em `fundamentos-lab/sc-900/lab-02.md`.

Gabarito: [solucao.md](solucao.md)
