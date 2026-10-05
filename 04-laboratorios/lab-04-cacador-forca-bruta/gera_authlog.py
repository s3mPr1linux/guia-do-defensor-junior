#!/usr/bin/env python3
"""Gera um auth.log sintético (formato syslog do sshd). Uso: python3 gera_authlog.py > auth.log"""
import random
from datetime import datetime, timedelta

random.seed(7)
t0 = datetime(2026, 3, 14, 0, 0, 0)
linhas = []

def log(t, msg, pid=None):
    pid = pid or random.randint(1000, 9999)
    linhas.append((t, f"{t.strftime('%b %d %H:%M:%S')} srv-web01 sshd[{pid}]: {msg}"))

# tráfego legítimo
for u, ip in [("ana", "10.0.0.21"), ("bob", "10.0.0.22")]:
    for _ in range(6):
        t = t0 + timedelta(minutes=random.randint(420, 1000))
        log(t, f"Accepted password for {u} from {ip} port {random.randint(40000, 60000)} ssh2")

def ataque(ip, n, inicio_min, users, sucesso=None):
    t = t0 + timedelta(minutes=inicio_min)
    for i in range(n):
        u = random.choice(users)
        inv = "invalid user " if u not in ("root", "ana", "bob") else ""
        log(t, f"Failed password for {inv}{u} from {ip} port {random.randint(30000, 65000)} ssh2")
        t += timedelta(seconds=random.randint(2, 9))
    if sucesso:
        log(t, f"Accepted password for {sucesso} from {ip} port {random.randint(30000, 65000)} ssh2")

ataque("198.51.100.23", 120, 130, ["root", "admin", "oracle", "test", "ubuntu"])
ataque("203.0.113.50", 45, 300, ["ana", "root", "admin"], sucesso="ana")
ataque("192.0.2.77", 4, 600, ["admin", "root"])
ataque("10.0.0.22", 2, 700, ["bob"])   # erro de digitação legítimo

for _, l in sorted(linhas):
    print(l)
