// Trilha: todas as fases com progresso, labs e a checklist completa, tudo marcável num só lugar.

import { h, barra, baixar, aviso, plural } from './dom.js';
import { progresso } from './progress.js';
import { manifesto, doc } from './data.js';
import { store } from './store.js';
import { extrairTarefas, htmlInline, rotaDoc } from './md.js';
import { labs as carregarLabs } from './data.js';

function contagem(f) {
  const partes = [];
  if (f.tarefasTotal) partes.push(`${f.tarefasFeitas} de ${f.tarefasTotal} ${plural(f.tarefasTotal, 'item', 'itens')}`);
  if (f.labsTotal) partes.push(`${f.labsFeitos} de ${f.labsTotal} ${plural(f.labsTotal, 'lab', 'labs')}`);
  return partes.join(' e ') || 'sem itens para marcar';
}

async function carregarItens(f, alvo, titulos) {
  alvo.replaceChildren(h('p', { class: 'mudo' }, 'Carregando a checklist…'));
  const blocos = [];
  for (const d of f.docs) {
    const indices = f.tarefas.filter((t) => t.doc === d.path).map((t) => t.i);
    if (!indices.length) continue;
    const itens = extrairTarefas(await doc(d.path));
    blocos.push(h('div', { class: 'grupo' },
      h('h4', null, h('a', { href: rotaDoc(d.path) }, titulos.get(d.path) || d.path)),
      h('ul', { class: 'checklist' }, indices.map((i) => {
        const chave = `${d.path}#${i}`;
        const id = `t-${f.id}-${d.path.replace(/\W+/g, '_')}-${i}`;
        const cb = h('input', { type: 'checkbox', id });
        cb.checked = store.marcado(chave);
        cb.addEventListener('change', () => store.marcar(chave, cb.checked));
        return h('li', null, h('label', { for: id, class: 'marca-item' }, cb, h('span', { html: htmlInline(itens[i] ? itens[i].texto : `Item ${i + 1}`) })));
      }))));
  }
  alvo.replaceChildren(...blocos);
}

function blocoFase(f, ls, titulos, rotulo) {
  const cont = h('span', { class: 'cont' }, contagem(f));
  const barraEl = barra(f.feito, f.total, `Progresso: ${rotulo}`);
  const estado = f.frac >= 1 ? 'Concluída' : f.pulada ? 'Pulada pelo diagnóstico' : f.feito > 0 ? 'Em andamento' : 'Não iniciada';

  const labsLista = f.labs.length
    ? h('div', { class: 'grupo' }, h('h4', null, 'Laboratórios'),
      h('ul', { class: 'checklist' }, f.labs.map((id) => {
        const lab = ls.find((l) => l.id === id);
        const cid = 'lab-' + id.replace(/\W+/g, '_');
        const cb = h('input', { type: 'checkbox', id: cid });
        cb.checked = store.labFeito(id);
        cb.addEventListener('change', () => store.marcarLab(id, cb.checked));
        return h('li', null, h('label', { for: cid, class: 'marca-item' }, cb,
          h('span', null, `Lab ${lab.numero}: ${lab.titulo} `, h('span', { class: 'mudo' }, `(${lab.tempo})`))),
          h('a', { class: 'lab-abrir', href: rotaDoc(lab.readme) }, 'Abrir', h('span', { class: 'so-leitor' }, ` o lab ${lab.numero}`)));
      })))
    : null;

  const itens = h('div', { class: 'itens-carga' });
  let carregado = false;
  const detalhes = f.tarefasTotal
    ? h('details', { class: 'checklist-caixa', ontoggle: (e) => {
      if (e.target.open && !carregado) { carregado = true; carregarItens(f, itens, titulos).catch(() => { itens.textContent = 'Não foi possível carregar a checklist.'; }); }
    } }, h('summary', null, 'Checklist da fase'), itens)
    : null;

  const acoes = h('p', { class: 'acoes-fase' },
    h('a', { class: 'btn btn--sec', href: rotaDoc(f.leia) }, `Ler ${f.num !== undefined ? 'a fase' : 'a trilha'}`),
    f.quiz ? h('a', { class: 'btn btn--sec', href: `#/quiz/${f.quiz}` }, 'Fazer o quiz') : null);

  const el = h('article', { class: `fase fase--${f.pulada ? 'pulada' : f.frac >= 1 ? 'feita' : 'aberta'}`, 'data-fase': f.id },
    h('h3', null, rotulo),
    h('p', { class: 'meta' }, h('span', null, estado), h('span', null, `${f.duracao}`), h('span', null, `cerca de ${f.horas} h`)),
    h('p', null, f.resumo),
    h('p', { class: 'progresso-linha' }, barraEl, cont),
    labsLista, detalhes, acoes);

  el.atualizar = (novo) => {
    cont.textContent = contagem(novo);
    barraEl.value = novo.feito;
    barraEl.max = novo.total || 1;
  };
  return el;
}

function ferramentas(ctx) {
  const entrada = h('input', { type: 'file', accept: 'application/json,.json', class: 'so-leitor', id: 'arquivo-progresso', tabindex: '-1' });
  entrada.addEventListener('change', async () => {
    const arq = entrada.files && entrada.files[0];
    if (!arq) return;
    try {
      store.importar(JSON.parse(await arq.text()));
      aviso('Progresso carregado.');
      ctx.recarregar();
    } catch (e) {
      aviso(e instanceof SyntaxError ? 'O arquivo não é um JSON válido.' : e.message);
    }
    entrada.value = '';
  });
  return h('div', { class: 'ferramentas' },
    h('p', null, 'Seu progresso fica só neste navegador. Para levar para outro computador ou fazer backup, salve em um arquivo.'),
    h('div', { class: 'botoes' },
      h('button', { class: 'btn btn--sec', type: 'button', onclick: () => baixar('progresso-defensor-junior.json', store.exportar(), 'application/json') }, 'Salvar progresso em arquivo'),
      h('label', { class: 'btn btn--sec', for: 'arquivo-progresso' }, 'Carregar de um arquivo'),
      entrada,
      h('button', { class: 'btn btn--perigo', type: 'button', onclick: () => {
        if (confirm('Apagar todo o progresso deste navegador? Isso não pode ser desfeito.')) {
          store.apagar();
          aviso('Progresso apagado.');
          ctx.recarregar();
        }
      } }, 'Apagar progresso')));
}

export async function render(ctx) {
  const [p, ls, man] = await Promise.all([progresso(), carregarLabs(), manifesto()]);
  const titulos = new Map(man.map((m) => [m.path, m.title]));
  const pct = Math.round(p.frac * 100);

  const cartoes = [];
  const fasesEl = p.fases.map((f) => {
    const el = blocoFase(f, ls, titulos, `Fase ${f.num}: ${f.nome}`);
    cartoes.push([f.id, el, 'fases']);
    return el;
  });
  const trilhasEl = p.trilhas.map((t) => {
    const el = blocoFase(t, ls, titulos, t.nome);
    cartoes.push([t.id, el, 'trilhas']);
    return el;
  });

  const geral = h('p', { class: 'progresso-linha progresso-geral' },
    barra(p.feito, p.total, 'Progresso geral'),
    h('span', { id: 'geral-txt' }, `${p.feito} de ${p.total} ${plural(p.total, 'item', 'itens')} (${pct}%)`));

  const desinscrever = store.onChange(async () => {
    const novo = await progresso();
    geral.querySelector('progress').value = novo.feito;
    geral.querySelector('progress').max = novo.total || 1;
    geral.querySelector('#geral-txt').textContent = `${novo.feito} de ${novo.total} ${plural(novo.total, 'item', 'itens')} (${Math.round(novo.frac * 100)}%)`;
    for (const [id, el, grupo] of cartoes) el.atualizar(novo[grupo].find((x) => x.id === id));
  });
  ctx.aoSair(desinscrever);

  const el = h('div', { class: 'miolo trilha' },
    h('h1', null, 'Sua trilha'),
    h('p', { class: 'lead' }, 'Todas as fases em um lugar. Marque itens e labs conforme avança; a linha da página inicial acompanha.'),
    geral,
    h('div', { class: 'fases' }, fasesEl),
    h('h2', null, 'Trilhas de certificação'),
    h('p', null, 'Opcionais. Não são requisito para a primeira vaga, mas organizam o estudo e ensinam o vocabulário das ferramentas Microsoft.'),
    h('div', { class: 'fases' }, trilhasEl),
    h('h2', null, 'Seu progresso'),
    ferramentas(ctx));
  return { titulo: 'Sua trilha', el };
}
