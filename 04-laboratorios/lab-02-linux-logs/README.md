# Lab 02 — Logs de autenticação e SSH no Linux

**Nível:** Iniciante · **Tempo:** ~2 h · **Módulo:** [Linux](../../02-fundamentos/fase-1-base-ti/02-linux.md)

## Objetivo
Investigar um servidor que sofreu tentativas de força bruta via SSH: descobrir **quem** tentou, **quanto**, **quando** e se alguém **entrou**.

## Ambiente
- `vitima` — Ubuntu com SSH (senha) e `rsyslog` gravando `/var/log/auth.log`.
- `atacante1` — muitas tentativas e, no final, um login válido (`ana`).
- `atacante2` — poucas tentativas (ruído).

Nenhuma porta é publicada no seu computador: tudo fica na rede interna do Docker.

## Preparação
```bash
docker compose up -d --build
sleep 90          # aguarde os ataques terminarem
docker compose exec vitima bash
```

## Missões (dentro da `vitima`)
1. Veja as últimas 20 linhas de `/var/log/auth.log`.
2. Quantas linhas contêm `Failed password`?
3. Liste os usuários tentados que **não existem** (`invalid user`).
4. Conte as falhas **por IP** e ordene do maior para o menor:
   ```bash
   grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr
   ```
5. Alguém conseguiu entrar? Procure `Accepted password`. Qual usuário, IP e horário?
6. Compare: o IP que entrou é o mesmo que mais falhou? O que isso sugere?
7. Use `last` e `w` para ver sessões.
8. Liste as portas em escuta: `ss -tulpn`.

## Missão de resposta (hardening)
9. Desative login por senha e login root em `/etc/ssh/sshd_config`:
   ```
   PasswordAuthentication no
   PermitRootLogin no
   ```
   Recarregue com `pkill -HUP sshd` e explique por que isso interrompe a força bruta.
10. Explique a diferença entre **bloquear o IP** (contenção) e **corrigir a causa** (senha fraca, sem MFA). Se quiser praticar, instale `iptables` na vítima e bloqueie o IP ofensor.

## O que documentar no seu portfólio
Um mini-relatório: resumo, linha do tempo, IPs envolvidos, se houve comprometimento, ação tomada e recomendação. Use o [template de incidente](../../06-portfolio-github/template-relatorio-incidente.md).

## Limpeza
```bash
docker compose down -v
```

Gabarito: [solucao.md](solucao.md)
