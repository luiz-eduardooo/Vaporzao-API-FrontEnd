import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import GameSection from './components/game/GameSection'
import FeaturedCarousel from './components/ui/FeaturedCarousel'
import { useDestaques } from './hooks/useDestaques'

function App() {
  const { destaques, carregando, erro } = useDestaques()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
          <FeaturedCarousel limit={5} interval={5000} />
        </div>

        {carregando && (
          <p className="text-center text-texto-secundario py-20">
            Carregando jogos...
          </p>
        )}

        {erro && <p className="text-center text-erro py-20">{erro}</p>}

        {destaques && (
          <>
            <GameSection titulo="🆕 Lançamentos recentes" jogos={destaques.recentes} />
            <GameSection titulo="⭐ Mais bem avaliados" jogos={destaques.topAvaliados} />
            <GameSection titulo="🔥 Populares na comunidade" jogos={destaques.populares} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
