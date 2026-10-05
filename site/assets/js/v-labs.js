// Catálogo de labs com filtros por trilha, nível e ambiente, e conclusão marcável.

import { h, plural } from './dom.js';
import { labs as carregarLabs } from './data.js';
import { store } from './store.js';
import { rotaDoc } from './md.js';

const TRILHAS = { fase1: 'Fase 1', sc900: 'SC-900' };
const AMBIENTES = {
  offline: 'Offline (só o seu computador)',
  docker: 'Docker',
  nuvem: 'Nuvem (tenant ou assinatura de estudo)',
  'estudo de caso': 'Tem versão de estudo de caso, sem licença',
};
const ORDEM_NIVEL = ['Iniciante', 'Intermediário', 'Avançado'];

export function filtrar(labs, f) {
  return labs.filter((l) =>
    (!f.trilha.size || f.trilha.has(l.trilha)) &&
    (!f.nivel.size || l.niveis.some((n) => f.nivel.has(n))) &&
    (!f.env.size || l.env.some((e) => f.env.has(e))));
}

export async function render() {
  const todos = await carregarLabs();
  const f = { trilha: new Set(), nivel: new Set(), env: new Set() };
  const lista = h('ul', { class: 'labs' });
  const contagem = h('p', { class: 'contagem', 'aria-live': 'polite' });

  const desenhar = () => {
    const vis = filtrar(todos, f);
    contagem.textContent = `${vis.length} de ${todos.length} ${plural(todos.length, 'lab', 'labs')}`;
    lista.replaceChildren(...(vis.length ? vis.map((l) => {
      const id = 'cl-' + l.id.replace(/\W+/g, '_');
      const cb = h('input', { type: 'checkbox', id });
      cb.checked = store.labFeito(l.id);
      cb.addEventListener('change', () => store.marcarLab(l.id, cb.checked));
      const meta = [
        l.niveis.join(' ou '),
        l.tempo,
        l.env.map((e) => (e === 'estudo de caso' ? 'tem estudo de caso' : e)).join(', '),
        l.custo_curto ? `custo: ${l.custo_curto}` : '',
      ].filter(Boolean);
      return h('li', { class: 'lab' },
        h('label', { class: 'lab-ok', for: id }, cb, h('span', { class: 'so-leitor' }, `Marcar o lab ${l.numero} como concluído`)),
        h('div', { class: 'lab-corpo' },
          h('a', { class: 'lab-titulo', href: rotaDoc(l.readme) }, `Lab ${l.numero}: ${l.titulo}`),
          h('p', { class: 'lab-meta' }, meta.map((t) => h('span', null, t))),
          h('p', { class: 'lab-trilha mudo' }, `${TRILHAS[l.trilha] || l.trilha}${l.dominio ? `, domínio ${l.dominio}` : ''}${l.modulo ? `, módulo ${l.modulo}` : ''}`)));
    }) : [h('li', { class: 'vazio' }, 'Nenhum lab com essa combinação. Desmarque algum filtro para ver mais.')]));
  };

  const grupo = (titulo, chave, opcoes) => {
    const botoes = opcoes.map(([valor, rotulo]) => {
      const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false' }, rotulo);
      b.addEventListener('click', () => {
        const ativo = f[chave].has(valor);
        if (ativo) f[chave].delete(valor); else f[chave].add(valor);
        b.setAttribute('aria-pressed', String(!ativo));
        desenhar();
      });
      return b;
    });
    return h('fieldset', { class: 'filtro' }, h('legend', null, titulo), h('div', { class: 'chips' }, botoes));
  };

  const niveis = ORDEM_NIVEL.filter((n) => todos.some((l) => l.niveis.includes(n)));
  const ambientes = Object.keys(AMBIENTES).filter((e) => todos.some((l) => l.env.includes(e)));

  desenhar();
  const el = h('div', { class: 'miolo' },
    h('h1', null, 'Laboratórios'),
    h('p', { class: 'lead' }, 'Prática vale mais que leitura. Cada lab tem objetivo, passo a passo, gabarito e o que documentar no seu portfólio.'),
    h('div', { class: 'filtros' },
      grupo('Trilha', 'trilha', Object.entries(TRILHAS)),
      grupo('Nível', 'nivel', niveis.map((n) => [n, n])),
      grupo('Ambiente', 'env', ambientes.map((e) => [e, AMBIENTES[e]]))),
    contagem, lista,
    h('p', { class: 'mudo' }, 'Segurança primeiro: use só ambientes isolados e seus. Nos labs de nuvem, crie um tenant de estudo, configure alerta de custo e apague os recursos ao terminar.'));
  return { titulo: 'Laboratórios', el };
}
