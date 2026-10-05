// Renderização de markdown: marked -> DOMPurify -> pós-processamento no DOM
// (ids de títulos, links relativos, copiar código, tabelas roláveis e checklists que salvam).

import { marked } from './vendor/marked.esm.js';
import DOMPurify from './vendor/purify.es.mjs';
import { h, $$, slug, aviso, copiar, reduzMovimento } from './dom.js';
import { store } from './store.js';
import { urlConteudo, urlGitHub } from './data.js';

marked.setOptions({ gfm: true, breaks: false });

const sanitizar = (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

export function htmlInline(texto) {
  return sanitizar(marked.parseInline(String(texto), { async: false }));
}

// Mesma regra do gerador: ignora blocos de código cercados e lista itens "- [ ] texto".
export function extrairTarefas(md) {
  const semCodigo = md.replace(/^```.*?^```/gms, '');
  const itens = [];
  for (const m of semCodigo.matchAll(/^\s*[-*]\s+\[([ xX])\]\s+(.+)$/gm)) itens.push({ texto: m[2].trim() });
  return itens;
}

export function resolverLink(href, docPath, porPath, cfg) {
  if (/^(https?:|mailto:)/i.test(href)) return { tipo: 'externo', href };
  if (href.startsWith('#')) return { tipo: 'ancora', ancora: slug(decodeURIComponent(href.slice(1))) };

  const [alvoBruto, ancora] = href.split('#');
  let alvo;
  try {
    alvo = decodeURIComponent(new URL(alvoBruto, 'https://x.invalid/' + docPath).pathname.slice(1));
  } catch {
    return { tipo: 'externo', href };
  }
  const candidatos = [alvo];
  if (alvo === '' || alvo.endsWith('/')) candidatos.push(alvo + 'README.md');
  else if (!/\.[a-z0-9]+$/i.test(alvo)) candidatos.push(alvo + '/README.md');
  for (const c of candidatos) {
    if (porPath.has(c)) return { tipo: 'doc', path: c, ancora: ancora ? slug(decodeURIComponent(ancora)) : '' };
  }
  const ehPasta = alvo === '' || alvo.endsWith('/') || !/\.[a-z0-9]+$/i.test(alvo);
  return { tipo: 'github', href: urlGitHub(cfg, alvo.replace(/\/$/, ''), ehPasta ? 'tree' : 'blob') };
}

export function rotaDoc(path, ancora) {
  return '#/doc/' + path.split('/').map(encodeURIComponent).join('/') + (ancora ? '?a=' + encodeURIComponent(ancora) : '');
}

export function renderizar(md, docPath, { porPath, cfg }) {
  const modelo = document.createElement('template');
  modelo.innerHTML = sanitizar(marked.parse(md, { async: false }));
  const raiz = h('div', { class: 'prosa' });
  raiz.append(modelo.content);

  // títulos com id estável (prefixo evita colisão com ids da página)
  const usados = new Set();
  const titulos = [];
  for (const t of $$('h1, h2, h3, h4', raiz)) {
    let base = 'h-' + (slug(t.textContent) || 'secao');
    let id = base;
    for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
    usados.add(id);
    t.id = id;
    titulos.push({ id, nivel: Number(t.tagName[1]), texto: t.textContent.trim() });
  }

  // links
  for (const a of $$('a[href]', raiz)) {
    const href = a.getAttribute('href');
    const r = resolverLink(href, docPath, porPath, cfg);
    if (r.tipo === 'externo' || r.tipo === 'github') {
      a.setAttribute('href', r.href);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      if (r.tipo === 'github') a.classList.add('ext-gh');
    } else if (r.tipo === 'doc') {
      a.setAttribute('href', rotaDoc(r.path, r.ancora));
    } else {
      a.setAttribute('href', '#' + r.ancora);
      a.dataset.ancora = 'h-' + r.ancora;
    }
  }

  // imagens relativas
  const dir = docPath.includes('/') ? docPath.slice(0, docPath.lastIndexOf('/') + 1) : '';
  for (const img of $$('img[src]', raiz)) {
    const src = img.getAttribute('src');
    if (!/^(https?:|data:)/i.test(src)) img.setAttribute('src', urlConteudo(dir + src));
    img.setAttribute('loading', 'lazy');
  }

  // tabelas roláveis (com foco por teclado)
  for (const tb of $$('table', raiz)) {
    const env = h('div', { class: 'tabela', tabindex: '0', role: 'region', 'aria-label': 'Tabela rolável' });
    tb.replaceWith(env);
    env.append(tb);
  }

  // blocos de código com botão de copiar
  for (const pre of $$('pre', raiz)) {
    const code = pre.querySelector('code');
    const env = h('div', { class: 'codigo' });
    pre.replaceWith(env);
    env.append(pre);
    env.append(h('button', {
      class: 'copiar', type: 'button',
      onclick: async (e) => {
        const ok = await copiar((code || pre).textContent.replace(/\n$/, ''));
        const b = e.currentTarget;
        b.textContent = ok ? 'Copiado' : 'Não foi possível copiar';
        aviso(ok ? 'Código copiado.' : 'Não foi possível copiar. Selecione o texto e use Ctrl+C.');
        setTimeout(() => { b.textContent = 'Copiar'; }, 1800);
      },
    }, 'Copiar'));
  }

  // checklists que salvam o progresso
  $$('input[type="checkbox"]', raiz).forEach((cb, i) => {
    const chave = `${docPath}#${i}`;
    const li = cb.closest('li');
    cb.removeAttribute('disabled');
    cb.checked = store.marcado(chave);
    cb.dataset.chave = chave;
    if (li) {
      li.classList.add('tarefa');
      const texto = li.textContent.trim().replace(/\s+/g, ' ');
      cb.setAttribute('aria-label', texto.length > 120 ? texto.slice(0, 117) + '…' : texto);
      li.addEventListener('click', (e) => {
        if (e.target.closest('a, button') || e.target === cb) return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
    cb.addEventListener('change', () => store.marcar(chave, cb.checked));
  });

  // âncoras dentro da página (não mexem na rota)
  raiz.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-ancora]');
    if (!a) return;
    e.preventDefault();
    irParaAncora(a.dataset.ancora);
  });

  return { raiz, titulos };
}

export function irParaAncora(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: reduzMovimento() ? 'auto' : 'smooth', block: 'start' });
  return true;
}
