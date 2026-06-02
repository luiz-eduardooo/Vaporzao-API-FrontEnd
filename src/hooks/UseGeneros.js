import { useState, useEffect } from 'react'
import { getGeneros } from '../services/jogosService'

export function useGeneros() {
  const [generos, setGeneros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscar() {
      try {
        setCarregando(true)
        const dados = await getGeneros()
        setGeneros(dados)
        setErro(null)
      } catch {
        setErro('Não foi possível carregar os gêneros.')
      } finally {
        setCarregando(false)
      }
    }
    buscar()
  }, [])

  return { generos, carregando, erro }
}
