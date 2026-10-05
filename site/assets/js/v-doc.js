// Leitor de documentos: índice lateral, sumário da página, checklists que salvam, gabaritos escondidos.

import { h, $, plural } from './dom.js';
import { config, manifesto, doc, urlGitHub } from './data.js';
import { store } from './store.js';
import { renderizar, rotaDoc, irParaAncora } from './md.js';

const SEC_RAIZ = '__projeto';

function montarArvore(man, cfg) {
  const secoes = new Map(Object.keys(cfg.secoes).map((k) => [k, { nome: cfg.secoes[k], dir: k, readme: null, arquivos: [], filhos: new Map() }]));
  secoes.set(SEC_RAIZ, { nome: 'Sobre o projeto', dir: '', readme: null, arquivos: [], filhos: new Map() });
  for (const m of man) {
    if (m.spoiler || m.path.includes('/_template/')) continue;
    const partes = m.path.split('/');
    if (partes.length === 1) { secoes.get(SEC_RAIZ).arquivos.push(m); continue; }
    let no = secoes.get(partes[0]);
    if (!no) continue;
    let dir = partes[0];
    for (const seg of partes.slice(1, -1)) {
      dir += '/' + seg;
      if (!no.filhos.has(seg)) no.filhos.set(seg, { nome: seg.replace(/[-_]+/g, ' '), dir, readme: null, arquivos: [], filhos: new Map() });
      no = no.filhos.get(seg);
    }
    if (partes.at(-1) === 'README.md') no.readme = m; else no.arquivos.push(m);
  }
  return secoes;
}

function ordemPlana(no, saida = []) {
  if (no.readme) saida.push(no.readme);
  saida.push(...no.arquivos);
  for (const f of no.filhos.values()) ordemPlana(f, saida);
  return saida;
}

function elNo(no, atual, nivel) {
  const abre = no.dir === '' ? !atual.includes('/') : (atual === no.dir || atual.startsWith(no.dir + '/'));
  const itens = [];
  const link = (m) => h('li', null, h('a', { href: rotaDoc(m.path), 'aria-current': m.path === atual ? 'page' : null }, m.title));
  if (no.readme) itens.push(link(no.readme));
  no.arquivos.forEach((m) => itens.push(link(m)));
  for (const f of no.filhos.values()) itens.push(h('li', null, elNo(f, atual, nivel + 1)));
  return h('details', { class: `no no--${nivel}`, open: abre }, h('summary', null, no.nome), h('ul', null, itens));
}

function menu(secoes, atualPath) {
  const ul = h('ul', { class: 'arv' });
  for (const no of secoes.values()) {
    if (!no.readme && !no.arquivos.length && !no.filhos.size) continue;
    ul.append(h('li', null, elNo(no, atualPath, 0)));
  }
  return ul;
}

const reLab = /^(04-laboratorios\/(?:[^/]+\/)*lab-[^/]+)\/README\.md$/;

function itensDaPagina(path, total) {
  let feitos = 0;
  for (let i = 0; i < total; i++) if (store.marcado(`${path}#${i}`)) feitos++;
  return feitos;
}

export async function render({ params, query, aoSair }) {
  const path = decodeURIComponent(params[0]);
  const [cfg, man] = await Promise.all([config(), manifesto()]);
  const porPath = new Map(man.map((m) => [m.path, m]));
  const meta = porPath.get(path);
  if (!meta) {
    return { titulo: 'Página não encontrada', el: h('div', { class: 'miolo' },
      h('h1', null, 'Página não encontrada'),
      h('p', null, `O guia não tem o arquivo “${path}”.`),
      h('p', null, h('a', { class: 'btn', href: '#/' }, 'Voltar ao início'))) };
  }

  const md = await doc(path);
  const { raiz, titulos } = renderizar(md, path, { porPath, cfg });
  const secoes = montarArvore(man, cfg);
  const secKey = path.includes('/') ? path.split('/')[0] : SEC_RAIZ;
  const secao = secoes.get(secKey);
  const plana = secao ? ordemPlana(secao) : [];
  const pos = plana.findIndex((m) => m.path === path);
  const anterior = pos > 0 ? plana[pos - 1] : null;
  const proximo = pos >= 0 && pos < plana.length - 1 ? plana[pos + 1] : null;

  // faixa de ações logo abaixo do título
  const faixa = h('div', { class: 'faixa-doc' });
  const labMatch = path.match(reLab);
  if (labMatch) {
    const id = labMatch[1];
    const btn = h('button', { class: 'btn btn--sec', type: 'button', 'aria-pressed': String(store.labFeito(id)) });
    const rot = () => { btn.textContent = store.labFeito(id) ? 'Lab concluído' : 'Marcar lab como concluído'; btn.setAttribute('aria-pressed', String(store.labFeito(id))); };
    btn.addEventListener('click', () => { store.marcarLab(id, !store.labFeito(id)); rot(); });
    rot();
    faixa.append(btn);
  }
  let contador = null;
  if (meta.tasks > 0) {
    contador = h('p', { class: 'contador-itens' });
    const atualizar = () => {
      contador.textContent = `Checklist desta página: ${itensDaPagina(path, meta.tasks)} de ${meta.tasks} ${plural(meta.tasks, 'item marcado', 'itens marcados')}.`;
    };
    atualizar();
    aoSair(store.onChange(atualizar));
    faixa.append(contador);
  }
  if (meta.spoiler) {
    faixa.append(h('p', { class: 'aviso-gabarito' }, 'Este é o gabarito. Tente resolver antes de olhar: o aprendizado está em errar e corrigir.'));
  }

  const h1 = $('h1', raiz);
  if (faixa.children.length) { if (h1) h1.after(faixa); else raiz.prepend(faixa); }

  let conteudo = raiz;
  if (meta.spoiler) {
    raiz.hidden = true;
    const gate = h('button', { class: 'btn', type: 'button', 'aria-expanded': 'false', onclick: (e) => {
      raiz.hidden = false;
      e.currentTarget.parentElement.remove();
      raiz.scrollIntoView?.({ block: 'start' });
    } }, 'Mostrar o gabarito');
    conteudo = h('div', null, h('div', { class: 'gate' }, h('p', null, 'O gabarito fica escondido até você pedir.'), gate), raiz);
  }

  const crumbs = h('nav', { class: 'migalhas', 'aria-label': 'Você está em' }, h('ol', null,
    h('li', null, h('a', { href: '#/' }, 'Início')),
    secao && secao.readme && secao.readme.path !== path ? h('li', null, h('a', { href: rotaDoc(secao.readme.path) }, secao.nome)) : (secao ? h('li', null, secao.nome) : null),
    h('li', { 'aria-current': 'page' }, meta.title)));

  const nav = h('nav', { class: 'menu', id: 'menu-doc', 'aria-label': 'Índice do guia' }, menu(secoes, path));
  const alternar = h('button', { class: 'btn btn--sec btn-menu', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'menu-doc',
    onclick: (e) => {
      const aberto = nav.classList.toggle('aberto');
      e.currentTarget.setAttribute('aria-expanded', String(aberto));
    } }, 'Índice do guia');

  const secoesToc = titulos.filter((t) => t.nivel === 2 || t.nivel === 3);
  const toc = secoesToc.length >= 3
    ? h('nav', { class: 'toc', 'aria-label': 'Nesta página' }, h('p', { class: 'toc-t' }, 'Nesta página'),
      h('ul', null, secoesToc.map((t) => h('li', { class: `toc-${t.nivel}` },
        h('a', { href: '#' + t.id, onclick: (e) => { e.preventDefault(); irParaAncora(t.id); } }, t.texto)))))
    : null;

  const passagem = h('nav', { class: 'passagem', 'aria-label': 'Navegar entre páginas' },
    anterior ? h('a', { href: rotaDoc(anterior.path), rel: 'prev' }, h('span', { class: 'mudo' }, 'Anterior'), anterior.title) : h('span'),
    proximo ? h('a', { href: rotaDoc(proximo.path), rel: 'next' }, h('span', { class: 'mudo' }, 'Próxima'), proximo.title) : h('span'));

  const rodapeDoc = h('p', { class: 'mudo editar' },
    h('a', { href: urlGitHub(cfg, path, 'edit'), target: '_blank', rel: 'noopener noreferrer' }, 'Sugerir uma correção desta página no GitHub'));

  const el = h('div', { class: 'doc' },
    h('div', { class: 'col-menu' }, alternar, nav),
    h('article', { class: 'conteudo' }, crumbs, conteudo, passagem, rodapeDoc),
    h('aside', { class: 'col-toc' }, toc));

  if (!meta.spoiler) store.visitar(path, meta.title);

  return {
    titulo: meta.title,
    el,
    depois() {
      if (query.a && irParaAncora('h-' + query.a)) return;
      window.scrollTo(0, 0);
    },
  };
}
