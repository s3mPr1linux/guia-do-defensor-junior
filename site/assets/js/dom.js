// Utilitários de DOM. Nenhum dado externo entra por innerHTML: use h() com filhos de texto.

export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k === 'html') el.innerHTML = v; // somente HTML já sanitizado
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  anexar(el, kids);
  return el;
}

export function anexar(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return el;
}

export const $ = (sel, raiz = document) => raiz.querySelector(sel);
export const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

export function limpar(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

export function semAcento(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function slug(s) {
  return semAcento(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function fmtData(d) {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function plural(n, um, varios) {
  return n === 1 ? um : varios;
}

export function reduzMovimento() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

let tAviso;
export function aviso(msg) {
  const el = document.getElementById('aviso');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visivel');
  clearTimeout(tAviso);
  tAviso = setTimeout(() => el.classList.remove('visivel'), 3400);
}

export function barra(feito, total, rotulo) {
  const p = h('progress', { max: total || 1, value: feito, 'aria-label': rotulo });
  p.textContent = total ? `${Math.round((feito / total) * 100)}%` : '0%';
  return p;
}

export function baixar(nome, conteudo, tipo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = h('a', { href: url, download: nome });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const ta = h('textarea', { 'aria-hidden': 'true', style: 'position:fixed;opacity:0' }, texto);
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* sem suporte */ }
    ta.remove();
    return ok;
  }
}
