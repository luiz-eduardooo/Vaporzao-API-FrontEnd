import { useState, useEffect } from 'react'
import { getDestaques } from '../services/jogosService'


export function useDestaques() {
  const [destaques, setDestaques] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscar() {
      try {
        setCarregando(true)
        const dados = await getDestaques()
        setDestaques(dados)
        setErro(null)
      } catch {
        setErro('Não foi possível carregar os jogos. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    buscar()
  }, [])

  return { destaques, carregando, erro }
}