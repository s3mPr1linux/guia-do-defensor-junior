// Calcula o progresso por fase a partir do manifesto, de phases.json e do store.

import { manifesto, fasesCfg, config } from './data.js';
import { store } from './store.js';

export function indicesDoc(d, tarefas) {
  const todos = Array.from({ length: tarefas }, (_, i) => i);
  if (d.only) return d.only.filter((i) => i < tarefas);
  if (d.skip) return todos.filter((i) => !d.skip.includes(i));
  return todos;
}

function calcular(item, por) {
  const tarefas = [];
  for (const d of item.docs) {
    const meta = por.get(d.path);
    if (!meta) continue;
    for (const i of indicesDoc(d, meta.tasks)) {
      const chave = `${d.path}#${i}`;
      tarefas.push({ chave, doc: d.path, i, feito: store.marcado(chave) });
    }
  }
  const tarefasFeitas = tarefas.filter((t) => t.feito).length;
  const labsFeitos = item.labs.filter((id) => store.labFeito(id)).length;
  const total = tarefas.length + item.labs.length;
  const feito = tarefasFeitas + labsFeitos;
  return {
    ...item, tarefas, tarefasFeitas, tarefasTotal: tarefas.length,
    labsFeitos, labsTotal: item.labs.length, total, feito, frac: total ? feito / total : 0,
  };
}

export async function progresso() {
  const [man, cfg, geral] = await Promise.all([manifesto(), fasesCfg(), config()]);
  const por = new Map(man.map((m) => [m.path, m]));
  const fases = cfg.phases.map((f) => calcular(f, por));
  const trilhas = cfg.trilhas.map((t) => calcular(t, por));

  const diag = cfg.diagnostico.map((d) => ({ ...d, marcado: store.marcado(`${d.doc}#${d.indice}`) }));
  const marcados = diag.filter((d) => d.marcado).length;
  // Quem já domina quase tudo no diagnóstico começa na Fase 3; as anteriores aparecem como puladas.
  const inicio = marcados >= 5 ? fases.findIndex((f) => f.id === 'f3') : 0;

  fases.forEach((f, i) => { f.pulada = i < inicio && f.frac === 0; });
  let atual = fases.findIndex((f, i) => i >= inicio && f.frac < 1);
  if (atual === -1) atual = fases.length; // todas concluídas: a bandeira vai para a vaga

  const total = fases.reduce((s, f) => s + f.total, 0);
  const feito = fases.reduce((s, f) => s + f.feito, 0);
  return { cfg: geral, fases, trilhas, diag: { itens: diag, marcados, inicio }, atual, total, feito, frac: total ? feito / total : 0, terminal: cfg.terminal };
}
