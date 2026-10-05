// Glossário filtrável, em ordem alfabética.

import { h, semAcento, plural } from './dom.js';
import { glossario } from './data.js';

export function agrupar(termos) {
  const grupos = new Map();
  for (const t of termos) {
    const letra = semAcento(t.termo).charAt(0).toUpperCase();
    const chave = /[A-Z]/.test(letra) ? letra : '#';
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(t);
  }
  return grupos;
}

export async function render() {
  const termos = await glossario();
  const campo = h('input', { type: 'search', id: 'filtro-glossario', autocomplete: 'off', placeholder: 'Filtrar: phishing, SIEM, hash…' });
  const status = h('p', { class: 'contagem', 'aria-live': 'polite' });
  const corpo = h('div', { class: 'glossario' });

  const desenhar = () => {
    const q = semAcento(campo.value.trim());
    const vis = q ? termos.filter((t) => semAcento(t.termo + ' ' + t.definicao).includes(q)) : termos;
    status.textContent = `${vis.length} de ${termos.length} ${plural(termos.length, 'termo', 'termos')}`;
    if (!vis.length) {
      corpo.replaceChildren(h('p', null, 'Nenhum termo encontrado. Tente uma palavra mais curta ou o nome em inglês.'));
      return;
    }
    const nos = [];
    for (const [letra, itens] of agrupar(vis)) {
      nos.push(h('section', { 'aria-labelledby': `letra-${letra}` },
        h('h2', { id: `letra-${letra}` }, letra),
        h('dl', null, itens.flatMap((t) => [h('dt', null, t.termo), h('dd', null, t.definicao)]))));
    }
    corpo.replaceChildren(...nos);
  };
  campo.addEventListener('input', desenhar);
  desenhar();

  const el = h('div', { class: 'miolo' },
    h('h1', null, 'Glossário'),
    h('p', { class: 'lead' }, 'Os termos que aparecem no guia e nas entrevistas, cada um em uma frase.'),
    h('label', { for: 'filtro-glossario', class: 'so-leitor' }, 'Filtrar termos'),
    campo, status, corpo);
  return { titulo: 'Glossário', el };
}
