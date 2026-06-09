import { useState } from 'react'
import { criarJogo, atualizarJogo } from '../services/jogosService'
import { useGeneros } from '../hooks/useGeneros'

const ESTADO_INICIAL = { titulo: '', descricao: '', desenvolvedora: '', preco: '', capaUrl: '', lancamento: '', generosIds: [] }

const INPUT = 'w-full px-4 py-2.5 rounded-lg bg-fundo-secundario border border-borda text-texto-primario placeholder:text-texto-secundario outline-none transition focus:border-roxo-neon focus:shadow-[0_0_0_3px_rgba(176,38,255,0.2)]'
const LABEL = 'block mb-1.5 text-sm font-display font-semibold text-texto-primario'

function Campo({ label, children }) {
  return <div><label className={LABEL}>{label}</label>{children}</div>
}

function Alerta({ tipo, children }) {
  const cores = tipo === 'sucesso'
    ? 'bg-verde-acido/10 border-verde-acido text-verde-acido'
    : 'bg-erro/10 border-erro text-erro'
  return <div className={`mb-6 px-4 py-3 rounded-lg border text-sm ${cores}`}>{children}</div>
}

function SeletorGeneros({ generos, carregando, selecionados, onToggle }) {
  if (carregando) return <p className="text-sm text-texto-secundario">Carregando gêneros...</p>
  return (
    <div className="flex flex-wrap gap-2">
      {generos.map((g) => (
        <button type="button" key={g.id} onClick={() => onToggle(g.id)}
          className={`px-3 py-1.5 rounded-full text-sm border transition cursor-pointer ${selecionados.includes(g.id) ? 'bg-roxo-neon border-roxo-neon text-white' : 'bg-fundo-secundario border-borda text-texto-secundario hover:border-roxo-neon'}`}>
          {g.nome}
        </button>
      ))}
    </div>
  )
}

// Converte um jogo (vindo da API) no formato do formulário.
function jogoParaForm(jogo) {
  if (!jogo) return ESTADO_INICIAL
  const dataISO = jogo.lancamento ? new Date(jogo.lancamento) : null
  const dataInput = dataISO && !Number.isNaN(dataISO.getTime())
    ? dataISO.toISOString().slice(0, 10)
    : ''
  return {
    titulo: jogo.titulo ?? '',
    descricao: jogo.descricao ?? '',
    desenvolvedora: jogo.desenvolvedora ?? '',
    preco: jogo.preco != null ? String(jogo.preco) : '',
    capaUrl: jogo.capaUrl ?? '',
    lancamento: dataInput,
    generosIds: Array.isArray(jogo.generos)
      ? jogo.generos.map((g) => g.id ?? g).filter((id) => id != null)
      : [],
  }
}

function useForm(inicial = ESTADO_INICIAL) {
  const [form, setForm] = useState(inicial)
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))
  const alternarGenero = (id) => setForm((f) => ({
    ...f,
    generosIds: f.generosIds.includes(id) ? f.generosIds.filter((g) => g !== id) : [...f.generosIds, id],
  }))
  const resetar = () => setForm(inicial)
  return { form, atualizar, alternarGenero, resetar }
}

function validar(form) {
  if (!form.titulo.trim()) return 'Informe o título do jogo.'
  if (!form.desenvolvedora.trim()) return 'Informe a desenvolvedora.'
  if (form.preco === '' || Number(form.preco) < 0) return 'Informe um preço válido (use 0 para grátis).'
  if (!form.lancamento) return 'Informe a data de lançamento.'
  return null
}

export default function CriarJogo({ onCriado, jogoParaEditar = null, onCancelar }) {
  const editando = !!jogoParaEditar
  const { generos, carregando: carregandoGeneros } = useGeneros()
  const { form, atualizar, alternarGenero, resetar } = useForm(
    editando ? jogoParaForm(jogoParaEditar) : ESTADO_INICIAL
  )
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  async function aoSubmeter(e) {
    e.preventDefault()
    setErro(null); setSucesso(false)
    const erroValidacao = validar(form)
    if (erroValidacao) return setErro(erroValidacao)

    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      desenvolvedora: form.desenvolvedora.trim(),
      preco: Number(form.preco),
      capaUrl: form.capaUrl.trim() || null,
      lancamento: new Date(form.lancamento + 'T00:00:00Z').toISOString(),
      generoIds: form.generosIds,
    }

    try {
      setEnviando(true)
      if (editando) {
        const atualizado = await atualizarJogo(jogoParaEditar.id, payload)
        setSucesso(true)
        onCriado?.(atualizado)
      } else {
        const criado = await criarJogo(payload)
        setSucesso(true); resetar()
        onCriado?.(criado)
      }
    } catch (err) {
      const dados = err?.response?.data
      const status = err?.response?.status
      const msg = dados?.erro ?? dados?.message ?? dados?.error ?? (typeof dados === 'string' ? dados : null)
      setErro(status === 401 || status === 403 ? msg ?? 'Sessão expirada ou não autenticado. Faça login novamente para publicar.' : msg ? `Erro: ${msg}` : `Erro ${status ?? '?'}. Veja o Console.`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">{editando ? '// EDITAR' : '// PUBLICAR'}</span>
      <h1 className="font-display text-3xl font-bold text-texto-primario mb-1">{editando ? 'Editar jogo' : 'Adicionar jogo'}</h1>
      <p className="text-sm text-texto-secundario mb-8">{editando ? 'Altere os dados do seu jogo e salve.' : 'Preencha os dados do seu jogo. Limite de 3 jogos por usuário.'}</p>

      {sucesso && <Alerta tipo="sucesso">{editando ? '✓ Jogo atualizado com sucesso!' : '✓ Jogo criado com sucesso!'}</Alerta>}
      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <form onSubmit={aoSubmeter} className="flex flex-col gap-5">
        <Campo label="Título *">
          <input className={INPUT} value={form.titulo} onChange={(e) => atualizar('titulo', e.target.value)} placeholder="Ex.: Neon Drift 2077" maxLength={120} />
        </Campo>

        <Campo label="Descrição">
          <textarea className={`${INPUT} resize-y min-h-[110px]`} value={form.descricao} onChange={(e) => atualizar('descricao', e.target.value)} placeholder="Conte sobre o jogo..." maxLength={2000} />
        </Campo>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Campo label="Desenvolvedora *">
            <input className={INPUT} value={form.desenvolvedora} onChange={(e) => atualizar('desenvolvedora', e.target.value)} placeholder="Ex.: Studio Vapor" />
          </Campo>
          <Campo label="Preço (R$) *">
            <input type="number" step="0.01" min="0" className={INPUT} value={form.preco} onChange={(e) => atualizar('preco', e.target.value)} placeholder="0.00" />
          </Campo>
        </div>

        <Campo label="URL da capa">
          <input className={INPUT} value={form.capaUrl} onChange={(e) => atualizar('capaUrl', e.target.value)} placeholder="https://..." />
        </Campo>

        <Campo label="Data de lançamento *">
          <input type="date" className={INPUT} value={form.lancamento} onChange={(e) => atualizar('lancamento', e.target.value)} />
        </Campo>

        <Campo label="Gêneros (opcional)">
          <SeletorGeneros generos={generos} carregando={carregandoGeneros} selecionados={form.generosIds} onToggle={alternarGenero} />
        </Campo>

        <div className="mt-2 flex items-center gap-3">
          <button type="submit" disabled={enviando}
            className="px-7 py-3 rounded-lg font-display font-bold uppercase tracking-wider text-sm text-white bg-roxo-neon transition hover:bg-verde-acido hover:text-fundo-primario hover:shadow-[0_0_25px_rgba(159,255,61,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {enviando
              ? (editando ? 'Salvando...' : 'Publicando...')
              : (editando ? 'Salvar alterações' : 'Publicar jogo')}
          </button>
          {(editando || onCancelar) && (
            <button type="button" onClick={() => onCancelar?.()}
              className="px-6 py-3 rounded-lg font-display font-semibold text-sm text-texto-secundario border border-borda hover:border-roxo-neon hover:text-texto-primario transition cursor-pointer">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}