# Componentes de terceiros (copiados para funcionar sem CDN)

| Componente | Versão | Licença |
|---|---|---|
| [marked](https://github.com/markedjs/marked) | 18.0.14 | MIT |
| [DOMPurify](https://github.com/cure53/DOMPurify) | 3.4.16 | Apache-2.0 ou MPL-2.0 |
| Bricolage Grotesque (via @fontsource-variable) | — | SIL OFL 1.1 |
| Atkinson Hyperlegible (via @fontsource) | — | SIL OFL 1.1 |
| JetBrains Mono (via @fontsource) | — | SIL OFL 1.1 |

Para atualizar: `npm install marked dompurify` num diretório temporário e copie `marked/lib/marked.esm.js` e `dompurify/dist/purify.es.mjs` para `site/assets/js/vendor/`.
