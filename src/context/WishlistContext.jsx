import { useEffect, useState, useCallback } from 'react'
import { WishlistContext } from './wishlistShared'

/**
 * WishlistProvider — guarda a lista de desejos do usuário.
 *
 * A API didática nem sempre expõe um endpoint de wishlist por usuário,
 * então a fonte de verdade aqui é o localStorage do navegador. Guardamos
 * o objeto do jogo inteiro (id, titulo, capaUrl, preco...) para conseguir
 * renderizar os cards sem precisar refazer requisições.
 */

const CHAVE = 'vaporzao_wishlist'

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    const lista = bruto ? JSON.parse(bruto) : []
    return Array.isArray(lista) ? lista : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [itens, setItens] = useState(carregar)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens))
    } catch {
      /* ignora indisponibilidade do storage */
    }
  }, [itens])

  const naWishlist = useCallback(
    (id) => itens.some((j) => j.id === id),
    [itens]
  )

  const adicionar = useCallback((jogo) => {
    if (!jogo?.id) return
    setItens((atual) =>
      atual.some((j) => j.id === jogo.id) ? atual : [...atual, jogo]
    )
  }, [])

  const remover = useCallback((id) => {
    setItens((atual) => atual.filter((j) => j.id !== id))
  }, [])

  const alternar = useCallback((jogo) => {
    if (!jogo?.id) return
    setItens((atual) =>
      atual.some((j) => j.id === jogo.id)
        ? atual.filter((j) => j.id !== jogo.id)
        : [...atual, jogo]
    )
  }, [])

  const valor = {
    itens,
    quantidade: itens.length,
    naWishlist,
    adicionar,
    remover,
    alternar,
  }

  return <WishlistContext.Provider value={valor}>{children}</WishlistContext.Provider>
}
