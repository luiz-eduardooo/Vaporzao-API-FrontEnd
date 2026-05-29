import api from './api'

export async function getDestaques() {
  const { data } = await api.get('/jogos/destaques')
  return data
}

export async function getJogos(params = {}) {
  const { data } = await api.get('/jogos', { params })
  return data
}

export async function getJogoPorId(id) {
  const { data } = await api.get(`/jogos/${id}`)
  return data
}

export async function getJogosDestaques(limit = 5) {
  const { data } = await api.get('/jogos/destaques')
  const list = data?.topAvaliados ?? []
  return list.slice(0, limit)
}

/* ───────────────────────── GÊNEROS / FILTRO ───────────────────────── */

// Lista todos os gêneros disponíveis (pra montar o filtro).
// ⚠️ AJUSTE o endpoint se na sua API for diferente (ex.: '/generos', '/genres').
export async function getGeneros() {
  const { data } = await api.get('/generos')
  // aceita tanto um array direto quanto { generos: [...] }
  return Array.isArray(data) ? data : data?.generos ?? []
}

// Busca jogos filtrando por gênero.
// ⚠️ AJUSTE o nome do parâmetro conforme sua API. As três formas mais comuns:
//   a) query param:    GET /jogos?genero=1        -> use a versão abaixo
//   b) query param str:GET /jogos?genero=Ação
//   c) rota dedicada:  GET /generos/1/jogos       -> troque por api.get(`/generos/${generoId}/jogos`)
export async function getJogosPorGenero(generoId) {
  const { data } = await api.get('/jogos', { params: { genero: generoId } })
  return Array.isArray(data) ? data : data?.jogos ?? []
}

/* ───────────────────────── CRIAR JOGO ───────────────────────── */

// Cria um novo jogo. Requer estar autenticado (o token já vai no header
// automaticamente pelo interceptor do api.js). Limite de 3 jogos por usuário.
// ⚠️ AJUSTE o endpoint e os nomes dos campos conforme sua API.
export async function criarJogo(dadosJogo) {
  const { data } = await api.post('/jogos', dadosJogo)
  return data
}
