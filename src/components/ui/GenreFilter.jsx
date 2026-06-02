function GenreFilter({ generos, generoAtivo, onSelect }) {
  return (
    <div className="flex items-center gap-2 px-8 mb-6 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-3.5 py-1.5 rounded-full font-display font-medium text-xs
                    border transition-all duration-150
                    ${
                      generoAtivo === null
                        ? 'bg-roxo-neon border-roxo-neon text-white shadow-[0_0_10px_rgba(176,38,255,0.4)]'
                        : 'border-borda text-texto-secundario hover:border-roxo-neon hover:text-texto-primario bg-fundo-secundario'
                    }`}
      >
        Todos
      </button>

      {generos.map((genero) => (
        <button
          key={genero.id}
          onClick={() => onSelect(genero.id)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full font-display font-medium text-xs
                      border transition-all duration-150
                      ${
                        generoAtivo === genero.id
                          ? 'bg-roxo-neon border-roxo-neon text-white shadow-[0_0_10px_rgba(176,38,255,0.4)]'
                          : 'border-borda text-texto-secundario hover:border-roxo-neon hover:text-texto-primario bg-fundo-secundario'
                      }`}
        >
          {genero.nome}
        </button>
      ))}
    </div>
  )
}

export default GenreFilter
