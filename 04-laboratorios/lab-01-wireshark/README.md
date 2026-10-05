# Lab 01 — Análise de tráfego com Wireshark

**Nível:** Iniciante · **Tempo:** ~2 h · **Módulo:** [Redes](../../02-fundamentos/fase-1-base-ti/01-redes.md)

## Objetivo
Capturar e interpretar DNS, TCP e HTTP; enxergar por que HTTP puro expõe credenciais; e reconhecer o padrão de um port scan.

## Pré-requisitos
Docker + Docker Compose e Wireshark instalado no seu computador.

## Ambiente
| Container | IP | Função |
|---|---|---|
| web | 172.28.0.10 | Servidor nginx |
| cliente | 172.28.0.20 | Gera tráfego DNS, HTTP e um "login" em texto puro |
| sniffer | (rede do cliente) | Grava `capturas/trafego.pcap` |
| ferramentas | 172.28.0.30 | Só sobe com `--profile tools` (nmap, dig, curl) |

A rede é `internal`: sem acesso à internet, nada sai do seu computador.

## Preparação
```bash
docker compose up -d
sleep 30
ls -lh capturas/        # trafego.pcap deve existir
```

## Parte 1 — Ler o tráfego normal
Abra `capturas/trafego.pcap` no Wireshark.
1. Filtre `dns`. Qual nome foi consultado? Qual IP voltou?
2. Filtre `tcp.flags.syn==1 && tcp.flags.ack==0` e encontre os SYN. Depois localize SYN-ACK e ACK do mesmo fluxo (handshake).
3. Filtre `http`. Qual método e URL aparecem? Qual o código de resposta?
4. Clique com o botão direito em um pacote HTTP → *Follow → TCP Stream*.

## Parte 2 — Credenciais em texto puro
5. Filtre `http.request.method == "POST"`. Que usuário e senha aparecem?
6. Escreva em 3 linhas por que isso não acontece (ou é bem mais difícil) com HTTPS.

## Parte 3 — Simular um port scan
O container `ferramentas` grava a própria captura enquanto roda o `nmap` contra o `web`:
```bash
docker compose --profile tools run --rm ferramentas sh -c \
  "tcpdump -i any -w /capturas/scan.pcap & sleep 1; nmap -sT -p 1-1024 web; sleep 1; pkill tcpdump"
```
7. Abra `capturas/scan.pcap` e filtre `ip.src==172.28.0.30`.
8. Que padrão você vê? (muitos SYN para portas diferentes, RST das portas fechadas, SYN-ACK das abertas.)
9. Que filtro do Wireshark mostra só as portas **abertas** (respondem SYN-ACK)?

## Parte 4 — Sub-redes (papel e lápis)
10. A rede é `172.28.0.0/24`. Qual a máscara? Quantos hosts úteis? Quais o endereço de rede e o de broadcast?
11. Divida em 4 sub-redes iguais. Liste-as.

## O que documentar no seu portfólio
Prints de: handshake, consulta DNS, o POST com a senha e o padrão do scan, cada um com 2–3 linhas de explicação. Salve em `fundamentos-lab/redes/lab-01.md`.

## Limpeza
```bash
docker compose down -v
```

Gabarito: [solucao.md](solucao.md)
