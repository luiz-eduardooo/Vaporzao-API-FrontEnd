import Icon from './Icon'

function SearchBar({ onBuscar = () => {}, placeholder = 'Buscar jogos...' }) {
  function aoPressionarTecla(evento) {
    if (evento.key === 'Enter') {
      const valor = evento.target.value.trim()
      if (valor) {
        onBuscar(valor)
        evento.target.blur()
      }
    }
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
          placeholder={placeholder}
          onKeyDown={aoPressionarTecla}
          className="w-full bg-fundo-secundario text-texto-primario placeholder:text-texto-secundario border border-borda rounded-md py-2.5 pl-10 pr-14 text-sm font-body transition-all duration-150 hover:border-roxo-neon/40 focus:outline-none focus:border-roxo-neon focus:ring-2 focus:ring-roxo-neon/20"
     />
        <kbd
          className="absolute right-2 px-1.5 py-0.5 rounded text-[10px] font-mono text-texto-secundario bg-fundo-terciario border border-borda"
        >
          ⌘ K
        </kbd>
      </div>
    </div>
  )
}

export default SearchBar
