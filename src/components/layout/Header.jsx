import { useState } from 'react'
import Logo from './Logo'
import NavButton from '../ui/NavButton'
import SearchBar from '../ui/SearchBar'
import IconButton from '../ui/IconButton'
import UserChip from '../ui/UserChip'

function Header({ onBuscar = () => {} }) {
  const [ativo, setAtivo] = useState('Loja')

  const itens = ['Loja', 'Biblioteca', 'Wishlist']

  // ⚠️ Mock temporário. Trocar pelos dados reais do usuário quando a tela
  // de login/autenticação estiver pronta (entrega final).
  const usuario = { nome: 'Visitante', iniciais: 'V', saldo: 0, matricula: '—' }

  const emBreve = (recurso) => () =>
    alert(`${recurso}: em breve! (ainda não implementado)`)

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

      <SearchBar onBuscar={onBuscar} />

      <div className="flex items-center gap-1 ml-auto">
        {/* Ícones decorativos (sem endpoint na API) — exibem aviso ao clicar */}
        <IconButton icone="carrinho" rotulo="Carrinho" onClick={emBreve('Carrinho')} />
        <IconButton icone="sino" rotulo="Notificações" onClick={emBreve('Notificações')} badge={0} />
        <UserChip usuario={usuario} />
      </div>
    </header>
  )
}

export default Header
