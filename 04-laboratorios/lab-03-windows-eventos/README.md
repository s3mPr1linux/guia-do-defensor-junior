# Lab 03 — Investigando eventos do Windows

**Nível:** Iniciante · **Tempo:** ~2 h · **Módulo:** [Windows e AD](../../02-fundamentos/fase-1-base-ti/03-windows-ad.md)

## Objetivo
Ler eventos de segurança do Windows (IDs 4624, 4625, 4672, 4688, 4720, 4732, 7045, 1102) e **reconstruir a linha do tempo de um ataque**.

## Ambiente
Não precisa de Windows: o arquivo `eventos.jsonl` traz eventos **sintéticos** no estilo Windows Security, um por linha. (Para gerar de novo: `python3 gera_eventos.py > eventos.jsonl`.)

Campos: `TimeCreated`, `EventID`, `Computer`, `TargetUserName`, `SubjectUserName`, `IpAddress`, `LogonType`, `CommandLine`, `ServiceName`, `GroupName`...

> Tipos de logon: 2 = interativo, 3 = rede, 10 = RDP.

## Parte 1 — Explorar (com `jq`, Python ou PowerShell)
```bash
jq -c 'select(.EventID==4625)' eventos.jsonl | head
jq -r '.EventID' eventos.jsonl | sort | uniq -c | sort -nr
```
1. Quantos eventos existem por `EventID`?
2. Quantos 4625 (falha) e quantos 4624 (sucesso)?
3. Quais IPs aparecem nos 4625? Algum é de fora da rede `10.0.0.0/24`?

## Parte 2 — Investigar
4. Qual conta sofreu mais falhas e de qual IP?
5. Qual o **horário** da primeira e da última falha desse IP?
6. Houve sucesso (4624) desse IP? Quando? Qual `LogonType`? O que ele significa?
7. Depois do logon, quais comandos foram executados (4688)? O que cada um faz?
8. Quais mudanças de **persistência** ocorreram (4720, 4732, 7045)?
9. O que o evento 1102 indica e por que ele vem por último?
10. Faça a **linha do tempo** (hora, evento, o que aconteceu) e mapeie para o MITRE ATT&CK (ex.: T1110 Brute Force, T1078 Valid Accounts, T1136 Create Account, T1543 Create/Modify System Process, T1070 Indicator Removal).

## Parte 3 — Equivalente em PowerShell (referência para um Windows real)
```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} |
  Group-Object { $_.Properties[19].Value } | Sort-Object Count -Descending
```

## Para ir além (opcional)
Monte um DC + cliente em VMs, gere falhas de login e compare os eventos reais com os do arquivo.

## O que documentar no seu portfólio
A linha do tempo (item 10) usando o [template de incidente](../../06-portfolio-github/template-relatorio-incidente.md).

Gabarito: [solucao.md](solucao.md)
