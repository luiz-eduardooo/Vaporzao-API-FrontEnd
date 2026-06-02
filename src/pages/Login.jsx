import { useState } from 'react'
import { useAuth } from '../context/authShared'

const INPUT = 'w-full px-4 py-2.5 rounded-lg bg-fundo-secundario border border-borda text-texto-primario placeholder:text-texto-secundario outline-none transition focus:border-roxo-neon focus:shadow-[0_0_0_3px_rgba(176,38,255,0.2)]'
const LABEL = 'block mb-1.5 text-sm font-display font-semibold text-texto-primario'

export default function Login({ onLogado }) {
  const { entrar } = useAuth()
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function aoSubmeter(e) {
    e.preventDefault()
    setErro(null)

    try {
      setEnviando(true)
      await entrar({ matricula: matricula.trim(), senha })
      onLogado?.()
    } catch (err) {
      setErro(err?.message ?? 'Não foi possível entrar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF] grid place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1 text-center">// ACESSO</span>
        <h1 className="font-display text-3xl font-bold text-texto-primario mb-1 text-center">Entrar</h1>
        <p className="text-sm text-texto-secundario mb-8 text-center">Use sua matrícula e senha para acessar o Vaporzão.</p>

        {erro && (
          <div className="mb-6 px-4 py-3 rounded-lg border text-sm bg-erro/10 border-erro text-erro">
            {erro}
          </div>
        )}

        <form onSubmit={aoSubmeter} className="flex flex-col gap-5">
          <div>
            <label className={LABEL}>Matrícula</label>
            <input
              className={INPUT}
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ex.: 2024001"
              autoComplete="username"
            />
          </div>

          <div>
            <label className={LABEL}>Senha</label>
            <input
              type="password"
              className={INPUT}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 px-7 py-3 rounded-lg font-display font-bold uppercase tracking-wider text-sm text-white bg-roxo-neon transition hover:bg-verde-acido hover:text-fundo-primario hover:shadow-[0_0_25px_rgba(159,255,61,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
