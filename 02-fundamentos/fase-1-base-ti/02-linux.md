# Módulo 2 — Linux (semanas 5–7)

## Objetivo
Trabalhar confortavelmente no terminal e saber onde estão as evidências.

## Conteúdo
**Semana 5 — Terminal**
- Navegação: `ls cd pwd cp mv rm find`
- Leitura: `cat less head tail grep`
- Pipes e redirecionamento: `| > >> 2>&1`
- Texto: `cut sort uniq awk sed wc`
- Editores: `nano`, noções de `vim`

**Semana 6 — Sistema**
- Usuários, grupos e permissões (`chmod`, `chown`, SUID, `sudo`)
- Processos: `ps top kill systemctl journalctl`
- Pacotes: `apt`/`dnf`
- Rede: `ip a`, `ss -tulpn`, `ufw`/`iptables` (básico)
- Cron e serviços

**Semana 7 — Logs e segurança**
- `/var/log/auth.log` (ou `secure`), `syslog`, `journalctl`
- SSH: chaves, `sshd_config`, tentativas de força bruta
- Auditoria: `auditd` (noções), `last`, `lastb`, `w`
- Hardening básico: desativar login root, fail2ban

## Prática
- [ ] Instalar uma VM Ubuntu/Debian e usar somente SSH
- [ ] Criar usuários e testar permissões
- [ ] Gerar tentativas de login falhas e localizá-las no `auth.log`
- [ ] Contar IPs com mais falhas usando `grep | awk | sort | uniq -c | sort -nr`
- [ ] Concluir o *OverTheWire: Bandit* até o nível 15

## Mini-projeto
**"Radiografia de um servidor"**: script Bash que lista usuários, portas abertas, últimos logins e serviços ativos em um relatório `.txt`.

## Materiais
- OverTheWire Bandit 🆓 🇺🇸
- Linux Journey 🆓 🇺🇸
- Curso em Vídeo — Curso de Linux 🆓 🇧🇷
- TryHackMe — *Linux Fundamentals* (partes 1–3)
- Livro: *The Linux Command Line* (William Shotts) 🆓

## Você está pronto quando…
Investiga um servidor desconhecido e descobre quem entrou, quando e de onde, só pelo terminal.
