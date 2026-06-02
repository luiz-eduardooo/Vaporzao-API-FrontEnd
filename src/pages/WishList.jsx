import { useWishlist } from '../context/wishlistShared'
import GameCover from '../components/game/GameCover'

function precoFormatado(preco) {
  if (preco == null) return null
  return Number(preco) === 0 ? 'Grátis' : `R$ ${Number(preco).toFixed(2).replace('.', ',')}`
}

function ItemWishlist({ jogo, onAbrir, onRemover }) {
  const preco = precoFormatado(jogo.preco)
  return (
    <article className="group flex gap-4 p-3 rounded-lg bg-fundo-secundario border border-borda transition-all duration-200 hover:border-roxo-neon">
      <div
        onClick={() => onAbrir?.(jogo.id)}
        className="w-[80px] aspect-2/3 shrink-0 rounded-md overflow-hidden cursor-pointer"
      >
        <GameCover url={jogo.capaUrl} titulo={jogo.titulo} />
      </div>

      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3
          onClick={() => onAbrir?.(jogo.id)}
          className="font-display font-semibold text-sm text-texto-primario truncate cursor-pointer group-hover:text-roxo-neon transition-colors"
          title={jogo.titulo}
        >
          {jogo.titulo}
        </h3>
        <p className="text-xs text-texto-secundario truncate mt-0.5">{jogo.desenvolvedora}</p>
        {preco && <span className="font-display font-bold text-sm text-verde-acido mt-2">{preco}</span>}
      </div>

      <button
        onClick={() => onRemover(jogo.id)}
        className="self-center shrink-0 px-3 py-1.5 rounded-md text-xs border border-borda text-texto-secundario hover:border-erro hover:text-erro transition-colors cursor-pointer"
      >
        Remover
      </button>
    </article>
  )
}

export default function Wishlist({ onAbrirJogo }) {
  const { itens, remover } = useWishlist()

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">// MINHA CONTA</span>
        <h1 className="font-display text-2xl font-bold text-texto-primario mb-6">Wishlist</h1>

        {itens.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-texto-secundario text-lg">Sua lista de desejos está vazia.</p>
            <p className="text-texto-secundario text-sm mt-1">Adicione jogos pela página de detalhes.</p>
          </div>
        ) : (
          <>
            <p className="text-texto-secundario text-sm mb-6">
              {itens.length} jogo{itens.length !== 1 ? 's' : ''} na lista de desejos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {itens.map((jogo) => (
                <ItemWishlist key={jogo.id} jogo={jogo} onAbrir={onAbrirJogo} onRemover={remover} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
