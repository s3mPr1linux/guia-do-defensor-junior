#!/usr/bin/env python3
"""Caçador de força bruta: identifica IPs com muitas falhas de SSH e se algum logou depois."""
import argparse, csv, re, sys
from collections import defaultdict
from datetime import datetime

FALHA = re.compile(r"^(\w{3}\s+\d+\s[\d:]{8}).*Failed password for (?:invalid user )?(\S+) from (\d{1,3}(?:\.\d{1,3}){3}) port")
SUCESSO = re.compile(r"^(\w{3}\s+\d+\s[\d:]{8}).*Accepted password for (\S+) from (\d{1,3}(?:\.\d{1,3}){3}) port")

def ts(s, ano=2026):
    return datetime.strptime(f"{ano} {s}", "%Y %b %d %H:%M:%S")

def analisar(caminho):
    falhas, sucessos = defaultdict(list), defaultdict(list)
    with open(caminho, encoding="utf-8", errors="replace") as f:
        for linha in f:
            m = FALHA.match(linha)
            if m:
                falhas[m.group(3)].append((ts(m.group(1)), m.group(2)))
                continue
            m = SUCESSO.match(linha)
            if m:
                sucessos[m.group(3)].append((ts(m.group(1)), m.group(2)))
    return falhas, sucessos

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("logfile")
    ap.add_argument("-n", "--limite", type=int, default=10, help="mínimo de falhas para suspeitar")
    ap.add_argument("-o", "--saida", default="suspeitos.csv")
    a = ap.parse_args()

    falhas, sucessos = analisar(a.logfile)
    linhas = []
    for ip, lst in falhas.items():
        if len(lst) < a.limite:
            continue
        lst.sort()
        primeira, ultima = lst[0][0], lst[-1][0]
        logou = [(t, u) for t, u in sucessos.get(ip, []) if t >= primeira]
        linhas.append({
            "ip": ip, "falhas": len(lst),
            "primeira": primeira.strftime("%H:%M:%S"), "ultima": ultima.strftime("%H:%M:%S"),
            "usuarios_tentados": len({u for _, u in lst}),
            "logou_depois": "SIM" if logou else "nao",
            "usuario_comprometido": logou[0][1] if logou else "",
        })
    linhas.sort(key=lambda r: r["falhas"], reverse=True)

    with open(a.saida, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["ip", "falhas", "primeira", "ultima",
                                          "usuarios_tentados", "logou_depois", "usuario_comprometido"])
        w.writeheader(); w.writerows(linhas)

    for r in linhas:
        alerta = "  <<< COMPROMETIMENTO PROVAVEL" if r["logou_depois"] == "SIM" else ""
        print(f'{r["ip"]:<16} {r["falhas"]:>4} falhas  {r["primeira"]}-{r["ultima"]}{alerta}')
    print(f"\nCSV gerado em {a.saida}", file=sys.stderr)

if __name__ == "__main__":
    main()
