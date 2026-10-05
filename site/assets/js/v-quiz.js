// Quizzes: múltipla escolha (SC-900, lido do próprio guia) e cartões de autoavaliação (Fase 1).

import { h, barra, plural } from './dom.js';
import { config, quiz as carregarQuiz } from './data.js';
import { store } from './store.js';
import { htmlInline, rotaDoc } from './md.js';

const META = 80; // % de acertos que o guia pede para considerar o tema dominado

export function embaralhar(lista, aleatorio = Math.random) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const resumo = (r) => (r ? `${r.acertos} de ${r.total} (${r.pct}%)` : null);

async function lista() {
  const cfg = await config();
  const itens = cfg.quizzes.map((q) => {
    const salvo = store.quiz(q.id);
    return h('li', null,
      h('a', { href: `#/quiz/${q.id}` }, q.titulo),
      h('p', null, q.descricao),
      h('p', { class: 'mudo' }, salvo ? `Melhor resultado: ${resumo(salvo.melhor)}. Tentativas: ${salvo.tentativas}.` : 'Ainda não feito.'));
  });
  return {
    titulo: 'Quizzes',
    el: h('div', { class: 'miolo' },
      h('h1', null, 'Quizzes'),
      h('p', { class: 'lead' }, 'Teste o que você estudou antes de seguir. Errar aqui custa nada e mostra exatamente o que revisar.'),
      h('ul', { class: 'indice' }, itens)),
  };
}

// ---------- múltipla escolha ----------

function multiplaEscolha(dados, def) {
  const raiz = h('div', { class: 'quiz' });
  let fila, i, respostas, parcial;

  const iniciar = (questoes, ehParcial) => {
    fila = questoes.map((q) => ({ ...q, ordem: embaralhar([0, 1, 2, 3]) }));
    i = 0;
    respostas = [];
    parcial = ehParcial;
    pergunta();
  };

  function pergunta() {
    const q = fila[i];
    const dom = dados.dominios[String(q.dominio)];
    const nome = `opcao-${q.id}`;
    let conferida = false;
    const feedback = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    const conferir = h('button', { class: 'btn', type: 'button', disabled: true }, 'Conferir');
    const proxima = h('button', { class: 'btn', type: 'button', hidden: true }, i === fila.length - 1 ? 'Ver resultado' : 'Próxima questão');

    const radios = q.ordem.map((orig, pos) => {
      const id = `${nome}-${pos}`;
      const r = h('input', { type: 'radio', name: nome, id, value: String(orig) });
      r.addEventListener('change', () => { conferir.disabled = false; });
      return { orig, r, rotulo: h('label', { class: 'q-opcao', for: id }, r, h('span', { html: htmlInline(q.opcoes[orig]) })) };
    });

    conferir.addEventListener('click', () => {
      const marcada = radios.find((x) => x.r.checked);
      if (!marcada || conferida) return;
      conferida = true;
      const acertou = marcada.orig === q.correta;
      respostas.push({ q, escolha: marcada.orig, acertou });
      radios.forEach((x) => {
        x.r.disabled = true;
        if (x.orig === q.correta) x.rotulo.classList.add('certa'), x.rotulo.append(h('span', { class: 'selo' }, 'Resposta certa'));
        else if (x === marcada) x.rotulo.classList.add('errada'), x.rotulo.append(h('span', { class: 'selo' }, 'Sua resposta'));
      });
      feedback.replaceChildren(
        h('p', null, h('strong', null, acertou ? 'Correto.' : 'Não foi essa.'),
          acertou ? '' : ' A resposta certa está destacada acima.'),
        acertou ? null : h('p', null, 'Revise: ', h('a', { href: rotaDoc(dom.modulo) }, dom.titulo_modulo)));
      conferir.hidden = true;
      proxima.hidden = false;
      proxima.focus();
    });

    proxima.addEventListener('click', () => { i++; if (i < fila.length) pergunta(); else resultado(); });

    raiz.replaceChildren(
      h('p', { class: 'q-prog' }, `Questão ${i + 1} de ${fila.length}`, h('span', { class: 'mudo' }, dom.nome)),
      barra(i, fila.length, 'Andamento do quiz'),
      h('fieldset', { class: 'q-campo' },
        h('legend', { html: htmlInline(q.pergunta) }),
        radios.map((x) => x.rotulo)),
      h('div', { class: 'botoes' }, conferir, proxima),
      feedback);
    radios[0].r.focus();
  }

  function resultado() {
    const acertos = respostas.filter((r) => r.acertou).length;
    const total = respostas.length;
    const pct = Math.round((acertos / total) * 100);
    if (!parcial) store.salvarQuiz(def.id, { pct, acertos, total, data: new Date().toISOString() });

    const porDominio = {};
    for (const r of respostas) {
      const d = (porDominio[r.q.dominio] ||= { acertos: 0, total: 0 });
      d.total++;
      if (r.acertou) d.acertos++;
    }
    const linhas = Object.keys(porDominio).sort().map((k) => {
      const d = porDominio[k];
      const dom = dados.dominios[k];
      const baixo = (d.acertos / d.total) * 100 < META;
      return h('li', null,
        h('span', null, `Domínio ${k}: ${dom.nome}`),
        h('strong', null, ` ${d.acertos} de ${d.total}`),
        baixo ? h('span', null, ' ', h('a', { href: rotaDoc(dom.modulo) }, 'Revisar o módulo')) : null);
    });
    const erradas = respostas.filter((r) => !r.acertou);

    raiz.replaceChildren(
      h('h2', null, `${acertos} de ${total} (${pct}%)`),
      h('p', null, pct >= META
        ? `Você passou da meta de ${META}%. Faça também o simulado oficial da Microsoft antes de marcar o exame.`
        : `Abaixo da meta de ${META}%. Revise os domínios com nota baixa e tente de novo.`),
      parcial ? h('p', { class: 'mudo' }, 'Esta foi uma rodada só com as questões que você errou, então o resultado não entra no seu melhor resultado.') : null,
      h('h3', null, 'Por domínio'),
      h('ul', { class: 'lista-simples' }, linhas),
      erradas.length ? h('div', null,
        h('h3', null, `${erradas.length} ${plural(erradas.length, 'questão errada', 'questões erradas')}`),
        h('ol', { class: 'erradas' }, erradas.map((r) => h('li', null,
          h('p', { html: htmlInline(r.q.pergunta) }),
          h('p', null, h('strong', null, 'Certa: '), h('span', { html: htmlInline(r.q.opcoes[r.q.correta]) })))))) : null,
      h('div', { class: 'botoes' },
        h('button', { class: 'btn', type: 'button', onclick: () => iniciar(dados.questoes, false) }, 'Refazer tudo'),
        erradas.length ? h('button', { class: 'btn btn--sec', type: 'button', onclick: () => iniciar(erradas.map((r) => r.q), true) }, 'Refazer só as que errei') : null,
        h('a', { class: 'btn btn--sec', href: '#/quiz' }, 'Voltar aos quizzes')));
    raiz.querySelector('h2').setAttribute('tabindex', '-1');
    raiz.querySelector('h2').focus();
  }

  iniciar(dados.questoes, false);
  return raiz;
}

// ---------- cartões de autoavaliação ----------

function cartoes(dados, def) {
  const raiz = h('div', { class: 'quiz' });
  let i = 0;
  let respostas = [];

  function carta() {
    const c = dados.cartoes[i];
    const bloco = dados.blocos[c.bloco];
    const resposta = h('div', { class: 'resposta', hidden: true, role: 'status' },
      h('p', { html: htmlInline(c.resposta) }),
      h('div', { class: 'botoes' },
        h('button', { class: 'btn', type: 'button', onclick: () => marcar(true) }, 'Acertei'),
        h('button', { class: 'btn btn--sec', type: 'button', onclick: () => marcar(false) }, 'Preciso revisar')));
    const mostrar = h('button', { class: 'btn', type: 'button', onclick: (e) => {
      resposta.hidden = false;
      e.currentTarget.hidden = true;
      resposta.querySelector('button').focus();
    } }, 'Mostrar a resposta');
    raiz.replaceChildren(
      h('p', { class: 'q-prog' }, `Pergunta ${i + 1} de ${dados.cartoes.length}`, h('span', { class: 'mudo' }, bloco.nome)),
      barra(i, dados.cartoes.length, 'Andamento do quiz'),
      h('p', { class: 'cartao-pergunta', html: htmlInline(c.pergunta) }),
      h('p', { class: 'mudo' }, 'Responda de cabeça ou escrevendo e só então confira.'),
      mostrar, resposta);
    mostrar.focus();
  }

  function marcar(acertou) {
    respostas.push({ c: dados.cartoes[i], acertou });
    i++;
    if (i < dados.cartoes.length) carta(); else resultado();
  }

  function resultado() {
    const acertos = respostas.filter((r) => r.acertou).length;
    const total = respostas.length;
    const pct = Math.round((acertos / total) * 100);
    store.salvarQuiz(def.id, { pct, acertos, total, data: new Date().toISOString() });
    const veredito = acertos >= 12 ? 'Você pode seguir para a Fase 2.'
      : acertos >= 8 ? 'Revise os pontos fracos por 1 a 2 semanas antes de seguir.'
        : 'Refaça o módulo mais fraco antes de seguir.';

    const porBloco = {};
    for (const r of respostas) {
      const b = (porBloco[r.c.bloco] ||= { acertos: 0, total: 0 });
      b.total++;
      if (r.acertou) b.acertos++;
    }
    const linhas = Object.keys(dados.blocos).map((k) => {
      const b = porBloco[k] || { acertos: 0, total: 0 };
      const erros = b.total - b.acertos;
      return h('li', null,
        h('span', null, dados.blocos[k].nome),
        h('strong', null, ` ${b.acertos} de ${b.total}`),
        erros >= 3 ? h('span', null, ' ', h('a', { href: rotaDoc(dados.blocos[k].modulo) }, 'Revisar o módulo'))
          : erros >= 1 ? h('span', { class: 'mudo' }, ' ', h('a', { href: rotaDoc(dados.blocos[k].modulo) }, 'Rever os pontos que errou')) : null);
    });
    const revisar = respostas.filter((r) => !r.acertou);

    raiz.replaceChildren(
      h('h2', { tabindex: '-1' }, `${acertos} de ${total} (${pct}%)`),
      h('p', null, veredito),
      h('h3', null, 'Por tema'),
      h('ul', { class: 'lista-simples' }, linhas),
      revisar.length ? h('div', null, h('h3', null, 'Para revisar'),
        h('ul', { class: 'lista-simples' }, revisar.map((r) => h('li', { html: htmlInline(r.c.pergunta) })))) : null,
      h('div', { class: 'botoes' },
        h('button', { class: 'btn', type: 'button', onclick: () => { i = 0; respostas = []; carta(); } }, 'Refazer'),
        h('a', { class: 'btn btn--sec', href: '#/quiz' }, 'Voltar aos quizzes')));
    raiz.querySelector('h2').focus();
  }

  carta();
  return raiz;
}

export async function render({ params }) {
  const id = params[0];
  if (!id) return lista();
  const cfg = await config();
  const def = cfg.quizzes.find((q) => q.id === id);
  if (!def) {
    return { titulo: 'Quiz não encontrado', el: h('div', { class: 'miolo' },
      h('h1', null, 'Quiz não encontrado'), h('p', null, h('a', { href: '#/quiz' }, 'Ver os quizzes disponíveis'))) };
  }
  const dados = await carregarQuiz(def.fonte);
  const corpo = def.modo === 'mc' ? multiplaEscolha(dados, def) : cartoes(dados, def);
  const salvo = store.quiz(id);
  const el = h('div', { class: 'miolo quiz-pagina' },
    h('p', { class: 'migalha-solta' }, h('a', { href: '#/quiz' }, 'Quizzes')),
    h('h1', null, def.titulo),
    dados.dica ? h('p', { class: 'lead' }, dados.dica) : h('p', { class: 'lead' }, def.descricao),
    salvo ? h('p', { class: 'mudo' }, `Melhor resultado até agora: ${resumo(salvo.melhor)}.`) : null,
    corpo);
  return { titulo: def.titulo, el };
}
