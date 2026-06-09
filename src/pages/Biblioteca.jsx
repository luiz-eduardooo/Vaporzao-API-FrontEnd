import GameCover from '../components/game/GameCover'
import { idDoJogo } from '../utils/classificarJogos'
import { useBiblioteca } from '../context/bibliotecaShared'

function formatarHoras(jogo) {
  const h = jogo.horasJogadas ?? jogo.horas ?? jogo.tempoJogado
  if (h == null) return null
  const num = Number(h)
  if (Number.isNaN(num)) return null
  return `${num.toLocaleString('pt-BR')} h jogadas`
}

function ItemBiblioteca({ jogo, onAbrir }) {
  const horas = formatarHoras(jogo)
  return (
    <article
      onClick={() => onAbrir?.(idDoJogo(jogo))}
      className="group flex gap-4 p-3 rounded-lg bg-fundo-secundario border border-borda cursor-pointer transition-all duration-200 hover:border-roxo-neon"
    >
      <div className="w-[80px] aspect-2/3 shrink-0 rounded-md overflow-hidden">
        <GameCover url={jogo.capaUrl} titulo={jogo.titulo} />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h3 className="font-display font-semibold text-sm text-texto-primario truncate group-hover:text-roxo-neon transition-colors" title={jogo.titulo}>
          {jogo.titulo}
        </h3>
        <p className="text-xs text-texto-secundario truncate mt-0.5">{jogo.desenvolvedora}</p>
        {horas
          ? <span className="text-[11px] font-mono text-verde-acido mt-2">{horas}</span>
          : <span className="text-[11px] font-mono text-texto-secundario mt-2">Nunca jogado</span>
        }
      </div>
    </article>
  )
}

export default function Biblioteca({ onAbrirJogo }) {
  const { itens: jogos } = useBiblioteca()

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">// MINHA CONTA</span>
        <h1 className="font-display text-2xl font-bold text-texto-primario mb-6">Biblioteca</h1>

        {jogos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-texto-secundario text-lg">Sua biblioteca está vazia.</p>
            <p className="text-texto-secundario text-sm mt-1">Os jogos que você adicionar aparecerão aqui.</p>
          </div>
        )}

        {jogos.length > 0 && (
          <>
            <p className="text-texto-secundario text-sm mb-6">
              {jogos.length} jogo{jogos.length !== 1 ? 's' : ''} na biblioteca
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogos.map((jogo) => (
                <ItemBiblioteca key={jogo.id} jogo={jogo} onAbrir={onAbrirJogo} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
