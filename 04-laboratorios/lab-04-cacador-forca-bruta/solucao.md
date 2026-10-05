# Discussão — Lab 04

Rode `python3 solucao.py auth.log`. Resultado esperado:

- `198.51.100.23`: 120 falhas, muitos usuários → **varredura em massa** (ruído da internet); bloquear, sem comprometimento.
- `203.0.113.50`: 45 falhas e depois **sucesso como `ana`** → **comprometimento provável**; tratar como incidente.
- `192.0.2.77`: 4 falhas → abaixo do limite; ignorado com `-n 10`.
- `10.0.0.22`: erro de digitação interno de `bob`; não é ataque.

## Lições de detecção
- O **limite** é uma decisão: baixo demais gera falsos positivos; alto demais deixa passar ataques lentos (*low and slow*).
- O sinal mais valioso não é o volume, é **falhas seguidas de sucesso**.
- Contexto importa: o mesmo padrão vindo de IP interno tem outra leitura.

## Limitações da solução
Só analisa `Failed/Accepted password`; não trata chaves SSH, rotação de logs, IPv6 nem múltiplos anos.
