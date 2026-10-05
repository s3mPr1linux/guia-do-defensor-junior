#!/usr/bin/env python3
"""Equivalente local das consultas KQL do lab: roda sobre signinlogs.csv, sem Azure."""
import csv, sys
from collections import defaultdict
from datetime import datetime

arq = sys.argv[1] if len(sys.argv) > 1 else "signinlogs.csv"
rows = list(csv.DictReader(open(arq, encoding="utf-8")))
for r in rows:
    r["t"] = datetime.strptime(r["TimeGenerated"], "%Y-%m-%dT%H:%M:%SZ")

print("== 1. Resultados por código ==")
cont = defaultdict(int)
for r in rows: cont[r["ResultType"]] += 1
for k, v in sorted(cont.items(), key=lambda x: -x[1]): print(f"  {k:>6}  {v}")

print("\n== 2. Falhas por IP (>= 5 falhas e >= 4 usuários distintos = spray) ==")
falhas = defaultdict(lambda: {"n": 0, "u": set()})
for r in rows:
    if r["ResultType"] == "50126":
        falhas[r["IPAddress"]]["n"] += 1; falhas[r["IPAddress"]]["u"].add(r["UserPrincipalName"])
spray = [ip for ip, d in falhas.items() if d["n"] >= 5 and len(d["u"]) >= 4]
for ip in spray: print(f"  {ip}: {falhas[ip]['n']} falhas, {len(falhas[ip]['u'])} usuários")

print("\n== 3. Sucesso depois do spray (possível comprometimento) ==")
for r in rows:
    if r["IPAddress"] in spray and r["ResultType"] == "0":
        print(f"  {r['UserPrincipalName']} logou de {r['IPAddress']} ({r['Country']}) às {r['t']:%H:%M:%S}")

print("\n== 4. Viagem impossível (países diferentes em < 60 min) ==")
por_usuario = defaultdict(list)
for r in rows:
    if r["ResultType"] == "0": por_usuario[r["UserPrincipalName"]].append(r)
for u, lst in por_usuario.items():
    lst.sort(key=lambda r: r["t"])
    for a, b in zip(lst, lst[1:]):
        if a["Country"] != b["Country"] and (b["t"] - a["t"]).total_seconds() < 3600:
            print(f"  {u}: {a['Country']} -> {b['Country']} em {(b['t']-a['t']).seconds//60} min")
