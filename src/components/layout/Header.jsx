import { useState } from 'react'
import Logo from './Logo'
import NavButton from '../ui/NavButton'
import SearchBar from '../ui/SearchBar'
import IconButton from '../ui/iconButton'
import UserChip from '../ui/UserChip'

const USUARIO = { nome: 'João Silva', iniciais: 'JS', saldo: 142.30, matricula: '2024001' }
const NAV_ITENS = ['Loja', 'Biblioteca', 'Wishlist']

function Header({ onIrParaLoja, onIrParaCriar, onBuscar }) {
  const [ativo, setAtivo] = useState('Loja')

  function aoClicarNav(item) {
    setAtivo(item)
    if (item === 'Loja') onIrParaLoja?.()
  }

  return (
    <header className="sticky top-0 z-50 flex items-center gap-5 px-8 py-3 bg-fundo-primario/80 backdrop-blur-md border-b border-borda">
      <Logo />

      <nav className="flex gap-0.5 ml-3">
        {NAV_ITENS.map((item) => (
          <NavButton key={item} ativo={ativo === item} onClick={() => aoClicarNav(item)}>
            {item}
          </NavButton>
        ))}
        <NavButton ativo={ativo === 'Publicar'} onClick={() => { setAtivo('Publicar'); onIrParaCriar?.() }}>
          + Publicar
        </NavButton>
      </nav>

      <SearchBar onBuscar={onBuscar} />

      <div className="flex items-center gap-1.5 ml-auto">
        <IconButton icone="sino" rotulo="Notificações" badge={3} corBadge="roxo-neon" onClick={() => {}} />
        <IconButton icone="carrinho" rotulo="Carrinho" badge={2} corBadge="verde-acido" onClick={() => {}} />
        <UserChip
          usuario={USUARIO}
          wishlistCount={4}
          onAcessarBiblioteca={() => setAtivo('Biblioteca')}
          onAcessarWishlist={() => setAtivo('Wishlist')}
          onAcessarConfiguracoes={() => {}}
          onSair={() => {}}
        />
      </div>
    </header>
  )
}

export default Header
