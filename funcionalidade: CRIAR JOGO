import Campo from '../components/ui/Campo'
import Alerta from '../components/ui/Alerta'
import SeletorGeneros from '../components/ui/SeletorGeneros'
import { useGeneros } from '../hooks/useGeneros'
import { useFormularioJogo } from '../hooks/useFormularioJogo'

function CriarJogo({ onCriado }) {
  const { generos, carregando: carregandoGeneros } = useGeneros()
  const { form, enviando, erro, sucesso, atualizar, alternarGenero, enviar } =
    useFormularioJogo(onCriado)

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">
        // PUBLICAR
      </span>
      <h1 className="font-display text-3xl font-bold text-texto-primario mb-1">
        Adicionar jogo
      </h1>
      <p className="text-sm text-texto-secundario mb-8">
        Preencha os dados do seu jogo. Limite de 3 jogos por usuário.
      </p>

      <Alerta tipo="sucesso">{sucesso && '✓ Jogo criado com sucesso!'}</Alerta>
      <Alerta tipo="erro">{erro}</Alerta>

      <form onSubmit={enviar} className="flex flex-col gap-5">
        <Campo
          label="Título"
          obrigatorio
          value={form.titulo}
          onChange={(v) => atualizar('titulo', v)}
          placeholder="Ex.: Neon Drift 2077"
          maxLength={120}
        />

        <Campo
          label="Descrição"
          textarea
          value={form.descricao}
          onChange={(v) => atualizar('descricao', v)}
          placeholder="Conte sobre o jogo, mecânicas, história..."
          maxLength={2000}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Campo
            label="Desenvolvedora"
            obrigatorio
            value={form.desenvolvedora}
            onChange={(v) => atualizar('desenvolvedora', v)}
            placeholder="Ex.: Studio Vapor"
          />
          <Campo
            label="Preço (R$)"
            obrigatorio
            type="number"
            step="0.01"
            min="0"
            value={form.preco}
            onChange={(v) => atualizar('preco', v)}
            placeholder="0.00 (use 0 para grátis)"
          />
        </div>

        <Campo
          label="URL da capa"
          value={form.capaUrl}
          onChange={(v) => atualizar('capaUrl', v)}
          placeholder="https://..."
        />

        <Campo
          label="Data de lançamento"
          obrigatorio
          type="date"
          value={form.lancamento}
          onChange={(v) => atualizar('lancamento', v)}
        />

        <div>
          <label className="block mb-1.5 text-sm font-display font-semibold text-texto-primario">
            Gêneros (opcional)
          </label>
          <SeletorGeneros
            generos={generos}
            selecionados={form.generosIds}
            onAlternar={alternarGenero}
            carregando={carregandoGeneros}
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 self-start px-7 py-3 rounded-lg font-display font-bold
                     uppercase tracking-wider text-sm text-white bg-roxo-neon
                     transition hover:bg-verde-acido hover:text-fundo-primario
                     hover:shadow-[0_0_25px_rgba(159,255,61,0.5)]
                     disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {enviando ? 'Publicando...' : 'Publicar jogo'}
        </button>
      </form>
    </div>
  )
}

export default CriarJogo
