import api from './api'

/* ───────────────────────── JOGOS ───────────────────────── */

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

// Usado pelo FeaturedCarousel: pega os mais bem avaliados e corta no limite.
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
  return Array.isArray(data) ? data : data?.generos ?? []
}

// Busca jogos filtrando por gênero.
// ⚠️ AJUSTE o nome do parâmetro conforme sua API.
export async function getJogosPorGenero(generoId) {
  const { data } = await api.get('/jogos', { params: { genero: generoId } })
  return Array.isArray(data) ? data : data?.jogos ?? []
}

/* ───────────────────────── CRIAR JOGO ───────────────────────── */

// Cria um novo jogo. Requer autenticação (token vai no header pelo interceptor).
export async function criarJogo(dadosJogo) {
  const { data } = await api.post('/jogos', dadosJogo)
  return data
}
