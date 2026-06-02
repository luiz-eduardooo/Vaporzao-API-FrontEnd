import { useEffect, useRef, useState } from 'react'
import { getJogosDestaques } from '../../services/jogosService'

/**
 * FeaturedCarousel — exibe os N jogos mais bem avaliados como hero/banner.
 *
 * Props:
 *   - limit:    quantos jogos buscar (default 5)
 *   - interval: tempo do autoplay em ms (default 5000)
 */
export default function FeaturedCarousel({ limit = 5, interval = 5000 }) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [current, setCurrent] = useState(0)
  const autoplayRef = useRef(null)

  // Busca dos jogos
  useEffect(() => {
    let cancelled = false
    async function fetchGames() {
      try {
        setLoading(true)
        const data = await getJogosDestaques(limit)
        if (!cancelled) {
          setGames(data)
          setError(null)
        }
      } catch (err) {
        console.error('[FeaturedCarousel] erro ao buscar jogos:', err)
        if (!cancelled) setError('Não foi possível carregar os destaques.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchGames()
    return () => {
      cancelled = true
    }
  }, [limit])

  // Autoplay
  useEffect(() => {
    if (games.length <= 1) return
    autoplayRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % games.length)
    }, interval)
    return () => clearInterval(autoplayRef.current)
  }, [games.length, interval])

  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = setInterval(() => {
        setCurrent((i) => (i + 1) % games.length)
      }, interval)
    }
  }

  const goTo = (index) => {
    setCurrent(((index % games.length) + games.length) % games.length)
    resetAutoplay()
  }
  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)

  // Pausa o autoplay no hover
  const pause = () => clearInterval(autoplayRef.current)
  const resume = () => {
    if (games.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrent((i) => (i + 1) % games.length)
      }, interval)
    }
  }

  // Estados de loading / erro / vazio
  if (loading) {
    return (
      <div className="w-full h-[420px] rounded-2xl bg-[#150826] border border-white/5 animate-pulse" />
    )
  }
  if (error) {
    return (
      <div className="w-full p-8 rounded-2xl bg-[#150826] border border-[#FF3D6E]/30 text-[#FF3D6E] text-center">
        {error}
      </div>
    )
  }
  if (games.length === 0) {
    return (
      <div className="w-full p-8 rounded-2xl bg-[#150826] border border-white/5 text-[#9B8FB0] text-center">
        Nenhum jogo em destaque no momento.
      </div>
    )
  }

  return (
    <section
      className="w-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-roledescription="carousel"
      aria-label="Jogos mais bem avaliados"
    >
      {/* Cabeçalho da seção */}
      <div className="mb-5">
        <span className="block text-xs font-bold tracking-[0.3em] text-[#B026FF] mb-1">
          // EM DESTAQUE
        </span>
        <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#F2EAFF]">
          Mais bem avaliados
        </h2>
      </div>

      {/* Track */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#150826] shadow-[0_0_40px_rgba(176,38,255,0.15)]">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {games.map((game, i) => (
            <Slide key={game.id ?? i} game={game} active={i === current} />
          ))}
        </div>

        {/* Botões prev / next */}
        {games.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[#F2EAFF] transition hover:bg-[#B026FF] hover:border-[#B026FF] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)]"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[#F2EAFF] transition hover:bg-[#B026FF] hover:border-[#B026FF] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)]"
            >
              <span aria-hidden>›</span>
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {games.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  aria-current={i === current}
                  className={`h-2 rounded-full transition-all duration-300 border border-white/40 ${
                    i === current
                      ? 'w-8 bg-[#9FFF3D] shadow-[0_0_10px_rgba(159,255,61,0.8)]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/* ---------------- Slide individual ---------------- */
function Slide({ game, active }) {
  const title = game.titulo ?? game.title ?? game.name ?? 'Sem título'
  const desc =
    game.description ?? game.descricao ?? game.shortDescription ?? ''
  const image =
    game.capaUrl ?? game.image ?? game.imagem ?? game.cover ?? game.banner ?? game.thumbnail
  const genre =
    game.generos?.[0]?.nome ?? game.genre ?? game.genero ?? game.category
  const rating = game.mediaNotas ?? game.rating ?? game.avaliacao ?? game.score ?? game.nota
  const price = game.preco ?? game.price

  return (
    <div
      className="min-w-full relative h-[380px] md:h-[460px] overflow-hidden"
      aria-hidden={!active}
    >
      {/* Imagem de fundo */}
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#B026FF] via-[#1F0F38] to-[#0B0014]" />
      )}

      {/* Overlay escuro pra legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0014] via-[#0B0014]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0014] via-transparent to-transparent" />

      {/* Conteúdo */}
      <div className="relative z-[1] flex h-full flex-col justify-end p-6 md:p-12 max-w-2xl">
        {genre && (
          <span className="inline-block self-start mb-3 px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#F2EAFF] bg-[#B026FF]/30 border border-[#B026FF] rounded">
            {genre}
          </span>
        )}
        <h3 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold text-[#F2EAFF] mb-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
          {title}
        </h3>
        {desc && (
          <p className="text-sm md:text-base text-[#F2EAFF]/80 mb-5 line-clamp-2 max-w-xl">
            {desc}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <button className="px-6 py-3 bg-[#B026FF] hover:bg-[#9FFF3D] hover:text-[#0B0014] text-[#F2EAFF] font-bold text-sm tracking-wider uppercase rounded transition-all hover:shadow-[0_0_25px_rgba(159,255,61,0.5)]">
            Ver detalhes
          </button>
          {price !== undefined && (
            <span className="text-2xl font-bold text-[#9FFF3D]">
              {typeof price === 'number'
                ? `R$ ${price.toFixed(2).replace('.', ',')}`
                : price}
            </span>
          )}
          {rating !== undefined && (
            <span className="text-sm text-[#F2EAFF]/70">
              ★ <span className="text-[#F2EAFF] font-semibold">{rating}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
