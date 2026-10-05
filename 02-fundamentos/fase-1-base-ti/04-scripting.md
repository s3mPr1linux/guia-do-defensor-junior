# Módulo 4 — Scripting: Bash e Python (semanas 10–12)

## Objetivo
Automatizar tarefas repetitivas e processar logs.

## Conteúdo
**Bash**
- Variáveis, condicionais, loops, funções, argumentos
- Combinação com `grep/awk/sed`
- Boas práticas: `set -euo pipefail`, comentários

**Python**
- Sintaxe, listas, dicionários, funções, arquivos
- Módulos: `re`, `json`, `csv`, `requests`, `argparse`
- Ler logs, extrair IPs com regex, consultar APIs
- Ambientes virtuais (`venv`)

**Regex e JSON**
- Padrões para IP, e-mail, URL, hash
- Ler e filtrar JSON (`jq` e Python)

## Prática
- [ ] Extrair todos os IPs de um log com regex
- [ ] Contar tentativas por IP e ordenar
- [ ] Consultar uma API de reputação (ex.: AbuseIPDB/VirusTotal — use sua chave gratuita)
- [ ] Ler um arquivo JSON de eventos e filtrar por campo

## Mini-projeto
**"Caçador de força bruta"**: script Python que lê um `auth.log`, identifica IPs com mais de N falhas e gera um CSV com IP, contagem, primeira e última ocorrência.

## Materiais
- Automate the Boring Stuff with Python 🆓 🇺🇸
- Curso em Vídeo — Python 🆓 🇧🇷
- regex101.com para testar expressões
- Exercícios de Bash: *Bash Academy*, *Exercism*

## Você está pronto quando…
Transforma um log de 10 mil linhas em uma tabela útil em menos de 15 minutos.
