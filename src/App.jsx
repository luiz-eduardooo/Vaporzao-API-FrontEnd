import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CriarJogo from './pages/CriarJogo'
import ResultadoBusca from './pages/ResultadoBusca'

function App() {
  const [view, setView] = useState('loja')
  const [recarga, setRecarga] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  function aoCriar() {
    setRecarga((n) => n + 1)
    setView('loja')
  }

  function buscar(query) {
    setSearchQuery(query)
    setView('busca')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onIrParaLoja={() => setView('loja')}
        onIrParaCriar={() => setView('criar')}
        onBuscar={buscar}
      />

      <div className="flex-1">
        {view === 'criar' ? (
          <CriarJogo onCriado={aoCriar} />
        ) : view === 'busca' ? (
          <ResultadoBusca query={searchQuery} />
        ) : (
          <Home key={recarga} />
        )}
      </div>

      <Footer />
    </div>
  )
}

export default App
