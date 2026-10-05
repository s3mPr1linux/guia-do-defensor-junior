# Discussão — Lab 08
Rode `python3 solucao.py signinlogs.csv`. Esperado (padrão, não números exatos):

- O IP `203.0.113.77` concentra falhas contra 7 usuários, com poucas tentativas por conta → **password spray** (T1110.003), não força bruta em uma única conta.
- `diego@contoso.example` tem **sucesso do mesmo IP** logo depois → **comprometimento provável**: forçar troca de senha, revogar sessões, exigir MFA e investigar o que a conta fez.
- `ana@contoso.example` aparece em **BR e JP em 20 minutos** → possível viagem impossível; confirmar com a pessoa (pode ser VPN) antes de agir.

## Lições de detecção
- Spray evita bloqueio por conta: o sinal está em **muitos usuários por IP**, não em muitas falhas por usuário.
- O sinal mais forte é **falha seguida de sucesso**.
- Viagem impossível gera falsos positivos (VPN, proxy): combine com risco, dispositivo e aplicativo.
- Regra boa = limiar justificado + mapeamento MITRE + entidades + playbook + plano de ajuste de falsos positivos.

## Alerta × incidente × caça
Alerta: um evento que disparou uma regra. Incidente: conjunto de alertas correlacionados para investigação. Caça: busca proativa por ameaças que ainda não geraram alerta.
