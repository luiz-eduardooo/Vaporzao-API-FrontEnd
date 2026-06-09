import { useState, useMemo } from 'react'
import FeaturedCarousel from '../components/game/FeaturedCarrousel'
import GameSection from '../components/game/GameSection'
import GeneroFiltro from '../components/game/GeneroFiltro'
import JogosPorGenero from '../components/game/JogosPorGenero'
import { useDestaques } from '../hooks/useDestaques'
import { useTodosJogos } from '../hooks/useTodosJogos'
import { extrairGeneros, filtrarPorGenero } from '../utils/classificarJogos'

function Destaques({ destaques, carregando, erro, onAbrirJogo }) {
  if (carregando) return <p className="text-center text-texto-secundario py-20">Carregando jogos...</p>
  if (erro) return <p className="text-center text-erro py-20">{erro}</p>
  if (!destaques) return null
  return (
    <>
      <GameSection titulo="🆕 Lançamentos recentes" jogos={destaques.recentes} onAbrirJogo={onAbrirJogo} />
      <GameSection titulo="⭐ Mais bem avaliados" jogos={destaques.topAvaliados} onAbrirJogo={onAbrirJogo} />
      <GameSection titulo="🔥 Populares na comunidade" jogos={destaques.populares} onAbrirJogo={onAbrirJogo} />
    </>
  )
}

function Catalogo({ jogos, carregando, onAbrirJogo }) {
  return (
    <div className="mt-6">
      <h2 className="font-display font-bold text-xl text-texto-primario mb-2 px-8">📂 Catálogo por gênero</h2>
      {carregando
        ? <p className="text-center text-texto-secundario py-10">Organizando o catálogo...</p>
        : <JogosPorGenero jogos={jogos} onAbrirJogo={onAbrirJogo} />
      }
    </div>
  )
}

function FiltroGenero({ jogos, selecionado, onSelecionar, carregando }) {
  const generos = useMemo(() => extrairGeneros(jogos), [jogos])
  if (!generos.length) return !carregando
    ? <p className="px-8 text-sm text-texto-secundario">Nenhum gênero encontrado ({jogos.length} jogos).</p>
    : null
  return <GeneroFiltro generos={generos} selecionado={selecionado} onSelecionar={onSelecionar} />
}

export default function Home({ onAbrirJogo }) {
  const { destaques, carregando, erro } = useDestaques()
  const { jogos: todosJogos, carregando: carregandoTodos } = useTodosJogos()
  const [generoSel, setGeneroSel] = useState(null)

  const jogosFiltrados = useMemo(() => filtrarPorGenero(todosJogos, generoSel), [todosJogos, generoSel])

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {generoSel == null && <FeaturedCarousel limit={5} interval={5000} onAbrirJogo={onAbrirJogo} />}

        <div className="mt-10">
          <FiltroGenero jogos={todosJogos} selecionado={generoSel} onSelecionar={setGeneroSel} carregando={carregandoTodos} />
        </div>

        {generoSel != null ? (
          <>
            {carregandoTodos && <p className="text-center text-texto-secundario py-20">Carregando jogos...</p>}
            {!carregandoTodos && jogosFiltrados.length === 0 && <p className="text-center text-texto-secundario py-20">Nenhum jogo encontrado neste gênero.</p>}
            {!carregandoTodos && jogosFiltrados.length > 0 && <GameSection titulo="Resultados" jogos={jogosFiltrados} onAbrirJogo={onAbrirJogo} />}
          </>
        ) : (
          <>
            <Destaques destaques={destaques} carregando={carregando} erro={erro} onAbrirJogo={onAbrirJogo} />
            <Catalogo jogos={todosJogos} carregando={carregandoTodos} onAbrirJogo={onAbrirJogo} />
          </>
        )}
      </div>
    </main>
  )
}