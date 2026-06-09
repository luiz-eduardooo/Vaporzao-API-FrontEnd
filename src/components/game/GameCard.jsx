import GameCover from './GameCover'
import { totalReviews } from '../../utils/classificarJogos'

const Generos = ({ generos = [] }) => (
  <div className="flex flex-wrap gap-1 min-h-[20px]">
    {generos.slice(0, 2).map((g) => (
      <span key={g.id} className="px-1.5 py-0.5 rounded text-[10px] bg-fundo-terciario text-texto-secundario">
        {g.nome}
      </span>
    ))}
  </div>
)

function GameCard({ jogo, onClick }) {
  const { titulo, capaUrl, preco, desenvolvedora, generos } = jogo
  const precoFormatado = preco === 0 ? 'Grátis' : `R$ ${Number(preco).toFixed(2).replace('.', ',')}`
  const nReviews = totalReviews(jogo)

  return (
    <article
      onClick={onClick}
      className="group w-[180px] shrink-0 rounded-lg overflow-hidden bg-fundo-secundario border border-borda cursor-pointer transition-all duration-200 hover:border-roxo-neon hover:-translate-y-1"
    >
      <div className="relative w-full aspect-2/3 overflow-hidden">
        <GameCover url={capaUrl} titulo={titulo} />
        {nReviews != null && nReviews > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-fundo-primario/85 border border-verde-acido font-display font-bold text-xs text-verde-acido">
            {nReviews} ★
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="font-display font-semibold text-sm text-texto-primario truncate group-hover:text-roxo-neon transition-colors" title={titulo}>
          {titulo}
        </h3>
        <p className="text-xs text-texto-secundario truncate">{desenvolvedora}</p>
        <Generos generos={generos} />
        <span className="font-display font-bold text-sm text-verde-acido mt-0.5">{precoFormatado}</span>
      </div>
    </article>
  )
}

export default GameCard