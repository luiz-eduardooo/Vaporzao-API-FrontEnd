import { useState } from 'react'
import Icon from './icon'

function SearchBar({ onBuscar = () => {} }) {
  const [valor, setValor] = useState('')

  function aoPressionarTecla(e) {
    console.log('tecla:', e.key, 'valor:', valor)
    if (e.key === 'Enter' && valor.trim()) {
      console.log('chamando onBuscar com:', valor.trim())
      onBuscar(valor.trim())
      e.target.blur()
    }
  }

  function aoClicarBusca() {
    if (valor.trim()) onBuscar(valor.trim())
  }

  return (
    <div className="flex-1 max-w-md mx-auto">
      <div className="relative flex items-center">
        <Icon
          nome="busca"
          className="absolute left-3 w-4 h-4 text-texto-secundario pointer-events-none"
        />
        <input
          type="search"
          placeholder="Buscar jogos..."
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={aoPressionarTecla}
          className="w-full bg-fundo-secundario text-texto-primario placeholder:text-texto-secundario border border-borda rounded-md py-2.5 pl-10 pr-4 text-sm transition-all duration-150  hover:border-roxo-neon/40 focus:outline-none focus:border-roxo-neon focus:ring-2 focus:ring-roxo-neon/20"
        />
        {valor.trim() && (
          <button
            onClick={aoClicarBusca}
            className="absolute right-2 px-2 py-1 text-xs rounded bg-roxo-neon text-white font-bold hover:bg-verde-acido hover:text-fundo-primario transition"
          >
            ↵
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
