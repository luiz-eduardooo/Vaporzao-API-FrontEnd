/**
 * SeletorGeneros — chips selecionáveis de gênero.
 *
 * Props:
 *   - generos: [{ id, nome }]
 *   - selecionados: number[] (ids)
 *   - onAlternar: (id) => void
 *   - carregando: boolean
 */
function SeletorGeneros({ generos = [], selecionados = [], onAlternar, carregando }) {
  if (carregando) {
    return <p className="text-sm text-texto-secundario">Carregando gêneros...</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {generos.map((g) => {
        const ativo = selecionados.includes(g.id)
        return (
          <button
            type="button"
            key={g.id}
            onClick={() => onAlternar(g.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition cursor-pointer ${
              ativo
                ? 'bg-roxo-neon border-roxo-neon text-white'
                : 'bg-fundo-secundario border-borda text-texto-secundario hover:border-roxo-neon'
            }`}
          >
            {g.nome}
          </button>
        )
      })}
    </div>
  )
}

export default SeletorGeneros
