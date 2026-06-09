import { useState, useEffect } from 'react'
import { getJogoPorId, getReviews, getConquistas } from '../services/jogosService'
import { mediaDasReviews } from '../utils/classificarJogos'
import { useWishlist } from '../context/wishlistShared'
import { useBiblioteca } from '../context/bibliotecaShared'

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
    <span className="text-texto-secundario text-xs">/ 10 · média das reviews</span>
  </div>
)

const BotaoVoltar = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full bg-fundo-primario/70 backdrop-blur-sm border border-borda text-texto-secundario hover:text-texto-primario hover:border-roxo-neon transition text-sm">
    ← Voltar
  </button>
)

function Midia({ imagens, videos }) {
  const temImagens = Array.isArray(imagens) && imagens.length > 0
  const temVideos = Array.isArray(videos) && videos.length > 0
  if (!temImagens && !temVideos) {
    return <p className="text-texto-secundario text-sm">Este jogo ainda não tem mídia cadastrada.</p>
  }
  return (
    <div className="flex flex-col gap-4">
      {temVideos && (
        <div className="flex flex-col gap-2">
          {videos.map((v, i) => (
            <a
              key={v.id ?? i}
              href={v.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-fundo-secundario border border-borda rounded-lg p-3 hover:border-roxo-neon transition group"
            >
              <span className="text-2xl shrink-0" aria-hidden>▶️</span>
              <span className="min-w-0">
                <span className="block font-display font-semibold text-sm text-texto-primario group-hover:text-roxo-neon transition truncate">
                  {v.titulo ?? 'Vídeo'}
                </span>
                <span className="block text-texto-secundario text-xs truncate">{v.url}</span>
              </span>
            </a>
          ))}
        </div>
      )}
      {temImagens && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {imagens.map((img, i) => (
            <figure key={img.id ?? i} className="shrink-0 w-[260px]">
              <img
                src={img.url}
                alt={img.legenda ?? `Screenshot ${i + 1}`}
                loading="lazy"
                className="w-full h-[150px] object-cover rounded-lg border border-borda"
              />
              {img.legenda && <figcaption className="text-texto-secundario text-xs mt-1 truncate">{img.legenda}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}

function Reviews({ reviews }) {
  if (!reviews?.length) {
    return <p className="text-texto-secundario text-sm">Este jogo ainda não tem reviews da comunidade.</p>
  }
  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r, i) => {
        const autor = r.autor?.nome ?? r.autor ?? 'Anônimo'
        const nota = r.nota
        const texto = r.texto ?? r.comentario ?? ''
        return (
          <div key={r.id ?? i} className="bg-fundo-secundario border border-borda rounded-lg p-4">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-display font-semibold text-sm text-texto-primario">{String(autor)}</span>
              <span className="flex items-center gap-2">
                {r.recomenda != null && (
                  <span className={`text-xs ${r.recomenda ? 'text-verde-acido' : 'text-erro'}`}>
                    {r.recomenda ? '👍 Recomenda' : '👎 Não recomenda'}
                  </span>
                )}
                {nota != null && (
                  <span className="px-2 py-0.5 rounded-full bg-fundo-primario border border-verde-acido font-display font-bold text-xs text-verde-acido">
                    {Number(nota).toFixed(0)}/10
                  </span>
                )}
              </span>
            </div>
            {texto && <p className="text-texto-secundario text-sm leading-relaxed">{texto}</p>}
          </div>
        )
      })}
    </div>
  )
}

function Conquistas({ conquistas }) {
  if (!conquistas?.length) {
    return <p className="text-texto-secundario text-sm">Este jogo ainda não tem conquistas cadastradas.</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {conquistas.map((c, i) => {
        const nome = c.titulo ?? c.nome ?? c.name ?? 'Conquista'
        const desc = c.descricao ?? c.description ?? ''
        const pontos = c.pontos
        return (
          <div key={c.id ?? i} className="flex items-start gap-3 bg-fundo-secundario border border-borda rounded-lg p-3">
            <span className="text-2xl shrink-0" aria-hidden>🏆</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-semibold text-sm text-texto-primario">{nome}</p>
                {pontos != null && <span className="shrink-0 text-xs font-bold text-verde-acido">{pontos} pts</span>}
              </div>
              {desc && <p className="text-texto-secundario text-xs mt-0.5 leading-relaxed">{desc}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Carrega reviews e conquistas do jogo. Usa o que já vier embutido no objeto
// do jogo; senão, busca nos endpoints dedicados.
function useReviewsEConquistas(jogoId, jogo) {
  const [reviews, setReviews] = useState([])
  const [conquistas, setConquistas] = useState([])

  useEffect(() => {
    if (!jogoId) return
    let cancelado = false

    const reviewsEmbutidas = jogo?.reviews
    const conquistasEmbutidas = jogo?.conquistas

    async function carregar() {
      const [revs, conqs] = await Promise.all([
        Array.isArray(reviewsEmbutidas) ? Promise.resolve(reviewsEmbutidas) : getReviews(jogoId),
        Array.isArray(conquistasEmbutidas) ? Promise.resolve(conquistasEmbutidas) : getConquistas(jogoId),
      ])
      if (!cancelado) { setReviews(revs); setConquistas(conqs) }
    }
    carregar()
    return () => { cancelado = true }
  }, [jogoId, jogo])

  return { reviews, conquistas }
}

function useJogo(jogoId) {
  const [jogo, setJogo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!jogoId) return
    let cancelado = false
    async function carregar() {
      setCarregando(true)
      try {
        const d = await getJogoPorId(jogoId)
        if (!cancelado) { setJogo(d); setErro(null) }
      } catch {
        if (!cancelado) setErro('Não foi possível carregar os detalhes.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }
    carregar()
    return () => { cancelado = true }
  }, [jogoId])

  return { jogo, carregando, erro }
}

export default function DetalheJogo({ jogoId, onVoltar }) {
  const { jogo, carregando, erro } = useJogo(jogoId)
  const { naWishlist, alternar } = useWishlist()
  const { naBiblioteca, adicionar, remover } = useBiblioteca()
  const { reviews, conquistas } = useReviewsEConquistas(jogoId, jogo)
  const [processandoBib, setProcessandoBib] = useState(false)

  if (carregando) return <p className="text-center text-texto-secundario py-20">Carregando...</p>
  if (erro || !jogo) return <p className="text-center text-erro py-20">{erro ?? 'Jogo não encontrado.'}</p>

  const preco = jogo.preco === 0 ? 'Grátis' : `R$ ${Number(jogo.preco).toFixed(2).replace('.', ',')}`
  const lancamento = jogo.lancamento ? new Date(jogo.lancamento).toLocaleDateString('pt-BR') : null
  const desejado = naWishlist(jogo.id)
  const possuido = naBiblioteca(jogo.id)

  const resumoJogo = {
    id: jogo.id,
    titulo: jogo.titulo,
    capaUrl: jogo.capaUrl,
    preco: jogo.preco,
    desenvolvedora: jogo.desenvolvedora,
  }

  async function alternarBiblioteca() {
    setProcessandoBib(true)
    try {
      if (possuido) await remover(jogo.id)
      else await adicionar(resumoJogo)
    } catch (err) {
      const status = err?.response?.status
      alert(status === 401 || status === 403
        ? 'Faça login para adicionar jogos à sua biblioteca.'
        : 'Não foi possível atualizar sua biblioteca. Tente novamente.')
    } finally {
      setProcessandoBib(false)
    }
  }

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
            <Nota nota={mediaDasReviews(jogo)} />
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display font-bold text-2xl text-verde-acido">{preco}</span>
              <button
                onClick={alternarBiblioteca}
                disabled={processandoBib}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  possuido
                    ? 'bg-fundo-terciario text-verde-acido border border-verde-acido hover:border-erro hover:text-erro'
                    : 'bg-roxo-neon text-white hover:bg-verde-acido hover:text-fundo-primario hover:shadow-[0_0_25px_rgba(159,255,61,0.5)]'
                }`}
              >
                {processandoBib
                  ? 'Aguarde...'
                  : possuido ? '✓ Na biblioteca' : '+ Adicionar à biblioteca'}
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

        <section className="mt-12">
          <h2 className="font-display font-bold text-xl text-texto-primario mb-4">🎬 Mídia</h2>
          <Midia imagens={jogo.imagens} videos={jogo.videos} />
        </section>

        <section className="mt-12">
          <h2 className="font-display font-bold text-xl text-texto-primario mb-4">🏆 Conquistas</h2>
          <Conquistas conquistas={conquistas} />
        </section>

        <section className="mt-12">
          <h2 className="font-display font-bold text-xl text-texto-primario mb-4">💬 Reviews da comunidade</h2>
          <Reviews reviews={reviews} />
        </section>
      </div>
    </main>
  )
}