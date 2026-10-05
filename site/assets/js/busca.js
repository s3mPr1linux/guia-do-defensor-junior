// Busca no guia inteiro (índice gerado no build), com teclado: / ou Ctrl+K abre, setas navegam, Enter abre, Esc fecha.

import { h, $, limpar, semAcento } from './dom.js';
import { indiceBusca, config } from './data.js';
import { rotaDoc } from './md.js';

let aberta = false;
let indice = null;
let fechar = () => {};

export function fecharBusca() {
  if (aberta) fechar();
}

async function carregar() {
  if (indice) return indice;
  const [dados, cfg] = await Promise.all([indiceBusca(), config()]);
  indice = dados.map((d) => ({
    ...d,
    secaoNome: cfg.secoes[d.section] || '',
    t: semAcento(d.title),
    hs: semAcento(d.headings.join(' ')),
    x: semAcento(d.text),
  }));
  return indice;
}

export function pontuar(item, tokens) {
  let pontos = 0;
  for (const tk of tokens) {
    let achou = false;
    if (item.t.includes(tk)) { pontos += item.t.startsWith(tk) ? 12 : 8; achou = true; }
    if (item.hs.includes(tk)) { pontos += 4; achou = true; }
    let n = 0;
    for (let i = item.x.indexOf(tk); i !== -1 && n < 5; i = item.x.indexOf(tk, i + tk.length)) n++;
    if (n) { pontos += n; achou = true; }
    if (!achou) return 0; // todas as palavras precisam aparecer
  }
  return pontos;
}

export function buscar(consulta, base) {
  const tokens = semAcento(consulta).split(/\s+/).filter((t) => t.length >= 2);
  if (!tokens.length) return [];
  return base
    .map((item) => ({ item, pontos: pontuar(item, tokens) }))
    .filter((r) => r.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 12)
    .map((r) => ({ ...r, tokens }));
}

function trecho(item, tokens) {
  const i = tokens.map((t) => item.x.indexOf(t)).filter((n) => n >= 0).sort((a, b) => a - b)[0];
  if (i === undefined) return h('span', null, item.text.slice(0, 140));
  const ini = Math.max(0, i - 50);
  const fim = Math.min(item.text.length, i + 110);
  const parte = item.text.slice(ini, fim);
  const norm = semAcento(parte);
  const marcas = [];
  for (const t of tokens) {
    for (let k = norm.indexOf(t); k !== -1; k = norm.indexOf(t, k + t.length)) marcas.push([k, k + t.length]);
  }
  marcas.sort((a, b) => a[0] - b[0]);
  const nos = [];
  let cursor = 0;
  for (const [a, b] of marcas) {
    if (a < cursor) continue;
    nos.push(parte.slice(cursor, a), h('mark', null, parte.slice(a, b)));
    cursor = b;
  }
  nos.push(parte.slice(cursor));
  return h('span', null, ini > 0 ? '…' : '', ...nos, fim < item.text.length ? '…' : '');
}

export async function abrirBusca() {
  if (aberta) return;
  aberta = true;
  const anterior = document.activeElement;
  const raiz = $('#busca-raiz');

  const campo = h('input', {
    type: 'search', class: 'busca-campo', role: 'combobox', autocomplete: 'off', spellcheck: 'false',
    'aria-expanded': 'false', 'aria-controls': 'busca-lista', 'aria-label': 'Buscar no guia',
    placeholder: 'Buscar no guia: redes, phishing, SC-900…',
  });
  const status = h('p', { class: 'busca-ajuda', id: 'busca-status', 'aria-live': 'polite' }, 'Digite pelo menos 2 letras. Use as setas para escolher e Enter para abrir.');
  const lista = h('ul', { id: 'busca-lista', class: 'busca-lista', role: 'listbox', 'aria-label': 'Resultados' });
  const painel = h('div', { class: 'busca', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Buscar no guia' }, campo, status, lista);
  const fundo = h('div', { class: 'busca-fundo' }, painel);
  raiz.append(fundo);
  document.body.classList.add('sem-rolagem');
  campo.focus();

  let ativo = -1;
  let resultados = [];

  const marcarAtivo = (n) => {
    const itens = [...lista.children];
    ativo = itens.length ? (n + itens.length) % itens.length : -1;
    itens.forEach((li, i) => {
      li.setAttribute('aria-selected', String(i === ativo));
      li.classList.toggle('ativo', i === ativo);
    });
    if (ativo >= 0) {
      campo.setAttribute('aria-activedescendant', itens[ativo].id);
      itens[ativo].scrollIntoView?.({ block: 'nearest' });
    } else campo.removeAttribute('aria-activedescendant');
  };

  const desenhar = async () => {
    const q = campo.value.trim();
    limpar(lista);
    resultados = [];
    if (q.length < 2) {
      status.textContent = 'Digite pelo menos 2 letras. Use as setas para escolher e Enter para abrir.';
      campo.setAttribute('aria-expanded', 'false');
      return;
    }
    let base;
    try { base = await carregar(); } catch (e) {
      status.textContent = 'Não foi possível carregar o índice de busca. Tente de novo em instantes.';
      return;
    }
    resultados = buscar(q, base);
    if (!resultados.length) {
      status.textContent = `Nada encontrado para “${q}”. Tente outra palavra, por exemplo o nome de uma ferramenta ou de um conceito.`;
      campo.setAttribute('aria-expanded', 'false');
      return;
    }
    status.textContent = `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'}.`;
    campo.setAttribute('aria-expanded', 'true');
    resultados.forEach((r, i) => {
      lista.append(h('li', { id: `res-${i}`, role: 'option', 'aria-selected': 'false', class: 'busca-item' },
        h('a', { href: rotaDoc(r.item.path), onclick: () => fechar() },
          h('span', { class: 'busca-titulo' }, r.item.title),
          h('span', { class: 'busca-secao' }, r.item.secaoNome),
          h('span', { class: 'busca-trecho' }, trecho(r.item, r.tokens)))));
    });
    marcarAtivo(0);
  };

  campo.addEventListener('input', desenhar);

  const aoTeclar = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); fechar(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); marcarAtivo(ativo + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); marcarAtivo(ativo - 1); }
    else if (e.key === 'Enter' && ativo >= 0 && resultados[ativo]) {
      e.preventDefault();
      const destino = rotaDoc(resultados[ativo].item.path);
      fechar();
      location.hash = destino;
    } else if (e.key === 'Tab') {
      const foco = [campo, ...lista.querySelectorAll('a')];
      const i = foco.indexOf(document.activeElement);
      const prox = e.shiftKey ? (i <= 0 ? foco.length - 1 : i - 1) : (i === foco.length - 1 ? 0 : i + 1);
      e.preventDefault();
      foco[prox].focus();
    }
  };
  fundo.addEventListener('keydown', aoTeclar);
  fundo.addEventListener('mousedown', (e) => { if (e.target === fundo) fechar(); });

  fechar = () => {
    aberta = false;
    fundo.remove();
    document.body.classList.remove('sem-rolagem');
    fechar = () => {};
    if (anterior && anterior.focus && document.contains(anterior)) anterior.focus();
  };
}
