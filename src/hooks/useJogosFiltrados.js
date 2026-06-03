import { useState, useEffect } from 'react'
import { getJogos } from '../services/jogosService'

export function useJogosFiltrados(generoId) {
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscar() {
      try {
        setCarregando(true)
        const params = generoId ? { generoId } : {}
        const dados = await getJogos(params)
        setJogos(dados)
        setErro(null)
      } catch {
        setErro('Não foi possível carregar os jogos. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    buscar()
  }, [generoId])

  return { jogos, carregando, erro }
}
