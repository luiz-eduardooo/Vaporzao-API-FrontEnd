import { useState } from 'react'
import Logo from './Logo'
import NavButton from '../ui/NavButton'
import SearchBar from '../ui/SearchBar'
import IconButton from '../ui/IconButton'
import UserChip from '../ui/UserChip'
import { useWishlist } from '../../context/wishlistShared'

// nome exibido -> ação de navegação
const NAV_ITENS = [
  { rotulo: 'Loja', destino: 'onIrParaLoja' },
  { rotulo: 'Biblioteca', destino: 'onIrParaBiblioteca' },
  { rotulo: 'Wishlist', destino: 'onIrParaWishlist' },
]

function Header({
  usuario,
  logado = false,
  onIrParaLoja,
  onIrParaCriar,
  onIrParaPerfil,
  onIrParaBiblioteca,
  onIrParaWishlist,
  onIrParaMeusJogos,
  onIrParaLogin,
  onSair,
  onBuscar,
}) {
  const [ativo, setAtivo] = useState('Loja')
  const { quantidade } = useWishlist()

  const acoes = { onIrParaLoja, onIrParaBiblioteca, onIrParaWishlist }

  function aoClicarNav(item) {
    setAtivo(item.rotulo)
    acoes[item.destino]?.()
  }

  return (
    <header className="sticky top-0 z-50 flex items-center gap-5 px-8 py-3 bg-fundo-primario/80 backdrop-blur-md border-b border-borda">
      <Logo />

      <nav className="flex gap-0.5 ml-3">
        {NAV_ITENS.map((item) => (
          <NavButton key={item.rotulo} ativo={ativo === item.rotulo} onClick={() => aoClicarNav(item)}>
            {item.rotulo}
          </NavButton>
        ))}
        <NavButton ativo={ativo === 'Publicar'} onClick={() => { setAtivo('Publicar'); onIrParaCriar?.() }}>
          + Publicar
        </NavButton>
      </nav>

      <SearchBar onBuscar={onBuscar} />

      <div className="flex items-center gap-1.5 ml-auto">
        <IconButton icone="sino" rotulo="Notificações (em breve)" onClick={() => alert('Notificações chegam em breve! 🔔')} />
        <IconButton icone="carrinho" rotulo="Carrinho (em breve)" onClick={() => alert('O carrinho de compras chega em breve! 🛒')} />

        {logado ? (
          <UserChip
            usuario={usuario}
            wishlistCount={quantidade}
            onAcessarMeusJogos={() => { setAtivo(''); onIrParaMeusJogos?.() }}
            onAcessarBiblioteca={() => { setAtivo('Biblioteca'); onIrParaBiblioteca?.() }}
            onAcessarWishlist={() => { setAtivo('Wishlist'); onIrParaWishlist?.() }}
            onAcessarConfiguracoes={() => onIrParaPerfil?.()}
            onSair={() => onSair?.()}
          />
        ) : (
          <button
            onClick={() => onIrParaLogin?.()}
            className="px-5 py-1.5 rounded-full font-display font-semibold text-sm text-white bg-roxo-neon transition hover:bg-verde-acido hover:text-fundo-primario cursor-pointer"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
