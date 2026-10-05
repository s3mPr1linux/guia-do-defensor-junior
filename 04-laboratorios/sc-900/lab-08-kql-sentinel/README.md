# Lab 08 — KQL e caça de ameaças (Sentinel / Defender), com versão offline

**Domínio 3** · **Nível:** Iniciante/Intermediário · **Tempo:** ~2 h · **Custo:** a parte offline é gratuita; a parte Sentinel/Log Analytics **pode gerar cobrança** (ingestão). Verifique se há ambiente de demonstração gratuito da Microsoft no momento.

## Objetivo
Entender SIEM, **regras de análise**, **incidentes** e **caça (hunting)**, escrevendo consultas em **KQL** para três cenários: password spray, sucesso após spray e viagem impossível.

## Arquivos
- `signinlogs.csv` — sign-ins sintéticos no estilo Entra ID (colunas: `TimeGenerated, UserPrincipalName, IPAddress, Country, ResultType, AppDisplayName, ConditionalAccessStatus`).
- `gera_signinlogs.py` — regenera o arquivo.
- `solucao.py` — equivalente local em Python (**abra depois de tentar**).

> `ResultType`: `0` = sucesso; `50126` = usuário ou senha inválidos.

## Parte A — Offline (qualquer computador)
Explore o CSV com `python3`, `csvkit`, planilha ou `jq`/`awk` e responda:
1. Quantos sign-ins há por `ResultType`?
2. Qual IP tem mais falhas e contra **quantos usuários**? Isso é força bruta numa conta ou *password spray*?
3. Alguma conta teve **sucesso** vindo do IP suspeito?
4. Alguma conta entrou de **dois países em menos de 1 hora**?

## Parte B — KQL (Log Analytics ou Sentinel, num workspace de estudo)
Se tiver um workspace, importe o CSV como tabela personalizada (ou use a tabela real `SigninLogs`, se já houver dados do seu tenant de estudo) e adapte os nomes de coluna.

```kusto
// 1) Contagem por resultado
SigninLogs
| summarize Total = count() by ResultType
| order by Total desc

// 2) Password spray: um IP, muitos usuários
SigninLogs
| where ResultType == "50126"
| summarize Falhas = count(), Usuarios = dcount(UserPrincipalName) by IPAddress
| where Falhas >= 5 and Usuarios >= 4

// 3) Sucesso depois do spray
let ipsSpray = SigninLogs
    | where ResultType == "50126"
    | summarize Falhas = count(), Usuarios = dcount(UserPrincipalName) by IPAddress
    | where Falhas >= 5 and Usuarios >= 4
    | project IPAddress;
SigninLogs
| where ResultType == "0" and IPAddress in (ipsSpray)

// 4) Viagem impossível (simplificada)
SigninLogs
| where ResultType == "0"
| sort by UserPrincipalName asc, TimeGenerated asc
| extend PaisAnterior = prev(Country), UsuarioAnterior = prev(UserPrincipalName), HoraAnterior = prev(TimeGenerated)
| where UserPrincipalName == UsuarioAnterior and Country != PaisAnterior
| where datetime_diff('minute', TimeGenerated, HoraAnterior) < 60
```
> No esquema real do Entra ID, o país fica em `LocationDetails` (JSON) e o nome do campo pode variar; use `parse_json` para extraí-lo.

## Parte C — Do hunting à regra de análise
5. Transforme a consulta 2 em uma **regra de análise agendada**: frequência, janela, limiar, gravidade e **mapeamento MITRE** (ex.: T1110.003 Password Spraying).
6. Que entidades você mapearia (conta, IP)?
7. Descreva um **playbook (SOAR)** que, ao disparar essa regra, notificaria o SOC e, com aprovação, desabilitaria o usuário comprometido.
8. Qual a diferença entre **alerta**, **incidente** e **caça**?

## O que documentar
As consultas, a lógica de detecção, falsos positivos prováveis (ex.: NAT corporativo) e como você reduziria o ruído.

## Limpeza
Exclua o workspace de estudo e as regras criadas.

Gabarito: [solucao.md](solucao.md)
