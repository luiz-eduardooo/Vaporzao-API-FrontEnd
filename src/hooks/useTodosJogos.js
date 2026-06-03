import { useState, useEffect } from 'react'
import { getJogos, getDestaques } from '../services/jogosService'

/**
 * useTodosJogos — busca a lista COMPLETA de jogos.
 * A API pagina (resposta { pagina, limite, total, paginas, itens }),
 * então buscamos página por página e juntamos os 'itens'.
 * Se falhar, cai para os destaques.
 */
export function useTodosJogos() {
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let cancelado = false

    function dedup(lista) {
      const vistos = new Set()
      const out = []
      for (const j of lista) {
        const id = j.id ?? j.titulo ?? JSON.stringify(j)
        if (!vistos.has(id)) {
          vistos.add(id)
          out.push(j)
        }
      }
      return out
    }

    async function buscarTodasPaginas() {
      const LIMITE = 50
      // primeira página
      const primeira = await getJogos({ pagina: 1, limite: LIMITE })

      // se já vier array direto (caso a API mude), retorna
      if (Array.isArray(primeira)) return primeira

      let todos = primeira?.itens ?? primeira?.jogos ?? []
      const totalPaginas = primeira?.paginas ?? 1

      // busca as páginas restantes em paralelo
      if (totalPaginas > 1) {
        const reqs = []
        for (let p = 2; p <= totalPaginas; p++) {
          reqs.push(getJogos({ pagina: p, limite: LIMITE }))
        }
        const resto = await Promise.all(reqs)
        for (const r of resto) {
          todos = todos.concat(r?.itens ?? r?.jogos ?? [])
        }
      }
      return todos
    }

    async function buscar() {
      let lista = []
      try {
        lista = await buscarTodasPaginas()
      } catch {
        lista = []
      }

      // fallback: destaques
      if (lista.length === 0) {
        try {
          const d = await getDestaques()
          lista = dedup([
            ...(d?.recentes ?? []),
            ...(d?.topAvaliados ?? []),
            ...(d?.populares ?? []),
          ])
        } catch {
          lista = []
        }
      }

      if (!cancelado) {
        setJogos(dedup(lista))
        setErro(lista.length === 0 ? 'Não foi possível carregar os jogos.' : null)
        setCarregando(false)
      }
    }

    buscar()
    return () => {
      cancelado = true
    }
  }, [])

  return { jogos, carregando, erro }
}
