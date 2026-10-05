# Módulo 1 — Redes (semanas 1–4)

## Objetivo
Entender como os dados trafegam e reconhecer tráfego normal versus suspeito.

## Conteúdo
**Semana 1 — Modelos e endereçamento**
- Modelos OSI e TCP/IP (o que cada camada faz)
- IPv4, máscara, CIDR, sub-redes, gateway, NAT, IPv6 (noções)
- Endereço MAC, ARP, switch vs roteador

**Semana 2 — Protocolos essenciais**
- DNS (registros A, AAAA, MX, TXT, CNAME), DHCP
- HTTP/HTTPS, TLS (certificados), cookies
- TCP (handshake, flags SYN/ACK/FIN/RST) vs UDP
- Portas comuns: 22, 25, 53, 80, 443, 445, 3389

**Semana 3 — Segurança de rede**
- Firewall (stateful), proxy, VPN, IDS/IPS, DMZ, segmentação, VLAN
- Ataques comuns em nível de rede: port scan, ARP spoofing, DNS tunneling, DDoS (conceito)

**Semana 4 — Análise de tráfego**
- Wireshark e tcpdump: filtros, follow stream, exportar objetos
- `nmap`, `ping`, `traceroute`, `dig`, `curl`, `ss`/`netstat`

## Prática
- [ ] Calcular 5 sub-redes na mão (sem calculadora online)
- [ ] Capturar uma sessão de login HTTP e uma HTTPS; comparar
- [ ] Filtrar no Wireshark: `dns`, `http`, `tcp.flags.syn==1 && tcp.flags.ack==0`
- [ ] Rodar `nmap` **somente no seu laboratório** e identificar portas abertas
- [ ] Resolver 3 salas de redes em plataformas práticas

## Mini-projeto
**"Anatomia de um acesso web"**: documente com prints do Wireshark tudo o que acontece ao abrir um site (DNS → TCP → TLS → HTTP).

## Materiais (verifique disponibilidade e idioma)
- Cisco Networking Academy — Networking Essentials 🆓
- Professor Messer — Network+/Security+ (vídeos) 🆓 🇺🇸
- TryHackMe — trilhas *Pre Security* e *Network Fundamentals*
- Documentação do Wireshark
- Livro: *Redes de Computadores* (Tanenbaum) — consulta

## Você está pronto quando…
Consegue explicar, sem consultar, o que acontece entre digitar `google.com` e a página carregar.
