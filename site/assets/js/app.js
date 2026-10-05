// Shell do site: rotas por hash (funciona no GitHub Pages sem servidor), tema, busca e rodapé.

import { h, $, $$, limpar } from './dom.js';
import { config } from './data.js';
import { store } from './store.js';
import { progresso } from './progress.js';
import { abrirBusca, fecharBusca } from './busca.js';

const rotas = [
  { re: /^\/$/, modulo: './v-home.js', nav: '' },
  { re: /^\/trilha$/, modulo: './v-trilha.js', nav: 'trilha' },
  { re: /^\/doc\/(.+)$/, modulo: './v-doc.js', nav: '' },
  { re: /^\/labs$/, modulo: './v-labs.js', nav: 'labs' },
  { re: /^\/quiz(?:\/([a-z0-9]+))?$/, modulo: './v-quiz.js', nav: 'quiz' },
  { re: /^\/planejador$/, modulo: './v-plan.js', nav: 'planejador' },
  { re: /^\/glossario$/, modulo: './v-glossario.js', nav: 'glossario' },
];

let saidas = [];
let ticket = 0;

function marcarNav(chave) {
  for (const a of $$('#nav a')) {
    if (a.dataset.rota === chave) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}

function paginaErro(titulo, ...corpo) {
  return h('div', { class: 'miolo' }, h('h1', null, titulo), ...corpo);
}

function naoEncontrada(caminho) {
  return {
    titulo: 'Página não encontrada',
    el: paginaErro('Página não encontrada',
      h('p', null, `Não existe nada em “${caminho}”.`),
      h('p', null, h('a', { class: 'btn', href: '#/' }, 'Voltar ao início'))),
  };
}

function falha(e) {
  const local = location.protocol === 'file:';
  return paginaErro('Não foi possível carregar esta página',
    h('p', null, e && e.message ? e.message : 'Erro inesperado.'),
    local
      ? h('p', null, 'Você abriu o arquivo direto do disco. Navegadores bloqueiam o carregamento de dados nesse modo. Rode ',
        h('code', null, 'python3 -m http.server -d _site'), ' e abra http://localhost:8000.')
      : h('p', null, 'Verifique a conexão e tente de novo.'),
    h('p', null, h('button', { class: 'btn', type: 'button', onclick: () => navegar() }, 'Tentar de novo')));
}

export async function navegar() {
  const bruto = location.hash.slice(1);
  if (bruto && !bruto.startsWith('/')) return; // âncora solta, não é uma rota
  const [caminho, consulta = ''] = (bruto || '/').split('?');
  const query = Object.fromEntries(new URLSearchParams(consulta));
  const meu = ++ticket;
  const main = $('#principal');

  saidas.forEach((f) => { try { f(); } catch { /* ignora */ } });
  saidas = [];
  fecharBusca();

  const achada = rotas.map((r) => ({ r, m: caminho.match(r.re) })).find((x) => x.m);
  marcarNav(achada ? achada.r.nav : '');
  main.setAttribute('aria-busy', 'true');

  let res;
  try {
    if (!achada) res = naoEncontrada(caminho);
    else {
      const mod = await import(achada.r.modulo);
      res = await mod.render({
        params: achada.m.slice(1), query, caminho,
        aoSair: (f) => saidas.push(f),
        recarregar: () => navegar(),
      });
    }
  } catch (e) {
    res = { titulo: 'Erro', el: falha(e) };
  }
  if (meu !== ticket) return; // outra navegação começou enquanto esta carregava

  limpar(main).append(res.el);
  main.removeAttribute('aria-busy');
  document.title = res.titulo ? `${res.titulo} | Guia do Defensor Júnior` : 'Guia do Defensor Júnior';
  if (res.depois) res.depois();
  else window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

function iniciarTema() {
  const btn = $('#alternar-tema');
  const escuro = () => {
    const t = document.documentElement.dataset.tema;
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const refletir = () => btn.setAttribute('aria-pressed', String(escuro()));
  refletir();
  btn.addEventListener('click', () => {
    const novo = escuro() ? 'light' : 'dark';
    document.documentElement.dataset.tema = novo;
    store.definirTema(novo);
    refletir();
  });
}

async function atualizarNav() {
  try {
    const p = await progresso();
    const a = $('#nav a[data-rota="trilha"]');
    if (!a) return;
    a.querySelector('.nav-pct')?.remove();
    a.removeAttribute('aria-label');
    if (p.feito > 0) {
      const pct = Math.round(p.frac * 100);
      a.append(h('span', { class: 'nav-pct', 'aria-hidden': 'true' }, `${pct}%`));
      a.setAttribute('aria-label', `Trilha, ${pct}% concluída`);
    }
  } catch { /* o menu funciona sem o percentual */ }
}

async function iniciarRodape() {
  try {
    const cfg = await config();
    const base = `https://github.com/${cfg.repo}`;
    $('#rodape-links').append(
      h('a', { href: base, target: '_blank', rel: 'noopener noreferrer' }, 'Repositório no GitHub'),
      h('a', { href: base + '/issues', target: '_blank', rel: 'noopener noreferrer' }, 'Reportar um erro'),
      h('a', { href: '#/doc/CONTRIBUTING.md' }, 'Como contribuir'),
    );
  } catch { /* rodapé sem links */ }
}

function iniciarAtalhos() {
  $('#abrir-busca').addEventListener('click', () => abrirBusca());
  document.addEventListener('keydown', (e) => {
    const alvo = e.target;
    const digitando = alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName));
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !digitando && !e.ctrlKey && !e.metaKey && !e.altKey)) {
      e.preventDefault();
      abrirBusca();
    }
  });
  $('[data-pular]').addEventListener('click', (e) => {
    e.preventDefault();
    $('#principal').focus();
  });
}

iniciarTema();
iniciarAtalhos();
iniciarRodape();
store.onChange(() => { clearTimeout(iniciarAtalhos.t); iniciarAtalhos.t = setTimeout(atualizarNav, 150); });
window.addEventListener('hashchange', navegar);
atualizarNav();
navegar();
