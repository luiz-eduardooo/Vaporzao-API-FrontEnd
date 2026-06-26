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

export async function getWishlist() {
  const { data } = await api.get('/wishlist/me')
  const lista = Array.isArray(data) ? data : data?.itens ?? []
  return lista.map((item) => ({
    ...(item.jogo ?? item),
    adicionadoEm: item.adicionadoEm ?? null,
  }))
}

export async function removerDaBiblioteca(jogoId) {
  const { data } = await api.delete(`/biblioteca/${jogoId}`)
  return data
}

export async function adicionarNaBiblioteca(jogoId) {
  const { data } = await api.post(`/biblioteca/${jogoId}`)
  return data
}
export async function adicionarNaWishlist(jogoId) {
  const { data } = await api.post(`/wishlist/${jogoId}`)
  return data
}

export async function removerDaWishlist(jogoId) {
  const { data } = await api.delete(`/wishlist/${jogoId}`)
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
export async function criarJogo(dadosJogo) {
  const { data } = await api.post('/jogos', dadosJogo)
  return data
}

// Atualiza um jogo existente (PUT /jogos/:id). Requer ser o dono.
export async function atualizarJogo(id, dadosJogo) {
  const { data } = await api.put(`/jogos/${id}`, dadosJogo)
  return data
}

// Exclui um jogo (DELETE /jogos/:id). Requer ser o dono.
export async function excluirJogo(id) {
  const { data } = await api.delete(`/jogos/${id}`)
  return data
}

/* ───────────────────────── BIBLIOTECA ───────────────────────── */

// Busca os jogos que o usuário possui (biblioteca).
// A API didática pode expor isso de formas diferentes; tentamos as rotas
// mais comuns em ordem e usamos a primeira que responder. Se nenhuma existir,
// devolvemos uma lista vazia (a página mostra o estado "vazio").
// ⚠️ AJUSTE a rota para a que a sua API realmente usa.
export async function getBiblioteca() {
  const rotas = ['/biblioteca', '/usuarios/me/biblioteca', '/me/biblioteca', '/jogos/biblioteca']
  for (const rota of rotas) {
    try {
      const { data } = await api.get(rota)
      const lista = Array.isArray(data) ? data : data?.itens ?? data?.jogos ?? data?.biblioteca
      if (Array.isArray(lista)) return lista
    } catch {
      // tenta a próxima rota
    }
  }
  return []
}

/* ───────────────────────── MEUS JOGOS ───────────────────────── */

// Extrai o "dono" de um jogo, aceitando os formatos de campo mais comuns.
// Pode ser um id, uma matrícula, ou um objeto { id, matricula, nome }.
function donoDoJogo(jogo) {
  const bruto =
    jogo.autor ?? jogo.criador ?? jogo.usuario ?? jogo.dono ??
    jogo.usuarioId ?? jogo.autorId ?? jogo.criadoPor ?? jogo.criadorId ?? null
  if (bruto == null) return null
  if (typeof bruto === 'object') {
    return bruto.id ?? bruto.matricula ?? bruto.nome ?? null
  }
  return bruto
}

// Busca os jogos publicados pelo usuário logado.
// 1º) tenta rotas dedicadas (mais confiável, já filtradas pelo backend);
// 2º) se não houver, baixa o catálogo e filtra pelo dono, comparando com a
//     identidade informada (id ou matrícula do usuário logado).
// ⚠️ AJUSTE a rota / o nome do campo de autor conforme a sua API.
export async function getMeusJogos(identidadeUsuario) {
  const rotas = ['/jogos/meus', '/meus-jogos', '/usuarios/me/jogos', '/me/jogos']
  for (const rota of rotas) {
    try {
      const { data } = await api.get(rota)
      const lista = Array.isArray(data) ? data : data?.itens ?? data?.jogos
      if (Array.isArray(lista)) return lista
    } catch {
      // tenta a próxima rota
    }
  }

  // Fallback: baixa todas as páginas do catálogo e filtra pelo dono.
  try {
    const LIMITE = 50
    const primeira = await getJogos({ pagina: 1, limite: LIMITE })
    let todos = Array.isArray(primeira)
      ? primeira
      : primeira?.itens ?? primeira?.jogos ?? []
    const totalPaginas = Array.isArray(primeira) ? 1 : primeira?.paginas ?? 1
    if (totalPaginas > 1) {
      const resto = await Promise.all(
        Array.from({ length: totalPaginas - 1 }, (_, i) =>
          getJogos({ pagina: i + 2, limite: LIMITE })
        )
      )
      resto.forEach((r) => { todos = todos.concat(r?.itens ?? r?.jogos ?? []) })
    }

    if (identidadeUsuario == null) return []
    const alvo = String(identidadeUsuario)
    return todos.filter((j) => {
      const dono = donoDoJogo(j)
      return dono != null && String(dono) === alvo
    })
  } catch {
    return []
  }
}

/* ───────────────────────── REVIEWS / CONQUISTAS ───────────────────────── */

// Busca as reviews de um jogo. Tenta primeiro a sub-rota dedicada; se a API
// já devolver as reviews dentro do próprio objeto do jogo, o componente usa
// aquelas. Devolve sempre um array (vazio se não houver/endpoint não existir).
export async function getReviews(jogoId) {
  try {
    const { data } = await api.get(`/jogos/${jogoId}/reviews`)
    return Array.isArray(data) ? data : data?.reviews ?? data?.itens ?? []
  } catch {
    return []
  }
}

// Busca as conquistas de um jogo. Mesma lógica defensiva das reviews.
export async function getConquistas(jogoId) {
  try {
    const { data } = await api.get(`/jogos/${jogoId}/conquistas`)
    return Array.isArray(data) ? data : data?.conquistas ?? data?.itens ?? []
  } catch {
    return []
  }
}
