# Lab 04 — Caçador de força bruta (scripting)

**Nível:** Iniciante · **Tempo:** ~3 h · **Módulo:** [Scripting](../../02-fundamentos/fase-1-base-ti/04-scripting.md)

## Objetivo
Escrever um script em Python que lê um `auth.log`, encontra IPs com muitas falhas de SSH e **avisa se algum deles conseguiu entrar depois**.

## Arquivos
- `auth.log` — log sintético (centenas de linhas, formato do sshd).
- `gera_authlog.py` — regenera o log, se quiser.
- `solucao.py` — resolução de referência (**só abra depois de tentar**).

## Requisitos do seu script (`cacador.py`)
1. Recebe o arquivo pela linha de comando (`argparse`) e um limite `-n` (padrão 10).
2. Extrai com **regex**: horário, usuário e IP das linhas `Failed password` (inclusive `invalid user`).
3. Conta falhas **por IP** e guarda primeira e última ocorrência.
4. Considera suspeito quem tem `>= N` falhas.
5. Verifica se o IP suspeito tem um `Accepted password` **depois** das falhas.
6. Imprime uma tabela ordenada e grava `suspeitos.csv` com: `ip, falhas, primeira, ultima, usuarios_tentados, logou_depois`.

## Dicas
- Teste a regex em regex101.com com 3 linhas do log.
- Use `collections.defaultdict(list)`.
- Comece só contando falhas por IP; acrescente os requisitos aos poucos.
- Faça commits pequenos no seu repositório.

## Desafios extras
- [ ] Aceitar vários arquivos de log
- [ ] Consultar a reputação do IP em uma API (sua chave gratuita)
- [ ] Ignorar IPs internos (`10.0.0.0/8`) ou sinalizá-los à parte
- [ ] Gerar saída em JSON para alimentar um SIEM
- [ ] Escrever 3 testes com `pytest`

## Como conferir
```bash
python3 cacador.py auth.log -n 10
```
Com `-n 10` você deve encontrar 2 IPs suspeitos, e **um deles** com comprometimento provável (os IPs com poucas falhas ficam abaixo do limite). Compare com `python3 solucao.py auth.log`.

## O que documentar no seu portfólio
Publique `cacador.py` com um README: o problema, como usar, exemplo de saída e limitações (ex.: só trata autenticação por senha; não trata rotação de logs).

Gabarito e discussão: [solucao.md](solucao.md)
