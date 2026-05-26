import GameCover from './GameCover'


function GameCard({ jogo }) {
  const { titulo, capaUrl, preco, desenvolvedora, generos, mediaNotas } = jogo

 
  const precoFormatado =
    preco === 0 ? 'Grátis' : `R$ ${preco.toFixed(2).replace('.', ',')}`

  return (
    <article
      className="group w-[180px] shrink-0 rounded-lg overflow-hidden
                 bg-fundo-secundario border border-borda cursor-pointer
                 transition-all duration-200
                 hover:border-roxo-neon hover:-translate-y-1"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <GameCover url={capaUrl} titulo={titulo} />

    
        {mediaNotas != null && (
          <span
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full
                       bg-fundo-primario/85 border border-verde-acido
                       font-display font-bold text-xs text-verde-acido"
          >
            {mediaNotas.toFixed(1)}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5">
       
        <h3
          className="font-display font-semibold text-sm text-texto-primario
                     truncate group-hover:text-roxo-neon transition-colors"
          title={titulo}
        >
          {titulo}
        </h3>

        <p className="text-xs text-texto-secundario truncate">
          {desenvolvedora}
        </p>

        <div className="flex flex-wrap gap-1 min-h-[20px]">
          {generos.slice(0, 2).map((genero) => (
            <span
              key={genero.id}
              className="px-1.5 py-0.5 rounded text-[10px]
                         bg-fundo-terciario text-texto-secundario"
            >
              {genero.nome}
            </span>
          ))}
        </div>

        <span className="font-display font-bold text-sm text-verde-acido mt-0.5">
          {precoFormatado}
        </span>
      </div>
    </article>
  )
}

export default GameCard