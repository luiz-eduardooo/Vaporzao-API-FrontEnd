/**
 * GeneroFiltro — barra de chips para filtrar por gênero.
 *
 * Props:
 *   - generos: [{ id, nome }]  (extraídos dos próprios jogos)
 *   - selecionado: id do gênero ativo (ou null = "Todos")
 *   - onSelecionar: (generoId | null) => void
 */
function GeneroFiltro({ generos = [], selecionado, onSelecionar }) {
  if (generos.length === 0) return null

  const chipBase =
    'px-4 py-1.5 rounded-full text-sm font-display font-medium ' +
    'border transition-all duration-150 cursor-pointer whitespace-nowrap'

  const chipClasse = (ativo) =>
    `${chipBase} ${
      ativo
        ? 'bg-roxo-neon border-roxo-neon text-white shadow-[0_0_16px_rgba(176,38,255,0.5)]'
        : 'bg-fundo-secundario border-borda text-texto-secundario hover:border-roxo-neon hover:text-texto-primario'
    }`

  return (
    <div className="mb-8">
      <h2 className="font-display font-bold text-xl text-texto-primario mb-4 px-8">
        Navegar por gênero
      </h2>

      <div className="flex flex-wrap gap-2 px-8">
        <button
          onClick={() => onSelecionar(null)}
          className={chipClasse(selecionado == null)}
        >
          Todos
        </button>

        {generos.map((genero) => (
          <button
            key={genero.id}
            onClick={() => onSelecionar(genero.id)}
            className={chipClasse(selecionado === genero.id)}
          >
            {genero.nome}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GeneroFiltro
