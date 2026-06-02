import { useMemo } from 'react'
import GameSection from './GameSection'
import { agruparPorGenero } from '../../utils/classificarJogos'

/**
 * JogosPorGenero — recebe uma lista de jogos e renderiza uma seção
 * (faixa horizontal) para cada gênero, agrupando automaticamente.
 *
 * Props:
 *   - jogos: array de jogos
 */
function JogosPorGenero({ jogos = [], onAbrirJogo }) {
  const grupos = useMemo(() => agruparPorGenero(jogos), [jogos])

  // ordena os gêneros: os com mais jogos primeiro
  const generosOrdenados = useMemo(
    () =>
      Object.entries(grupos).sort((a, b) => b[1].length - a[1].length),
    [grupos]
  )

  if (jogos.length === 0) {
    return (
      <p className="text-center text-texto-secundario py-20">
        Nenhum jogo para exibir.
      </p>
    )
  }

  return (
    <>
      {generosOrdenados.map(([nomeGenero, jogosDoGenero]) => (
        <GameSection
          key={nomeGenero}
          titulo={`${nomeGenero} · ${jogosDoGenero.length}`}
          jogos={jogosDoGenero}
          onAbrirJogo={onAbrirJogo}
        />
      ))}
    </>
  )
}

export default JogosPorGenero
