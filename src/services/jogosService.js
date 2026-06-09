import api from './api'

/* ─────────────────────────────── JOGOS ─────────────────────────────── */

// Listas curadas para a Home: { recentes, topAvaliados, populares }.
// Cada item traz `contagens` ({ reviews, bibliotecas, wishlists }).
export async function getDestaques() {
  const { data } = await api.get('/jogos/destaques')
  return data
}

// Lista paginada de jogos.
// Resposta: { pagina, limite, total, paginas, itens: [...] }.
// Filtros suportados: pagina, limite, busca, genero (nome), ordenar, direcao.
export async function getJogos(params = {}) {
  const { data } = await api.get('/jogos', { params })
  return data
}

// Detalhe completo de um jogo (inclui imagens, videos, conquistas e as
// últimas 10 reviews, além de `_count`).
export async function getJogoPorId(id) {
  const { data } = await api.get(`/jogos/${id}`)
  return data
}

// Jogos em destaque para o carrossel (usa os "top avaliados").
export async function getJogosDestaques(limit = 5) {
  const data = await getDestaques()
  const list = data?.topAvaliados ?? data?.populares ?? data?.recentes ?? []
  return list.slice(0, limit)
}

// Cria um jogo (máximo 3 por aluno). Requer estar autenticado.
// Body esperado pela API: { titulo, descricao, preco, desenvolvedora,
//   lancamento, capaUrl, generoIds: number[] }.
export async function criarJogo(dadosJogo) {
  const { data } = await api.post('/jogos', dadosJogo)
  return data
}

// Substitui todos os dados de um jogo (PUT /jogos/:id). Autor ou admin.
export async function atualizarJogo(id, dadosJogo) {
  const { data } = await api.put(`/jogos/${id}`, dadosJogo)
  return data
}

// Remove um jogo (DELETE /jogos/:id). Autor ou admin.
export async function excluirJogo(id) {
  const { data } = await api.delete(`/jogos/${id}`)
  return data
}

/* ─────────────────────────────── GÊNEROS ─────────────────────────────── */

// Lista todos os gêneros com contagem de jogos: [{ id, nome, _count }].
export async function getGeneros() {
  const { data } = await api.get('/generos')
  return Array.isArray(data) ? data : data?.itens ?? []
}

// Detalhe de um gênero, com a lista de jogos dele.
export async function getGeneroComJogos(id) {
  const { data } = await api.get(`/generos/${id}`)
  return data
}

/* ──────────────────────────── MEUS JOGOS ──────────────────────────── */

// Jogos publicados pelo usuário logado.
// A API expõe isso no perfil público: GET /usuarios/:matricula devolve
// `jogosCriados`. Buscamos a matrícula em /auth/me e então o perfil.
export async function getMeusJogos(matriculaUsuario) {
  let matricula = matriculaUsuario
  if (!matricula) {
    try {
      const { data } = await api.get('/auth/me')
      matricula = data?.matricula
    } catch {
      return []
    }
  }
  if (!matricula) return []
  const { data } = await api.get(`/usuarios/${matricula}`)
  return data?.jogosCriados ?? data?.jogos ?? []
}

/* ──────────────────────────── BIBLIOTECA ──────────────────────────── */

// Jogos na biblioteca do usuário logado.
// Resposta: [{ jogo: {...}, horasJogadas, adicionadoEm }]. Achatamos para
// devolver o jogo com as horas jogadas embutidas, que é o que a tela usa.
export async function getBiblioteca() {
  const { data } = await api.get('/biblioteca/me')
  const lista = Array.isArray(data) ? data : data?.itens ?? []
  return lista.map((item) => ({
    ...(item.jogo ?? item),
    horasJogadas: item.horasJogadas ?? 0,
    adicionadoEm: item.adicionadoEm ?? null,
  }))
}

export async function adicionarNaBiblioteca(jogoId) {
  const { data } = await api.post(`/biblioteca/${jogoId}`)
  return data
}

export async function removerDaBiblioteca(jogoId) {
  const { data } = await api.delete(`/biblioteca/${jogoId}`)
  return data
}

// Status do jogo para o usuário logado: { naBiblioteca, naWishlist, reviewFeita }.
export async function getStatusJogo(jogoId) {
  try {
    const { data } = await api.get(`/jogos/${jogoId}/status`)
    return data ?? {}
  } catch {
    return {}
  }
}

/* ───────────────────────────── WISHLIST ───────────────────────────── */

// Jogos na wishlist do usuário logado.
// Resposta: [{ jogo: {...}, adicionadoEm }]. Achatamos como na biblioteca.
export async function getWishlist() {
  const { data } = await api.get('/wishlist/me')
  const lista = Array.isArray(data) ? data : data?.itens ?? []
  return lista.map((item) => ({
    ...(item.jogo ?? item),
    adicionadoEm: item.adicionadoEm ?? null,
  }))
}

export async function adicionarNaWishlist(jogoId) {
  const { data } = await api.post(`/wishlist/${jogoId}`)
  return data
}

export async function removerDaWishlist(jogoId) {
  const { data } = await api.delete(`/wishlist/${jogoId}`)
  return data
}

/* ──────────────────────── REVIEWS / CONQUISTAS ──────────────────────── */

// Reviews de um jogo: [{ id, nota (0–10), texto, recomenda, autor: {...} }].
export async function getReviews(jogoId) {
  try {
    const { data } = await api.get(`/jogos/${jogoId}/reviews`)
    return Array.isArray(data) ? data : data?.itens ?? []
  } catch {
    return []
  }
}

// Conquistas de um jogo: [{ id, titulo, descricao, pontos }].
export async function getConquistas(jogoId) {
  try {
    const { data } = await api.get(`/jogos/${jogoId}/conquistas`)
    return Array.isArray(data) ? data : data?.itens ?? []
  } catch {
    return []
  }
}
