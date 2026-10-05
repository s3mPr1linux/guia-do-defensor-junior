#!/usr/bin/env python3
"""Gera eventos sintéticos no estilo Windows Security (JSON Lines) com um ataque escondido.
Uso: python3 gera_eventos.py > eventos.jsonl"""
import json, random
from datetime import datetime, timedelta

random.seed(42)
DIA = datetime(2026, 3, 14)
DC = "DC01.corp.local"
eventos = []

def ev(t, eid, **campos):
    eventos.append({"TimeCreated": t.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "EventID": eid, "Computer": campos.pop("Computer", DC), **campos})

# ruído normal: logons de dia útil
usuarios = {"ana": "10.0.0.21", "bob": "10.0.0.22", "carla": "10.0.0.23"}
for u, ip in usuarios.items():
    for h in (8, 9, 13, 14):
        t = DIA + timedelta(hours=h, minutes=random.randint(0, 59), seconds=random.randint(0, 59))
        ev(t, 4624, TargetUserName=u, IpAddress=ip, LogonType=2)
    if random.random() < 0.7:
        t = DIA + timedelta(hours=9, minutes=random.randint(0, 59))
        ev(t, 4625, TargetUserName=u, IpAddress=ip, LogonType=2, Status="0xC000006A")
        ev(t + timedelta(seconds=20), 4624, TargetUserName=u, IpAddress=ip, LogonType=2)
for h in (8, 12, 17):
    t = DIA + timedelta(hours=h, minutes=random.randint(0, 59))
    ev(t, 4688, SubjectUserName="ana", NewProcessName=r"C:\Windows\System32\notepad.exe",
       CommandLine="notepad.exe", Computer="WS-ANA")

# ataque (fixo, para o gabarito)
ATQ = "203.0.113.50"
inicio = DIA + timedelta(hours=2, minutes=10)
for i in range(38):
    ev(inicio + timedelta(seconds=6 * i + random.randint(0, 2)), 4625,
       TargetUserName="administrator", IpAddress=ATQ, LogonType=10, Status="0xC000006A")
ev(DIA + timedelta(hours=2, minutes=14, seconds=32), 4624,
   TargetUserName="administrator", IpAddress=ATQ, LogonType=10)
ev(DIA + timedelta(hours=2, minutes=14, seconds=32), 4672, SubjectUserName="administrator")
ev(DIA + timedelta(hours=2, minutes=15, seconds=10), 4688, SubjectUserName="administrator",
   NewProcessName=r"C:\Windows\System32\whoami.exe", CommandLine="whoami /all")
ev(DIA + timedelta(hours=2, minutes=16, seconds=2), 4688, SubjectUserName="administrator",
   NewProcessName=r"C:\Windows\System32\net.exe", CommandLine="net user suporte P@ssw0rd123 /add")
ev(DIA + timedelta(hours=2, minutes=16, seconds=2), 4720, TargetUserName="suporte",
   SubjectUserName="administrator")
ev(DIA + timedelta(hours=2, minutes=16, seconds=20), 4732, TargetUserName="suporte",
   GroupName="Administrators", SubjectUserName="administrator")
ev(DIA + timedelta(hours=2, minutes=19, seconds=45), 7045, ServiceName="Updater",
   ImagePath=r"C:\ProgramData\upd.exe", SubjectUserName="administrator")
ev(DIA + timedelta(hours=2, minutes=31, seconds=10), 1102, SubjectUserName="administrator")

eventos.sort(key=lambda e: e["TimeCreated"])
for e in eventos:
    print(json.dumps(e, ensure_ascii=False))
