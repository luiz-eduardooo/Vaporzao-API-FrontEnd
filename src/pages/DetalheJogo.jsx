import { useState, useEffect } from 'react'
import { getJogoPorId } from '../services/jogosService'
import { useWishlist } from '../context/wishlistShared'

const Generos = ({ generos = [] }) => !generos.length ? null : (
  <div className="flex flex-wrap gap-1.5 mb-3">
    {generos.map((g) => (
      <span key={g.id} className="px-2.5 py-0.5 rounded text-[11px] bg-roxo-neon/20 border border-roxo-neon/40 text-roxo-neon font-medium">{g.nome}</span>
    ))}
  </div>
)

const Nota = ({ nota }) => !nota ? null : (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fundo-secundario border border-verde-acido mb-4">
    <span className="text-verde-acido font-bold text-lg">{nota.toFixed(1)}</span>
    <span className="text-texto-secundario text-xs">/ avaliação média</span>
  </div>
)

const BotaoVoltar = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full bg-fundo-primario/70 backdrop-blur-sm border border-borda text-texto-secundario hover:text-texto-primario hover:border-roxo-neon transition text-sm">
    ← Voltar
  </button>
)

function useJogo(jogoId) {
  const [jogo, setJogo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!jogoId) return
    let cancelado = false
    setCarregando(true)
    getJogoPorId(jogoId)
      .then((d) => { if (!cancelado) { setJogo(d); setErro(null) } })
      .catch(() => { if (!cancelado) setErro('Não foi possível carregar os detalhes.') })
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [jogoId])

  return { jogo, carregando, erro }
}

export default function DetalheJogo({ jogoId, onVoltar }) {
  const { jogo, carregando, erro } = useJogo(jogoId)
  const { naWishlist, alternar } = useWishlist()

  if (carregando) return <p className="text-center text-texto-secundario py-20">Carregando...</p>
  if (erro || !jogo) return <p className="text-center text-erro py-20">{erro ?? 'Jogo não encontrado.'}</p>

  const preco = jogo.preco === 0 ? 'Grátis' : `R$ ${Number(jogo.preco).toFixed(2).replace('.', ',')}`
  const lancamento = jogo.lancamento ? new Date(jogo.lancamento).toLocaleDateString('pt-BR') : null
  const desejado = naWishlist(jogo.id)

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="relative h-[320px] overflow-hidden">
        {jogo.capaUrl
          ? <img src={jogo.capaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-gradient-to-br from-roxo-neon via-fundo-terciario to-fundo-primario" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0014] via-[#0B0014]/60 to-transparent" />
        <BotaoVoltar onClick={onVoltar} />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 -mt-20 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {jogo.capaUrl && <img src={jogo.capaUrl} alt={jogo.titulo} className="w-[140px] shrink-0 rounded-xl border border-borda shadow-[0_8px_32px_rgba(0,0,0,0.6)]" />}
          <div className="flex-1 pt-2">
            <Generos generos={jogo.generos} />
            <h1 className="font-display text-3xl font-bold text-texto-primario mb-1">{jogo.titulo}</h1>
            <p className="text-texto-secundario text-sm mb-4">{jogo.desenvolvedora}</p>
            <Nota nota={jogo.mediaNotas} />
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display font-bold text-2xl text-verde-acido">{preco}</span>
              <button className="px-6 py-2.5 rounded-lg bg-roxo-neon font-bold text-sm text-white hover:bg-verde-acido hover:text-fundo-primario transition hover:shadow-[0_0_25px_rgba(159,255,61,0.5)]">
                Adicionar ao carrinho
              </button>
              <button
                onClick={() => alternar({
                  id: jogo.id,
                  titulo: jogo.titulo,
                  capaUrl: jogo.capaUrl,
                  preco: jogo.preco,
                  desenvolvedora: jogo.desenvolvedora,
                })}
                aria-pressed={desejado}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm border transition cursor-pointer ${
                  desejado
                    ? 'border-roxo-neon text-roxo-neon bg-roxo-neon/10'
                    : 'border-borda text-texto-secundario hover:border-roxo-neon hover:text-roxo-neon'
                }`}
              >
                {desejado ? '♥ Na wishlist' : '♡ Wishlist'}
              </button>
            </div>
            {lancamento && (
              <div className="bg-fundo-secundario rounded-lg p-3 border border-borda inline-block mb-4">
                <div className="text-texto-secundario text-xs mb-0.5">Lançamento</div>
                <div className="font-medium text-sm">{lancamento}</div>
              </div>
            )}
            {jogo.descricao && (
              <div className="mt-2">
                <h2 className="font-display font-semibold text-base mb-2">Sobre o jogo</h2>
                <p className="text-texto-secundario text-sm leading-relaxed">{jogo.descricao}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}