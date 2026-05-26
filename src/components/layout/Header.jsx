import { useState } from 'react'
import Logo from './Logo'
import NavButton from '../ui/NavButton'


function Header() {

  const [ativo, setAtivo] = useState('Loja')

  const itens = ['Loja', 'Biblioteca', 'Wishlist']

  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-5 px-8 py-3
                 bg-fundo-primario/80 backdrop-blur-md
                 border-b border-borda"
    >
      <Logo />

      <nav className="flex gap-0.5 ml-3">
        {itens.map((item) => (
          <NavButton
            key={item}
            ativo={ativo === item}
            onClick={() => setAtivo(item)}
          >
            {item}
          </NavButton>
        ))}
      </nav>
    </header>
  )
}

export default Header