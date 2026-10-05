# Gabarito — Lab 01

1. Consulta DNS por `web`; resposta `172.28.0.10` (registro A).
2. Handshake: SYN → SYN-ACK → ACK entre 172.28.0.20 e 172.28.0.10, porta 80.
3. `GET /` e `POST /login`, resposta `200 OK`.
5. Corpo do POST: `usuario=ana&senha=SenhaFraca123`. Tudo legível.
6. Em HTTPS, o handshake TLS cifra o conteúdo: um analista vê IPs, SNI e tamanhos, mas não o corpo da requisição.
8. Uma sequência de SYN do 172.28.0.30 para dezenas de portas, quase todas respondidas com RST/ACK (fechadas) e poucas com SYN-ACK (abertas, aqui a 80).
9. `tcp.flags.syn==1 && tcp.flags.ack==1`
10. `/24` = 255.255.255.0; 254 hosts úteis; rede 172.28.0.0; broadcast 172.28.0.255.
11. `/26`: 172.28.0.0/26, .64/26, .128/26, .192/26 (62 hosts úteis cada).

**Sinal de alerta para o SOC:** um único IP tocando muitas portas em poucos segundos, sem tráfego de aplicação depois.
