#!/usr/bin/env python3
"""Gera o site estático do Guia do Defensor Júnior.

Uso:
    python3 tools/build_site.py            # gera ./_site
    python3 tools/build_site.py --out dist # outra pasta de saída

O que faz:
  1. copia site/ (HTML, CSS, JS, fontes, dados escritos à mão) para a pasta de saída;
  2. copia todos os .md do repositório para <saida>/content/ (o navegador os renderiza);
  3. gera data/manifest.json, search.json, labs.json, glossary.json e quizzes/sc900.json
     a partir dos próprios .md, para que o conteúdo tenha uma única fonte da verdade;
  4. valida as referências de site/data/phases.json (docs e labs existem?).

Só usa a biblioteca padrão do Python.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
IGNORAR_DIRS = {".git", ".github", "_site", "dist", "node_modules", "site", "tools", "__pycache__"}
RE_TASK = re.compile(r"^\s*[-*]\s+\[[ xX]\]\s+", re.M)
RE_FENCE = re.compile(r"^```.*?^```", re.M | re.S)
RE_H1 = re.compile(r"^#\s+(.+?)\s*$", re.M)
RE_H = re.compile(r"^(#{1,4})\s+(.+?)\s*$", re.M)


def sem_acento(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def limpar_md_inline(s: str) -> str:
    s = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
    s = re.sub(r"[*_`]+", "", s)
    return s.strip()


def texto_puro(md: str) -> str:
    md = RE_FENCE.sub(lambda m: m.group(0).replace("```", " "), md)
    md = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", md)
    md = re.sub(r"^#{1,6}\s+", "", md, flags=re.M)
    md = re.sub(r"^\s*[-*]\s+(\[[ xX]\]\s+)?", "", md, flags=re.M)
    md = re.sub(r"^\s*\|?[-:| ]{3,}\|?\s*$", "", md, flags=re.M)
    md = re.sub(r"[*_`|>]+", " ", md)
    return re.sub(r"\s+", " ", md).strip()


def listar_markdown() -> list[Path]:
    achados = []
    for p in sorted(RAIZ.rglob("*.md")):
        rel = p.relative_to(RAIZ)
        if rel.parts[0] in IGNORAR_DIRS or any(part in IGNORAR_DIRS for part in rel.parts[:-1]):
            continue
        achados.append(p)
    return achados


def eh_spoiler(rel: str) -> bool:
    nome = rel.rsplit("/", 1)[-1]
    return nome == "solucao.md" or nome.endswith("-gabarito.md")


def chave_natural(s: str):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s.lower())]


def construir_manifesto(arquivos: list[Path]) -> tuple[list[dict], list[dict]]:
    manifesto, busca = [], []
    for p in arquivos:
        rel = p.relative_to(RAIZ).as_posix()
        md = p.read_text(encoding="utf-8")
        sem_codigo = RE_FENCE.sub("", md)
        h1 = RE_H1.search(sem_codigo)
        titulo = limpar_md_inline(h1.group(1)) if h1 else p.stem
        secao = rel.split("/")[0] if "/" in rel else ""
        spoiler = eh_spoiler(rel)
        manifesto.append({
            "path": rel, "title": titulo, "section": secao,
            "tasks": len(RE_TASK.findall(sem_codigo)), "spoiler": spoiler,
        })
        if not spoiler:
            titulos = [limpar_md_inline(m.group(2)) for m in RE_H.finditer(sem_codigo)][1:]
            busca.append({"path": rel, "title": titulo, "section": secao,
                          "headings": titulos[:30], "text": texto_puro(md)[:12000]})
    manifesto.sort(key=lambda d: chave_natural(d["path"]))
    return manifesto, busca


def construir_glossario() -> list[dict]:
    p = RAIZ / "10-glossario" / "README.md"
    termos = []
    for linha in p.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^- \*\*(.+?):\*\*\s*(.+)$", linha)
        if m:
            termos.append({"termo": m.group(1).strip(), "definicao": m.group(2).strip()})
    termos.sort(key=lambda t: sem_acento(t["termo"]).lower())
    return termos


def parse_cabecalho_lab(md: str) -> dict:
    campos: dict[str, str] = {}
    for linha in md.splitlines()[:8]:
        if "**" not in linha or ":**" not in linha and "**Domínio" not in linha:
            continue
        for parte in linha.split(" · "):
            parte = parte.strip()
            m = re.match(r"\*\*Dom[ií]nio\s+(\d)\*\*", parte)
            if m:
                campos["dominio"] = m.group(1)
                continue
            m = re.match(r"\*\*([^*:]+):\*\*\s*(.+)$", parte)
            if m:
                campos[m.group(1).strip().lower()] = limpar_md_inline(m.group(2))
        if campos:
            break
    return campos


def construir_labs(meta: dict) -> list[dict]:
    labs = []
    for readme in sorted(RAIZ.glob("04-laboratorios/**/lab-*/README.md"), key=lambda p: chave_natural(p.as_posix())):
        pasta = readme.parent.relative_to(RAIZ).as_posix()
        md = readme.read_text(encoding="utf-8")
        h1 = RE_H1.search(md)
        titulo = limpar_md_inline(h1.group(1)) if h1 else readme.parent.name
        titulo = re.sub(r"^Lab\s*\d+\s*[—–-]\s*", "", titulo)
        campos = parse_cabecalho_lab(md)
        info = meta.get(pasta, {})
        niveis = [n.strip() for n in re.split(r"[/|]", campos.get("nível", "")) if n.strip()]
        custo = campos.get("custo") or campos.get("licença", "")
        custo_curto = re.split(r"[;(]", custo)[0].strip(" .,")
        labs.append({
            "id": pasta, "numero": re.search(r"lab-(\d+)", pasta).group(1),
            "titulo": titulo, "trilha": info.get("trilha", ""), "fase": info.get("fase", ""),
            "niveis": niveis, "tempo": campos.get("tempo", ""),
            "custo": custo, "custo_curto": custo_curto,
            "precisa": campos.get("precisa de", ""), "modulo": campos.get("módulo", ""),
            "dominio": campos.get("dominio", ""), "env": info.get("env", []),
            "readme": f"{pasta}/README.md",
            "gabarito": f"{pasta}/solucao.md" if (readme.parent / "solucao.md").exists() else "",
        })
    return labs


def construir_quiz_sc900(manifesto: list[dict]) -> dict:
    base = RAIZ / "05-certificacoes-cursos" / "sc-900"
    texto = (base / "autoavaliacao.md").read_text(encoding="utf-8")
    gab = (base / "autoavaliacao-gabarito.md").read_text(encoding="utf-8")
    respostas = {int(n): r for n, r in re.findall(r"\|\s*(\d+)\s*\|\s*([a-d])\s*(?=\|)", gab)}
    titulos = {m["path"]: m["title"] for m in manifesto}
    dominios = {
        1: ("Conceitos de segurança, conformidade e identidade", "05-certificacoes-cursos/sc-900/01-conceitos-seguranca-conformidade-identidade.md"),
        2: ("Microsoft Entra", "05-certificacoes-cursos/sc-900/02-microsoft-entra.md"),
        3: ("Soluções de segurança da Microsoft", "05-certificacoes-cursos/sc-900/03-solucoes-de-seguranca.md"),
        4: ("Soluções de conformidade da Microsoft", "05-certificacoes-cursos/sc-900/04-solucoes-de-conformidade.md"),
    }
    questoes, dominio = [], 0
    for linha in texto.splitlines():
        m = re.match(r"^##\s+Dom[ií]nio\s+(\d)", linha)
        if m:
            dominio = int(m.group(1))
            continue
        m = re.match(r"^(\d+)\.\s+(.*?)\s*\(a\)\s*(.*?)\s*\(b\)\s*(.*?)\s*\(c\)\s*(.*?)\s*\(d\)\s*(.*)$", linha)
        if not m:
            continue
        n = int(m.group(1))
        if n not in respostas:
            raise SystemExit(f"Quiz SC-900: sem gabarito para a questão {n}")
        opcoes = [m.group(i).strip() for i in range(3, 7)]
        correta = "abcd".index(respostas[n])
        questoes.append({"id": f"q{n}", "dominio": dominio, "pergunta": m.group(2).strip(),
                         "opcoes": opcoes, "correta": correta})
    if len(questoes) != len(respostas):
        raise SystemExit(f"Quiz SC-900: {len(questoes)} questões lidas, {len(respostas)} no gabarito")
    return {
        "id": "sc900", "titulo": "SC-900: autoavaliação", "modo": "mc",
        "dominios": {str(k): {"nome": v[0], "modulo": v[1], "titulo_modulo": titulos.get(v[1], v[0])}
                     for k, v in dominios.items()},
        "questoes": questoes,
    }


def validar(phases: dict, manifesto: list[dict], labs: list[dict]) -> list[str]:
    erros = []
    por_path = {m["path"]: m for m in manifesto}
    ids_labs = {l["id"] for l in labs}

    def checa_doc(d, ctx):
        path = d["path"] if isinstance(d, dict) else d
        if path not in por_path:
            erros.append(f"{ctx}: documento inexistente: {path}")
            return
        total = por_path[path]["tasks"]
        if isinstance(d, dict):
            for i in d.get("only", []) + d.get("skip", []):
                if not 0 <= i < total:
                    erros.append(f"{ctx}: índice {i} fora do intervalo em {path} ({total} itens)")

    for f in phases["phases"]:
        for d in f.get("docs", []):
            checa_doc(d, f"fase {f['id']}")
        for l in f.get("labs", []):
            if l not in ids_labs:
                erros.append(f"fase {f['id']}: lab inexistente: {l}")
        if f.get("leia") not in por_path:
            erros.append(f"fase {f['id']}: 'leia' inexistente: {f.get('leia')}")
    for t in phases.get("trilhas", []):
        for l in t.get("labs", []):
            if l not in ids_labs:
                erros.append(f"trilha {t['id']}: lab inexistente: {l}")
        if t.get("leia") not in por_path:
            erros.append(f"trilha {t['id']}: 'leia' inexistente: {t.get('leia')}")
    for l in labs:
        if not l["env"]:
            erros.append(f"lab sem 'env' em site/data/labs-meta.json: {l['id']}")
    return erros


def escrever_json(caminho: Path, dados) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default="_site", help="pasta de saída (padrão: _site)")
    a = ap.parse_args()
    saida = (RAIZ / a.out).resolve()
    if RAIZ not in saida.parents:
        raise SystemExit("A pasta de saída deve ficar dentro do repositório.")

    if saida.exists():
        shutil.rmtree(saida)
    shutil.copytree(RAIZ / "site", saida)
    (saida / ".nojekyll").write_text("", encoding="utf-8")

    arquivos = listar_markdown()
    for p in arquivos:
        destino = saida / "content" / p.relative_to(RAIZ)
        destino.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(p, destino)

    manifesto, busca = construir_manifesto(arquivos)
    meta_labs = json.loads((RAIZ / "site/data/labs-meta.json").read_text(encoding="utf-8"))
    labs = construir_labs(meta_labs)
    phases = json.loads((RAIZ / "site/data/phases.json").read_text(encoding="utf-8"))

    erros = validar(phases, manifesto, labs)
    if erros:
        print("Erros de validação:", *erros, sep="\n  - ", file=sys.stderr)
        return 1

    escrever_json(saida / "data/manifest.json", manifesto)
    escrever_json(saida / "data/search.json", busca)
    escrever_json(saida / "data/labs.json", labs)
    escrever_json(saida / "data/glossary.json", construir_glossario())
    escrever_json(saida / "data/quizzes/sc900.json", construir_quiz_sc900(manifesto))

    tarefas = sum(m["tasks"] for m in manifesto)
    print(f"OK: {len(arquivos)} documentos, {tarefas} itens de checklist, {len(labs)} labs, "
          f"{len(construir_glossario())} termos, {len(busca)} entradas de busca -> {saida.relative_to(RAIZ)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
