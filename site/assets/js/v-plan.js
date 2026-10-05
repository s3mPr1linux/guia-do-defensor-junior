// Planejador: horas por semana + perfil + data de início => período de cada fase, com exportação.

import { h, baixar, copiar, aviso, fmtData, plural } from './dom.js';
import { fasesCfg } from './data.js';
import { store } from './store.js';

export const PERFIS = {
  zero: { nome: 'Começando do zero', mult: {} },
  suporte: { nome: 'Suporte ou help desk', mult: { f1: 0.6 } },
  sysadmin: { nome: 'Sysadmin ou infraestrutura', mult: { f1: 0.35, f2: 0.8 } },
  dev: { nome: 'Desenvolvedor', mult: { f1: 0.6, f2: 0.9 } },
  outra: { nome: 'Vindo de outra área', mult: {} },
};

const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const addDias = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

export function calcularPlano(cfg, { horas, inicio, perfil, sc900 }) {
  const mult = (PERFIS[perfil] || PERFIS.zero).mult;
  const sequencia = [];
  for (const f of cfg.phases) {
    sequencia.push({ id: f.id, rotulo: `Fase ${f.num}: ${f.nome}`, horas: f.horas });
    if (f.id === 'f2' && sc900) {
      const t = cfg.trilhas.find((x) => x.id === 'sc900');
      if (t) sequencia.push({ id: t.id, rotulo: t.nome, horas: t.horas, opcional: true });
    }
  }
  let cursor = new Date(inicio + 'T12:00:00');
  const linhas = sequencia.map((s) => {
    const h = Math.max(1, Math.round(s.horas * (mult[s.id] ?? 1)));
    const semanas = Math.max(1, Math.ceil(h / horas));
    const ini = new Date(cursor);
    const fim = addDias(ini, semanas * 7 - 1);
    cursor = addDias(ini, semanas * 7);
    return { ...s, horasPlano: h, semanas, ini, fim };
  });
  const totalHoras = linhas.reduce((s, l) => s + l.horasPlano, 0);
  const totalSemanas = linhas.reduce((s, l) => s + l.semanas, 0);
  return { linhas, totalHoras, totalSemanas, fim: linhas[linhas.length - 1].fim };
}

export function gerarICS(plano, agora = new Date()) {
  const carimbo = agora.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const linhas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Guia do Defensor Junior//PT-BR//', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Guia do Defensor Junior'];
  for (const l of plano.linhas) {
    linhas.push('BEGIN:VEVENT',
      `UID:gdj-${l.id}-${ymd(l.ini)}@guia-do-defensor-junior`,
      `DTSTAMP:${carimbo}`,
      `DTSTART;VALUE=DATE:${ymd(l.ini)}`,
      `DTEND;VALUE=DATE:${ymd(addDias(l.fim, 1))}`,
      `SUMMARY:Defensor Junior - ${l.rotulo.replace(/[,;\\]/g, ' ')}`,
      `DESCRIPTION:${l.horasPlano} h estimadas em ${l.semanas} semanas`,
      'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  linhas.push('END:VCALENDAR');
  return linhas.join('\r\n') + '\r\n';
}

export function gerarMarkdown(plano, params) {
  const cab = `# Meu plano: Guia do Defensor Júnior\n\n${params.horas} h por semana, começando em ${fmtData(new Date(params.inicio + 'T12:00:00'))}.\n\n`;
  const tab = ['| Etapa | Horas | Período |', '|---|---|---|',
    ...plano.linhas.map((l) => `| ${l.rotulo} | ${l.horasPlano} | ${fmtData(l.ini)} a ${fmtData(l.fim)} |`)].join('\n');
  return `${cab}${tab}\n\nTotal: ${plano.totalHoras} horas em ${plano.totalSemanas} semanas, até ${fmtData(plano.fim)}.\n`;
}

export async function render() {
  const cfg = await fasesCfg();
  const salvo = store.plano() || {};
  const params = {
    horas: salvo.horas || 8,
    inicio: salvo.inicio || hoje(),
    perfil: PERFIS[salvo.perfil] ? salvo.perfil : 'zero',
    sc900: !!salvo.sc900,
  };

  const saida = h('div', { class: 'plano-saida', 'aria-live': 'polite' });
  let atual = null;

  const desenhar = () => {
    if (!params.inicio || Number.isNaN(new Date(params.inicio + 'T12:00:00').getTime())) {
      saida.replaceChildren(h('p', null, 'Escolha uma data de início para ver o plano.'));
      atual = null;
      return;
    }
    atual = calcularPlano(cfg, params);
    store.salvarPlano({ ...params });
    const busca = atual.linhas.find((l) => l.id === 'f5');
    saida.replaceChildren(
      h('p', { class: 'resumo-plano' },
        h('strong', null, `${atual.totalHoras} horas em ${atual.totalSemanas} ${plural(atual.totalSemanas, 'semana', 'semanas')}.`),
        ` Previsão de término: ${fmtData(atual.fim)}.`),
      h('div', { class: 'tabela', tabindex: '0', role: 'region', 'aria-label': 'Plano de estudo' },
        h('table', null,
          h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Etapa'), h('th', { scope: 'col' }, 'Horas'), h('th', { scope: 'col' }, 'Semanas'), h('th', { scope: 'col' }, 'Período'))),
          h('tbody', null, atual.linhas.map((l) => h('tr', null,
            h('th', { scope: 'row' }, l.rotulo, l.opcional ? h('span', { class: 'mudo' }, ' (opcional)') : null),
            h('td', null, String(l.horasPlano)),
            h('td', null, String(l.semanas)),
            h('td', null, `${fmtData(l.ini)} a ${fmtData(l.fim)}`)))))),
      busca ? h('p', null, `A busca ativa pela vaga começa em ${fmtData(busca.ini)}. Vale mandar as primeiras candidaturas já no fim da Fase 4, com o portfólio publicado.`) : null);
  };

  const horasOut = h('output', { for: 'p-horas', id: 'p-horas-out' }, `${params.horas} h por semana`);
  const campoHoras = h('input', { type: 'range', id: 'p-horas', min: '3', max: '30', step: '1', value: String(params.horas),
    oninput: (e) => { params.horas = Number(e.target.value); horasOut.textContent = `${params.horas} h por semana`; desenhar(); } });
  const campoData = h('input', { type: 'date', id: 'p-inicio', value: params.inicio,
    onchange: (e) => { params.inicio = e.target.value; desenhar(); } });
  const campoPerfil = h('select', { id: 'p-perfil', onchange: (e) => { params.perfil = e.target.value; desenhar(); } },
    Object.entries(PERFIS).map(([k, v]) => h('option', { value: k, selected: k === params.perfil }, v.nome)));
  const campoSc = h('input', { type: 'checkbox', id: 'p-sc900', onchange: (e) => { params.sc900 = e.target.checked; desenhar(); } });
  campoSc.checked = params.sc900;

  const form = h('form', { class: 'plano-form', onsubmit: (e) => e.preventDefault() },
    h('div', { class: 'campo' }, h('label', { for: 'p-horas' }, 'Quantas horas por semana você consegue estudar?'), campoHoras, horasOut),
    h('div', { class: 'campo' }, h('label', { for: 'p-inicio' }, 'Quando você começa?'), campoData),
    h('div', { class: 'campo' }, h('label', { for: 'p-perfil' }, 'Seu ponto de partida'), campoPerfil),
    h('div', { class: 'campo' }, h('label', { class: 'marca-item', for: 'p-sc900' }, campoSc, h('span', null, 'Incluir a trilha SC-900 depois da Fase 2'))));

  const acoes = h('div', { class: 'botoes' },
    h('button', { class: 'btn', type: 'button', onclick: async () => {
      if (!atual) return;
      aviso((await copiar(gerarMarkdown(atual, params))) ? 'Plano copiado em markdown. Cole no seu meu-plano.md.' : 'Não foi possível copiar.');
    } }, 'Copiar como markdown'),
    h('button', { class: 'btn btn--sec', type: 'button', onclick: () => {
      if (atual) baixar('plano-defensor-junior.ics', gerarICS(atual), 'text/calendar');
    } }, 'Baixar para o calendário (.ics)'));

  desenhar();

  const el = h('div', { class: 'miolo' },
    h('h1', null, 'Planejador de estudos'),
    h('p', { class: 'lead' }, 'Troque “um dia eu começo” por datas. Ajuste as horas e veja quando cada fase termina.'),
    form, saida, acoes,
    h('p', { class: 'mudo' }, 'As horas são estimativas baseadas nas durações do guia (por exemplo, a Fase 1 leva de 2 a 3 meses com 8 a 10 h por semana). O perfil encurta as fases que você já domina. Ajuste ao seu ritmo.'));
  return { titulo: 'Planejador de estudos', el };
}
