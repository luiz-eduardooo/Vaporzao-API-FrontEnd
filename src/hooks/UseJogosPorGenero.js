import { useState, useEffect } from 'react'
import { getJogosPorGenero } from '../services/jogosService'

/**
 * useJogosPorGenero — busca os jogos de um gênero.
 * Quando generoId é null/undefined, não busca nada (deixa a Home mostrar destaques).
 */
export function useJogosPorGenero(generoId) {
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (generoId == null) {
      setJogos([])
      return
    }

    let cancelado = false
    async function buscar() {
      try {
        setCarregando(true)
        const dados = await getJogosPorGenero(generoId)
        if (!cancelado) {
          setJogos(dados)
          setErro(null)
        }
      } catch {
        if (!cancelado) setErro('Não foi possível carregar os jogos deste gênero.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }
    buscar()
    return () => {
      cancelado = true
    }
  }, [generoId])

  return { jogos, carregando, erro }
}
