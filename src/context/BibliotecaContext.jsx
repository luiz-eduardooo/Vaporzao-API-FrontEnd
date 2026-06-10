import { useEffect, useState, useCallback } from 'react'
import { BibliotecaContext } from './bibliotecaShared'
import { useAuth } from './authShared'
import {
  getBiblioteca,
  adicionarNaBiblioteca,
  removerDaBiblioteca,
} from '../services/jogosService'

/**
 * BibliotecaProvider — jogos que o usuário possui, sincronizados com a API
 * (/biblioteca/me, POST/DELETE /biblioteca/:jogoId).
 *
 * Mesma estratégia da wishlist: carrega ao logar e usa UI otimista
 * (atualiza na hora, desfaz se a API falhar). Sem login, fica vazia.
 */
export function BibliotecaProvider({ children }) {
  const { logado } = useAuth()
  const [itens, setItens] = useState([])

  useEffect(() => {
    let cancelado = false
    async function sincronizar() {
      if (!logado) { setItens([]); return }
      try {
        const lista = await getBiblioteca()
        if (!cancelado) setItens(lista)
      } catch {
        if (!cancelado) setItens([])
      }
    }
    sincronizar()
    return () => { cancelado = true }
  }, [logado])

  const naBiblioteca = useCallback((id) => itens.some((j) => j.id === id), [itens])

  const adicionar = useCallback(async (jogo) => {
    if (!jogo?.id) return
    setItens((atual) => (atual.some((j) => j.id === jogo.id) ? atual : [...atual, jogo]))
    try {
      await adicionarNaBiblioteca(jogo.id)
    } catch (err) {
      setItens((atual) => atual.filter((j) => j.id !== jogo.id)) // desfaz
      throw err
    }
  }, [])

  const remover = useCallback(async (id) => {
    const anterior = itens
    setItens((atual) => atual.filter((j) => j.id !== id))
    try {
      await removerDaBiblioteca(id)
    } catch (err) {
      setItens(anterior) // desfaz
      throw err
    }
  }, [itens])

  const valor = {
    itens,
    quantidade: itens.length,
    naBiblioteca,
    adicionar,
    remover,
  }

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>
}
