// Início: a linha da carreira (progresso por fase), o diagnóstico e o ponto de retomada.

import { h, barra, plural } from './dom.js';
import { progresso } from './progress.js';
import { doc, labs as carregarLabs, glossario } from './data.js';
import { store } from './store.js';
import { htmlInline, extrairTarefas, rotaDoc } from './md.js';

const DOC_FASE0 = '00-comece-aqui/README.md';

function estacao(f, i, p) {
  const feita = f.frac >= 1;
  const atual = i === p.atual;
  const estado = feita ? 'feita' : f.pulada ? 'pulada' : atual ? 'atual' : 'futura';
  const situacao = { feita: 'concluída', pulada: 'pulada pelo diagnóstico', atual: 'em andamento', futura: 'ainda não iniciada' }[estado];
  const comecou = p.feito > 0 || store.jaVisitou();
  const bandeira = atual ? h('span', { class: 'bandeira' }, comecou ? 'Você está aqui' : 'Comece aqui') : null;
  const meta = f.total ? `${f.feito} de ${f.total} ${plural(f.total, 'item', 'itens')}` : f.duracao;

  return h('li', { class: `est est--${estado}`, style: `--pf:${f.frac.toFixed(3)};--i:${i}` },
    bandeira,
    h('a', { class: 'est-link', href: rotaDoc(f.leia) },
      h('span', { class: 'est-ponto', 'aria-hidden': 'true' }, String(f.num)),
      h('span', { class: 'est-nome' }, f.nome, h('span', { class: 'so-leitor' }, `, ${situacao}`)),
      h('span', { class: 'est-meta' }, meta)));
}

function estacaoFim(p) {
  const chegou = p.atual >= p.fases.length;
  return h('li', { class: `est est--fim${chegou ? ' est--feita' : ''}`, style: '--pf:0;--i:6' },
    chegou ? h('span', { class: 'bandeira' }, 'Você chegou') : null,
    h('a', { class: 'est-link', href: rotaDoc('07-carreira/README.md') },
      h('span', { class: 'est-ponto', 'aria-hidden': 'true' }),
      h('span', { class: 'est-nome' }, p.terminal.nome),
      h('span', { class: 'est-meta' }, 'o objetivo')));
}

function linhaMetro(p) {
  const ol = h('ol', { class: 'linha', 'aria-label': 'Fases da trilha, da primeira à vaga' },
    ...p.fases.map((f, i) => estacao(f, i, p)), estacaoFim(p));
  // O trecho preenchido de cada fase cresce uma única vez, ao carregar.
  requestAnimationFrame(() => requestAnimationFrame(() => ol.classList.add('pronta')));
  return ol;
}

function resultadoDiagnostico(p) {
  const { marcados, itens } = p.diag;
  const fase = (id) => p.fases.find((f) => f.id === id);
  const link = (f, texto) => h('a', { class: 'btn btn--sec', href: rotaDoc(f.leia) }, texto);
  if (marcados <= 1) {
    return h('div', null,
      h('p', null, h('strong', null, 'Trilha do zero.'), ' Siga as fases na ordem. A Fase 1 monta a base que o resto do guia assume.'),
      link(fase('f1'), 'Abrir a Fase 1'));
  }
  if (marcados <= 4) {
    const faltam = itens.filter((d) => !d.marcado);
    return h('div', null,
      h('p', null, h('strong', null, 'Pule o que você já domina.'), ' Revise primeiro:'),
      h('ul', { class: 'lista-simples' }, faltam.map((d) => h('li', null, h('a', { href: rotaDoc(d.revisar) }, d.tema)))));
  }
  return h('div', null,
    h('p', null, h('strong', null, 'Você já tem a base.'), ' Vá direto para a defesa na prática e invista no portfólio. As fases anteriores ficam marcadas como puladas.'),
    link(fase('f3'), 'Abrir a Fase 3'));
}

async function proximoPasso(p) {
  const f = p.fases[p.atual];
  if (!f) return null;
  const t = f.tarefas.find((x) => !x.feito);
  if (t) {
    const itens = extrairTarefas(await doc(t.doc));
    const item = itens[t.i];
    if (item) return { fase: f, texto: item.texto, path: t.doc };
  }
  const labId = f.labs.find((id) => !store.labFeito(id));
  if (labId) {
    const ls = await carregarLabs();
    const lab = ls.find((l) => l.id === labId);
    if (lab) return { fase: f, texto: `Lab ${lab.numero}: ${lab.titulo}`, path: lab.readme };
  }
  return null;
}

async function painelRetomada(p) {
  const ultimo = store.ultimo();
  const pct = Math.round(p.frac * 100);
  if (!ultimo && p.feito === 0) {
    return h('section', { class: 'bloco' },
      h('h2', null, 'Seu progresso começa aqui'),
      h('p', null, 'Marque os itens das checklists, conclua labs e faça os quizzes. O avanço aparece na linha acima e fica salvo neste navegador, sem conta e sem enviar nada.'),
      h('a', { class: 'btn', href: rotaDoc(DOC_FASE0) }, 'Começar pela Fase 0'));
  }
  const prox = await proximoPasso(p).catch(() => null);
  return h('section', { class: 'bloco' },
    h('h2', null, 'Continue de onde parou'),
    ultimo ? h('p', null, 'Você parou em ', h('a', { href: rotaDoc(ultimo.path) }, ultimo.titulo), '.') : null,
    prox ? h('p', null, h('strong', null, `Próximo item da Fase ${prox.fase.num}: `), h('span', { html: htmlInline(prox.texto) }), ' ',
      h('a', { href: rotaDoc(prox.path) }, 'Abrir a página')) : null,
    h('p', { class: 'progresso-linha' },
      barra(p.feito, p.total, 'Progresso geral na trilha'),
      h('span', null, `${p.feito} de ${p.total} ${plural(p.total, 'item', 'itens')} (${pct}%)`)),
    h('a', { class: 'btn btn--sec', href: '#/trilha' }, 'Ver a trilha completa'));
}

export async function render() {
  const [p, ls, gl, md0] = await Promise.all([progresso(), carregarLabs(), glossario(), doc(DOC_FASE0)]);
  const tarefas0 = extrairTarefas(md0);

  const ultimo = store.ultimo();
  const cta = ultimo
    ? h('a', { class: 'btn', href: rotaDoc(ultimo.path) }, 'Continuar de onde parou')
    : h('a', { class: 'btn', href: rotaDoc(DOC_FASE0) }, 'Começar pela Fase 0');

  const hero = h('section', { class: 'hero miolo' },
    h('h1', null, 'Do zero à primeira vaga de analista de segurança júnior'),
    h('p', { class: 'lead' }, 'Um caminho em português, gratuito e aberto: o que estudar, o que praticar em laboratório e como chegar à entrevista. O que você marcar fica salvo neste navegador.'),
    h('div', { class: 'botoes' }, cta, h('a', { class: 'btn btn--sec', href: '#/trilha' }, 'Ver a trilha completa')));

  const slotLinha = h('div', { class: 'linha-caixa' }, linhaMetro(p));
  const slotResultado = h('div', { class: 'diag-resultado', 'aria-live': 'polite' }, resultadoDiagnostico(p));

  const campos = p.diag.itens.map((d) => {
    const txt = tarefas0[d.indice] ? tarefas0[d.indice].texto : d.tema;
    const cb = h('input', { type: 'checkbox', id: `diag-${d.indice}` });
    cb.checked = d.marcado;
    cb.addEventListener('change', async () => {
      store.marcar(`${d.doc}#${d.indice}`, cb.checked);
      const novo = await progresso();
      slotLinha.replaceChildren(linhaMetro(novo));
      slotResultado.replaceChildren(resultadoDiagnostico(novo));
    });
    return h('label', { class: 'marca-item', for: `diag-${d.indice}` }, cb, h('span', { html: htmlInline(txt) }));
  });

  const diagnostico = h('section', { class: 'bloco' },
    h('h2', null, 'Onde você começa?'),
    h('p', null, 'Marque o que você já sabe fazer hoje. O resultado indica por onde começar.'),
    h('fieldset', { class: 'campos' }, h('legend', { class: 'so-leitor' }, 'O que você já sabe fazer'), campos),
    slotResultado);

  const retomada = await painelRetomada(p);

  const mais = h('section', { class: 'miolo mais' },
    h('h2', null, 'O que mais tem aqui'),
    h('ul', { class: 'indice' },
      h('li', null, h('a', { href: '#/labs' }, 'Laboratórios'), h('p', null, `${ls.length} labs práticos com gabarito. Filtre por nível e por ambiente: offline, Docker ou nuvem.`)),
      h('li', null, h('a', { href: '#/quiz' }, 'Quizzes'), h('p', null, 'Autoavaliação da Fase 1 e do SC-900, com nota por tema e o módulo certo para revisar.')),
      h('li', null, h('a', { href: '#/planejador' }, 'Planejador de estudos'), h('p', null, 'Diga quantas horas por semana você tem e veja a data de cada fase. Dá para baixar para o seu calendário.')),
      h('li', null, h('a', { href: rotaDoc('05-certificacoes-cursos/sc-900/README.md') }, 'Trilha SC-900'), h('p', null, 'Fundamentos de segurança, conformidade e identidade da Microsoft, em 4 semanas e 12 labs.')),
      h('li', null, h('a', { href: '#/glossario' }, 'Glossário'), h('p', null, `${gl.length} termos de segurança explicados em uma frase.`))));

  const el = h('div', null,
    hero,
    h('div', { class: 'miolo largo' }, slotLinha),
    h('div', { class: 'miolo duas' }, diagnostico, retomada),
    mais);
  return { titulo: '', el };
}
