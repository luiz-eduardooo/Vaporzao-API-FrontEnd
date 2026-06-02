import GameCard from './GameCard'

function GameSection({ titulo, jogos, onAbrirJogo }) {
  if (!jogos?.length) return null

  return (
    <section className="mb-10">
      <h2 className="font-display font-bold text-xl text-texto-primario mb-4 px-8">{titulo}</h2>
      <div className="flex items-start gap-4 overflow-x-auto px-8 pb-3">
        {jogos.map((jogo) => (
          <GameCard key={jogo.id} jogo={jogo} onClick={() => onAbrirJogo?.(jogo.id)} />
        ))}
      </div>
    </section>
  )
}

export default GameSection