#!/bin/bash
# Simula tentativas de login SSH contra o container "vitima" (somente no lab).
# ROUNDS: quantas tentativas; FINAL_USER/FINAL_PASS: credencial certa no final (opcional)
ROUNDS=${ROUNDS:-30}
USERS=(root admin test oracle ubuntu ana)
PASSES=(123456 password admin qwerty letmein 12345678)
sleep 5
for i in $(seq 1 "$ROUNDS"); do
  u=${USERS[$RANDOM % ${#USERS[@]}]}
  p=${PASSES[$RANDOM % ${#PASSES[@]}]}
  sshpass -p "$p" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=3 "$u@vitima" true 2>/dev/null
  sleep 1
done
if [ -n "$FINAL_USER" ]; then
  sshpass -p "$FINAL_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    "$FINAL_USER@vitima" "id" 2>/dev/null
fi
sleep infinity
