import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CriarJogo from './pages/CriarJogo'
import ResultadoBusca from './pages/ResultadoBusca'
import DetalheJogo from './pages/DetalheJogo'
import Perfil from './pages/Perfil'
import Biblioteca from './pages/Biblioteca'
import Wishlist from './pages/Wishlist'
import MeusJogos from './pages/MeusJogos'
import Login from './pages/Login'
import { useAuth } from './context/authShared'

function App() {
  const { usuario, logado, sair } = useAuth()

  const [view, setView] = useState('loja')
  const [recarga, setRecarga] = useState(0)
  const [jogoId, setJogoId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const ir = (v) => setView(v)
  const abrirJogo = (id) => { setJogoId(id); ir('detalhe') }
  const buscar = (q) => { setSearchQuery(q); ir('busca') }
  const aoCriar = () => { setRecarga((n) => n + 1); ir('meus-jogos') }

  // Exige login: se logado, vai para a view; senão, manda para o login.
  const irProtegido = (v) => ir(logado ? v : 'login')

  const aoLogar = () => ir('meus-jogos')
  const aoSair = () => { sair(); ir('loja') }

  const views = {
    loja:         <Home key={recarga} onAbrirJogo={abrirJogo} />,
    criar:        <CriarJogo onCriado={aoCriar} />,
    busca:        <ResultadoBusca query={searchQuery} onAbrirJogo={abrirJogo} />,
    detalhe:      <DetalheJogo jogoId={jogoId} onVoltar={() => ir('loja')} />,
    perfil:       <Perfil />,
    biblioteca:   <Biblioteca onAbrirJogo={abrirJogo} />,
    wishlist:     <Wishlist onAbrirJogo={abrirJogo} />,
    'meus-jogos': <MeusJogos key={recarga} usuario={usuario} onAbrirJogo={abrirJogo} onPublicar={() => irProtegido('criar')} />,
    login:        <Login onLogado={aoLogar} />,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        usuario={usuario}
        logado={logado}
        onIrParaLoja={() => ir('loja')}
        onIrParaCriar={() => irProtegido('criar')}
        onIrParaPerfil={() => ir('perfil')}
        onIrParaBiblioteca={() => irProtegido('biblioteca')}
        onIrParaWishlist={() => ir('wishlist')}
        onIrParaMeusJogos={() => irProtegido('meus-jogos')}
        onIrParaLogin={() => ir('login')}
        onSair={aoSair}
        onBuscar={buscar}
      />
      <div className="flex-1">{views[view]}</div>
      <Footer />
    </div>
  )
}

export default App
