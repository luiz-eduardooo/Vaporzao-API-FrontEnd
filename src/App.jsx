import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import GameSection from './components/game/GameSection'
import { useDestaques } from './hooks/useDestaques'

function App() {
  const { destaques, carregando, erro } = useDestaques()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        {carregando && (
          <p className="text-center text-texto-secundario py-20">
            Carregando jogos...
          </p>
        )}

        {erro && (
          <p className="text-center text-erro py-20">{erro}</p>
        )}

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