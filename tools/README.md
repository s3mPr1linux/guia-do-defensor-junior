# Site do guia

O site é estático (HTML, CSS e JavaScript puro, sem framework nem CDN) e lê os próprios `.md` do repositório. Não há conteúdo duplicado: o que você edita nas pastas numeradas é o que aparece no site.

## Ver localmente

```bash
python3 tools/build_site.py          # gera a pasta _site/
python3 -m http.server -d _site      # abre em http://localhost:8000
```

Abrir o `index.html` direto do disco não funciona: o navegador bloqueia o carregamento dos dados nesse modo.

## O que o build faz

`tools/build_site.py` (só biblioteca padrão do Python) copia `site/` e os `.md` para `_site/` e gera `data/*.json`: índice de páginas, busca, labs, glossário e o quiz do SC-900 (lido de `05-certificacoes-cursos/sc-900/autoavaliacao.md` e do gabarito). Ele **falha** se algo estiver inconsistente: fase apontando para arquivo inexistente, lab sem os campos esperados, quiz com número de questões diferente do gabarito.

## Publicar no GitHub Pages

1. Em *Settings → Pages*, escolha **Source: GitHub Actions**.
2. Faça push na `main`. O workflow `.github/workflows/pages.yml` gera e publica o site.

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Fases, horas e itens que contam no progresso | `site/data/phases.json` |
| Ambiente de cada lab (offline, Docker, nuvem) | `site/data/labs-meta.json` |
| Flashcards da Fase 1 | `site/data/quizzes/fase1.json` |
| Repositório, branch, nomes das seções | `site/data/config.json` |
| Visual | `site/assets/css/app.css` |

O progresso é guardado no `localStorage` do navegador (chave `gdj:v1`). Itens de checklist são identificados por `caminho-do-arquivo#posição`; se você reordenar ou inserir itens `- [ ]` numa página, o progresso de quem já marcou pode se deslocar.

Fontes e bibliotecas incluídas em `site/assets/` estão listadas em `site/assets/THIRD_PARTY.md`.
