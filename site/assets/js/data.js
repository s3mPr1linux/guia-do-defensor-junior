// Carrega e guarda em cache os dados gerados por tools/build_site.py.

const cache = new Map();

function buscar(url, tipo) {
  const k = tipo + ':' + url;
  if (!cache.has(k)) {
    const p = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Não foi possível carregar ${url} (${r.status}).`);
        return tipo === 'json' ? r.json() : r.text();
      })
      .catch((e) => {
        cache.delete(k);
        throw e;
      });
    cache.set(k, p);
  }
  return cache.get(k);
}

export const json = (u) => buscar(u, 'json');
export const texto = (u) => buscar(u, 'text');

export const config = () => json('data/config.json');
export const manifesto = () => json('data/manifest.json');
export const fasesCfg = () => json('data/phases.json');
export const labs = () => json('data/labs.json');
export const glossario = () => json('data/glossary.json');
export const indiceBusca = () => json('data/search.json');
export const quiz = (fonte) => json(fonte);

export const urlConteudo = (path) => 'content/' + path.split('/').map(encodeURIComponent).join('/');
export const doc = (path) => texto(urlConteudo(path));

export async function porPath() {
  const man = await manifesto();
  return new Map(man.map((m) => [m.path, m]));
}

export function urlGitHub(cfg, path, modo = 'blob') {
  return `https://github.com/${cfg.repo}/${modo}/${cfg.branch}/${path}`;
}
