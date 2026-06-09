import { useState, useEffect } from 'react'
import { getMeusJogos, excluirJogo } from '../services/jogosService'
import { totalReviews } from '../utils/classificarJogos'
import GameCover from '../components/game/GameCover'

const LIMITE_JOGOS = 3 // a API permite no máximo 3 jogos por usuário

function formatarPreco(preco) {
  if (preco == null) return '—'
  return Number(preco) === 0 ? 'Grátis' : `R$ ${Number(preco).toFixed(2).replace('.', ',')}`
}

function formatarData(valor) {
  if (!valor) return null
  const d = new Date(valor)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('pt-BR')
}

function Generos({ generos = [] }) {
  if (!generos.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {generos.map((g) => (
        <span
          key={g.id ?? g.nome}
          className="px-2 py-0.5 rounded text-[10px] bg-roxo-neon/15 border border-roxo-neon/40 text-roxo-neon font-medium"
        >
          {g.nome ?? g.name ?? String(g)}
        </span>
      ))}
    </div>
  )
}

function Info({ label, valor }) {
  if (valor == null) return null
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-wider text-texto-secundario">{label}</span>
      <span className="text-sm text-texto-primario font-medium">{valor}</span>
    </div>
  )
}

function CardJogo({ jogo, onAbrir, onEditar, onExcluir, excluindo }) {
  const lancamento = formatarData(jogo.lancamento)
  const parar = (fn) => (e) => { e.stopPropagation(); fn() }
  return (
    <article
      onClick={() => onAbrir?.(jogo.id)}
      className="group flex gap-4 p-4 rounded-xl bg-fundo-secundario border border-borda cursor-pointer transition-all duration-200 hover:border-roxo-neon hover:-translate-y-0.5"
    >
      <div className="w-[110px] aspect-2/3 shrink-0 rounded-lg overflow-hidden border border-borda">
        <GameCover url={jogo.capaUrl} titulo={jogo.titulo} />
      </div>

      <div className="flex flex-col min-w-0 flex-1 gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="font-display font-bold text-base text-texto-primario truncate group-hover:text-roxo-neon transition-colors"
              title={jogo.titulo}
            >
              {jogo.titulo}
            </h3>
            <p className="text-xs text-texto-secundario truncate mt-0.5">{jogo.desenvolvedora}</p>
          </div>
          {totalReviews(jogo) != null && totalReviews(jogo) > 0 && (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-fundo-primario border border-verde-acido font-display font-bold text-xs text-verde-acido">
              {totalReviews(jogo)} ★
            </span>
          )}
        </div>

        <Generos generos={jogo.generos} />

        {jogo.descricao && (
          <p className="text-xs text-texto-secundario leading-relaxed line-clamp-2">
            {jogo.descricao}
          </p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-3 pt-1">
          <Info label="Preço" valor={<span className="text-verde-acido font-bold">{formatarPreco(jogo.preco)}</span>} />
          {lancamento && <Info label="Lançamento" valor={lancamento} />}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={parar(() => onEditar?.(jogo))}
            className="px-3 py-1.5 rounded-md text-xs font-semibold border border-borda text-texto-secundario hover:border-roxo-neon hover:text-roxo-neon transition cursor-pointer"
          >
            ✏️ Editar
          </button>
          <button
            onClick={parar(() => onExcluir?.(jogo))}
            disabled={excluindo}
            className="px-3 py-1.5 rounded-md text-xs font-semibold border border-borda text-texto-secundario hover:border-erro hover:text-erro transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {excluindo ? 'Excluindo...' : '🗑️ Excluir'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function MeusJogos({ usuario, onAbrirJogo, onPublicar, onEditarJogo }) {
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)

  // identidade usada no fallback de filtragem (id ou matrícula do usuário)
  const identidade = usuario?.id ?? usuario?.matricula ?? null

  useEffect(() => {
    let cancelado = false
    async function carregar() {
      setCarregando(true)
      try {
        const lista = await getMeusJogos(identidade)
        if (!cancelado) { setJogos(lista); setErro(null) }
      } catch {
        if (!cancelado) setErro('Não foi possível carregar seus jogos.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }
    carregar()
    return () => { cancelado = true }
  }, [identidade])

  async function handleExcluir(jogo) {
    const ok = window.confirm(`Excluir "${jogo.titulo}"? Esta ação não pode ser desfeita.`)
    if (!ok) return
    setExcluindoId(jogo.id)
    setErro(null)
    try {
      await excluirJogo(jogo.id)
      setJogos((atual) => atual.filter((j) => j.id !== jogo.id))
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.erro ?? err?.response?.data?.message
      setErro(msg ?? (status === 401 || status === 403
        ? 'Você não tem permissão para excluir este jogo (faça login novamente).'
        : 'Não foi possível excluir o jogo. Tente novamente.'))
    } finally {
      setExcluindoId(null)
    }
  }

  const total = jogos.length

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">// MINHA CONTA</span>
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-texto-primario">Meus Jogos</h1>
            {!carregando && !erro && (
              <p className="text-texto-secundario text-sm mt-1">
                {total} de {LIMITE_JOGOS} jogo{total !== 1 ? 's' : ''} publicado{total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {total < LIMITE_JOGOS && (
            <button
              onClick={() => onPublicar?.()}
              className="px-5 py-2.5 rounded-lg font-display font-bold text-sm text-white bg-roxo-neon transition hover:bg-verde-acido hover:text-fundo-primario hover:shadow-[0_0_25px_rgba(159,255,61,0.5)] cursor-pointer"
            >
              + Publicar novo jogo
            </button>
          )}
        </div>

        {carregando && <p className="text-center text-texto-secundario py-20">Carregando seus jogos...</p>}
        {erro && <p className="text-center text-erro py-20">{erro}</p>}

        {!carregando && !erro && total === 0 && (
          <div className="text-center py-20">
            <p className="text-texto-secundario text-lg">Você ainda não publicou nenhum jogo.</p>
            <p className="text-texto-secundario text-sm mt-1 mb-6">Crie até {LIMITE_JOGOS} jogos e eles aparecerão aqui.</p>
            <button
              onClick={() => onPublicar?.()}
              className="px-6 py-3 rounded-lg font-display font-bold text-sm text-white bg-roxo-neon transition hover:bg-verde-acido hover:text-fundo-primario cursor-pointer"
            >
              Publicar meu primeiro jogo
            </button>
          </div>
        )}

        {!carregando && !erro && total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jogos.map((jogo) => (
              <CardJogo
                key={jogo.id}
                jogo={jogo}
                onAbrir={onAbrirJogo}
                onEditar={onEditarJogo}
                onExcluir={handleExcluir}
                excluindo={excluindoId === jogo.id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
