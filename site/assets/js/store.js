// Progresso do estudante. Fica só no navegador (localStorage), sem servidor e sem conta.

const CHAVE = 'gdj:v1';

function vazio() {
  return { v: 1, checks: {}, labs: {}, quiz: {}, plano: null, ultimo: null, visitados: {}, tema: null };
}

function ler() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      const s = JSON.parse(bruto);
      if (s && s.v === 1) return { ...vazio(), ...s };
    }
  } catch { /* localStorage indisponível ou corrompido: começa vazio */ }
  return vazio();
}

let estado = ler();
const ouvintes = new Set();

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch { /* modo privado: o progresso vale só nesta sessão */ }
  ouvintes.forEach((f) => f());
}

const ehNum = (n) => typeof n === 'number' && Number.isFinite(n);

export const store = {
  get estado() { return estado; },
  onChange(fn) { ouvintes.add(fn); return () => ouvintes.delete(fn); },

  marcado(chave) { return !!estado.checks[chave]; },
  marcar(chave, valor) {
    if (valor) estado.checks[chave] = 1; else delete estado.checks[chave];
    salvar();
  },

  labFeito(id) { return !!estado.labs[id]; },
  marcarLab(id, valor) {
    if (valor) estado.labs[id] = 1; else delete estado.labs[id];
    salvar();
  },

  quiz(id) { return estado.quiz[id] || null; },
  salvarQuiz(id, resultado) {
    const antes = estado.quiz[id] || {};
    const melhor = !antes.melhor || resultado.pct >= antes.melhor.pct ? resultado : antes.melhor;
    estado.quiz[id] = { ultimo: resultado, melhor, tentativas: (antes.tentativas || 0) + 1 };
    salvar();
  },

  plano() { return estado.plano; },
  salvarPlano(p) { estado.plano = p; salvar(); },

  ultimo() { return estado.ultimo; },
  visitar(path, titulo) {
    estado.ultimo = { path, titulo };
    estado.visitados[path] = 1;
    salvar();
  },
  jaVisitou() { return Object.keys(estado.visitados).length > 0; },

  tema() { return estado.tema; },
  definirTema(t) { estado.tema = t; salvar(); },

  exportar() {
    return JSON.stringify({ ...estado, exportadoEm: new Date().toISOString() }, null, 2);
  },

  // Nunca confie no arquivo: copia só o que reconhece, com tipos verificados.
  importar(obj) {
    if (!obj || typeof obj !== 'object' || obj.v !== 1) throw new Error('Este arquivo não é um progresso do guia.');
    const novo = vazio();
    const copiaFlags = (de, para) => {
      for (const [k, v] of Object.entries(de || {})) {
        if (v && typeof k === 'string' && k.length < 300) para[k] = 1;
      }
    };
    copiaFlags(obj.checks, novo.checks);
    copiaFlags(obj.labs, novo.labs);
    copiaFlags(obj.visitados, novo.visitados);

    const res = (r) => (r && ehNum(r.pct) && ehNum(r.acertos) && ehNum(r.total)
      ? { pct: r.pct, acertos: r.acertos, total: r.total, data: typeof r.data === 'string' ? r.data.slice(0, 40) : '' }
      : null);
    for (const id of ['sc900', 'fase1']) {
      const q = obj.quiz && obj.quiz[id];
      const ultimo = q && res(q.ultimo);
      const melhor = q && res(q.melhor);
      if (ultimo && melhor) novo.quiz[id] = { ultimo, melhor, tentativas: ehNum(q.tentativas) ? q.tentativas : 1 };
    }
    const p = obj.plano;
    if (p && ehNum(p.horas) && typeof p.inicio === 'string' && typeof p.perfil === 'string') {
      novo.plano = { horas: Math.min(40, Math.max(1, p.horas)), inicio: p.inicio.slice(0, 10), perfil: p.perfil.slice(0, 20), sc900: !!p.sc900 };
    }
    const u = obj.ultimo;
    if (u && typeof u.path === 'string' && typeof u.titulo === 'string') novo.ultimo = { path: u.path.slice(0, 300), titulo: u.titulo.slice(0, 200) };
    if (obj.tema === 'dark' || obj.tema === 'light') novo.tema = obj.tema;
    estado = novo;
    salvar();
  },

  apagar() {
    const tema = estado.tema;
    estado = vazio();
    estado.tema = tema;
    salvar();
  },
};
