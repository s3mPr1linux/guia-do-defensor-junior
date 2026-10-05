#!/usr/bin/env python3
"""Gera sign-in logs sintéticos (estilo Entra ID SigninLogs) em CSV. Uso: python3 gera_signinlogs.py > signinlogs.csv
Dados 100% fictícios; IPs de documentação (RFC 5737)."""
import csv, random, sys
from datetime import datetime, timedelta

random.seed(900)
t0 = datetime(2026, 3, 14, 0, 0, 0)
usuarios = ["ana@contoso.example", "bruno@contoso.example", "carla@contoso.example", "diego@contoso.example"]
local = {"ana@contoso.example": ("BR", "198.51.100.10"), "bruno@contoso.example": ("BR", "198.51.100.11"),
         "carla@contoso.example": ("BR", "198.51.100.12"), "diego@contoso.example": ("BR", "198.51.100.13")}
linhas = []

def add(t, user, ip, pais, cod, app="Office 365"):
    linhas.append({"TimeGenerated": t.strftime("%Y-%m-%dT%H:%M:%SZ"), "UserPrincipalName": user,
                   "IPAddress": ip, "Country": pais, "ResultType": cod,
                   "AppDisplayName": app, "ConditionalAccessStatus": "notApplied"})

# ruído normal (0 = sucesso, 50126 = senha incorreta)
for u in usuarios:
    pais, ip = local[u]
    for h in (8, 9, 12, 14, 17):
        add(t0 + timedelta(hours=h, minutes=random.randint(0, 59)), u, ip, pais, 0)
    if random.random() < 0.6:
        add(t0 + timedelta(hours=9, minutes=random.randint(0, 59)), u, ip, pais, 50126)

# password spray: 1 IP, muitos usuários, poucas tentativas por usuário
spray_ip = "203.0.113.77"
t = t0 + timedelta(hours=3, minutes=5)
for _ in range(3):
    for u in usuarios + ["financeiro@contoso.example", "ti@contoso.example", "rh@contoso.example"]:
        add(t, u, spray_ip, "RU", 50126)
        t += timedelta(seconds=random.randint(5, 15))
# sucesso após o spray em uma conta
add(t + timedelta(seconds=30), "diego@contoso.example", spray_ip, "RU", 0)

# viagem impossível: mesma conta, BR e depois outro país em 20 minutos
add(t0 + timedelta(hours=10, minutes=0), "ana@contoso.example", "198.51.100.10", "BR", 0)
add(t0 + timedelta(hours=10, minutes=20), "ana@contoso.example", "192.0.2.200", "JP", 0)

linhas.sort(key=lambda r: r["TimeGenerated"])
w = csv.DictWriter(sys.stdout, fieldnames=list(linhas[0].keys()))
w.writeheader(); w.writerows(linhas)
