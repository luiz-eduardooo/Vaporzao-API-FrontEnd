import { useState, useEffect } from 'react'
import { getJogos } from '../services/jogosService'
import GameCard from '../components/game/GameCard'

// Busca todos os jogos paginados
async function buscarTodos() {
  const primeira = await getJogos({ pagina: 1, limite: 50 })
  let todos = primeira?.itens ?? primeira?.jogos ?? []
  const totalPaginas = primeira?.paginas ?? 1
  if (totalPaginas > 1) {
    const resto = await Promise.all(
      Array.from({ length: totalPaginas - 1 }, (_, i) =>
        getJogos({ pagina: i + 2, limite: 50 })
      )
    )
    resto.forEach((r) => { todos = todos.concat(r?.itens ?? r?.jogos ?? []) })
  }
  return todos
}

export default function ResultadoBusca({ query, onAbrirJogo }) {
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!query) return
    let cancelado = false
    setCarregando(true); setJogos([]); setErro(null)

    buscarTodos()
      .then((todos) => {
        const filtrados = todos.filter((j) =>
          j.titulo?.toLowerCase().includes(query.toLowerCase())
        )
        if (!cancelado) setJogos(filtrados)
      })
      .catch(() => { if (!cancelado) setErro('Não foi possível realizar a busca.') })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [query])

  const total = jogos.length
  const pluralizar = (n) => `${n} resultado${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}`

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">// BUSCA</span>
        <h1 className="font-display text-2xl font-bold text-texto-primario mb-6">
          Resultados para: <span className="text-roxo-neon">"{query}"</span>
        </h1>

        {carregando && <p className="text-center text-texto-secundario py-20">Buscando...</p>}
        {erro && <p className="text-center text-erro py-20">{erro}</p>}
        {!carregando && !erro && total === 0 && (
          <div className="text-center py-20">
            <p className="text-texto-secundario text-lg">Nenhum resultado encontrado.</p>
            <p className="text-texto-secundario text-sm mt-1">Tente outros termos de busca.</p>
          </div>
        )}
        {!carregando && !erro && total > 0 && (
          <>
            <p className="text-texto-secundario text-sm mb-6">{pluralizar(total)}</p>
            <div className="flex flex-wrap gap-4">
              {jogos.map((jogo) => (
                <GameCard key={jogo.id} jogo={jogo} onClick={() => onAbrirJogo?.(jogo.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}