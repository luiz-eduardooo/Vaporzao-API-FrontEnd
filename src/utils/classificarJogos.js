/**
 * classificarJogos.js
 *
 * Agrupa uma lista de jogos por gênero.
 *
 * - Se o jogo JÁ traz `generos` (vindo da API), usa esse dado (confiável).
 * - Se NÃO traz gênero, tenta inferir pelo TÍTULO via palavras-chave (palpite).
 *
 * ⚠️ Não dá para analisar a CAPA (imagem) no navegador — isso exigiria um
 *    modelo de visão rodando num backend. A inferência aqui é só por texto.
 */

// Mapa de palavras-chave -> nome do gênero (ajuste à vontade).
const PALAVRAS_CHAVE = {
  Ação: ['war', 'combat', 'strike', 'battle', 'guerra', 'fury', 'assault', 'shooter', 'gun'],
  Aventura: ['quest', 'journey', 'lost', 'legend', 'saga', 'odyssey', 'tales', 'explor'],
  RPG: ['rpg', 'fantasy', 'dragon', 'magic', 'realm', 'souls', 'kingdom', 'hero'],
  Corrida: ['race', 'racing', 'drift', 'speed', 'turbo', 'rally', 'motor', 'nitro'],
  Esporte: ['soccer', 'football', 'fifa', 'nba', 'tennis', 'golf', 'futebol', 'sports'],
  Estratégia: ['strategy', 'tactics', 'empire', 'civilization', 'command', 'war room'],
  Terror: ['horror', 'dead', 'evil', 'dark', 'nightmare', 'zombie', 'silent', 'fear'],
  Puzzle: ['puzzle', 'brain', 'logic', 'tetris', 'match', 'block', 'enigma'],
  Simulação: ['sim', 'simulator', 'tycoon', 'farm', 'city', 'life', 'build'],
}

const SEM_GENERO = 'Sem gênero'

/**
 * Infere um gênero a partir do título. Retorna o nome do gênero ou SEM_GENERO.
 */
export function inferirGeneroPorTitulo(titulo = '') {
  const t = titulo.toLowerCase()
  for (const [genero, palavras] of Object.entries(PALAVRAS_CHAVE)) {
    if (palavras.some((p) => t.includes(p))) return genero
  }
  return SEM_GENERO
}

/**
 * Retorna os nomes de gênero de um jogo.
 * Usa o campo `generos` da API se existir; senão, infere pelo título.
 */
export function generosDoJogo(jogo) {
  if (Array.isArray(jogo.generos) && jogo.generos.length > 0) {
    return jogo.generos.map((g) => g.nome ?? g.name ?? String(g))
  }
  return [inferirGeneroPorTitulo(jogo.titulo ?? jogo.title ?? '')]
}

/**
 * Agrupa uma lista de jogos num objeto { nomeGenero: [jogos...] }.
 * Um jogo com vários gêneros aparece em cada um deles.
 */
export function agruparPorGenero(jogos = []) {
  const grupos = {}
  for (const jogo of jogos) {
    for (const nome of generosDoJogo(jogo)) {
      if (!grupos[nome]) grupos[nome] = []
      grupos[nome].push(jogo)
    }
  }
  return grupos
}

/**
 * Extrai a lista única de gêneros presentes nos jogos.
 * Retorna [{ id, nome }] ordenado por nome.
 */
export function extrairGeneros(jogos = []) {
  const mapa = new Map()
  for (const jogo of jogos) {
    if (Array.isArray(jogo.generos)) {
      for (const g of jogo.generos) {
        const id = g.id ?? g.nome ?? g.name
        const nome = g.nome ?? g.name ?? String(g)
        if (id != null && !mapa.has(id)) mapa.set(id, { id, nome })
      }
    }
  }
  return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome))
}

/**
 * Filtra os jogos que pertencem a um gênero (por id ou nome).
 */
export function filtrarPorGenero(jogos = [], generoId) {
  if (generoId == null) return jogos
  return jogos.filter(
    (jogo) =>
      Array.isArray(jogo.generos) &&
      jogo.generos.some(
        (g) => (g.id ?? g.nome ?? g.name) === generoId
      )
  )
}
