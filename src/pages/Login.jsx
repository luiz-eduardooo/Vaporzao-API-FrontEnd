import { useState } from 'react'
import { useAuth } from '../context/authShared'

const INPUT = 'w-full px-4 py-2.5 rounded-lg bg-fundo-secundario border border-borda text-texto-primario placeholder:text-texto-secundario outline-none transition focus:border-roxo-neon focus:shadow-[0_0_0_3px_rgba(176,38,255,0.2)]'
const LABEL = 'block mb-1.5 text-sm font-display font-semibold text-texto-primario'

export default function Login({ onLogado }) {
  const { entrar, primeiroAcesso } = useAuth()
  const [modo, setModo] = useState('login') // 'login' | 'primeiro-acesso'
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  const ehPrimeiroAcesso = modo === 'primeiro-acesso'

  function mensagemDeErro(err) {
    const status = err?.response?.status
    const dados = err?.response?.data
    const msgApi =
      dados?.erro ?? dados?.message ?? dados?.error ?? dados?.mensagem ??
      (typeof dados === 'string' ? dados : null)
    if (msgApi) return msgApi
    if (status === 401 || status === 403) return 'Matrícula ou senha incorretos.'
    if (status === 404) return 'Matrícula não encontrada.'
    if (!err?.response) return 'Não foi possível conectar à API. Verifique sua conexão.'
    return 'Não foi possível entrar. Tente novamente.'
  }

  async function aoSubmeter(e) {
    e.preventDefault()
    setErro(null)

    if (!matricula.trim()) return setErro('Informe sua matrícula.')
    if (!senha) return setErro('Informe sua senha.')

    try {
      setEnviando(true)
      const credenciais = { matricula: matricula.trim(), senha }
      if (ehPrimeiroAcesso) {
        await primeiroAcesso(credenciais)
      } else {
        await entrar(credenciais)
      }
      onLogado?.()
    } catch (err) {
      setErro(mensagemDeErro(err))
    } finally {
      setEnviando(false)
    }
  }

  function alternarModo() {
    setModo((m) => (m === 'login' ? 'primeiro-acesso' : 'login'))
    setErro(null)
  }

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF] grid place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1 text-center">// ACESSO</span>
        <h1 className="font-display text-3xl font-bold text-texto-primario mb-1 text-center">
          {ehPrimeiroAcesso ? 'Primeiro acesso' : 'Entrar'}
        </h1>
        <p className="text-sm text-texto-secundario mb-8 text-center">
          {ehPrimeiroAcesso
            ? 'Defina sua senha usando sua matrícula para começar.'
            : 'Use sua matrícula e senha para acessar o Vaporzão.'}
        </p>

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
            <label className={LABEL}>{ehPrimeiroAcesso ? 'Crie sua senha' : 'Senha'}</label>
            <input
              type="password"
              className={INPUT}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete={ehPrimeiroAcesso ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 px-7 py-3 rounded-lg font-display font-bold uppercase tracking-wider text-sm text-white bg-roxo-neon transition hover:bg-verde-acido hover:text-fundo-primario hover:shadow-[0_0_25px_rgba(159,255,61,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {enviando
              ? (ehPrimeiroAcesso ? 'Registrando...' : 'Entrando...')
              : (ehPrimeiroAcesso ? 'Registrar acesso' : 'Entrar')}
          </button>
        </form>

        <p className="text-center text-sm text-texto-secundario mt-6">
          {ehPrimeiroAcesso ? 'Já tem acesso?' : 'É seu primeiro acesso?'}{' '}
          <button
            type="button"
            onClick={alternarModo}
            className="text-roxo-neon font-semibold hover:text-verde-acido transition cursor-pointer"
          >
            {ehPrimeiroAcesso ? 'Entrar' : 'Primeiro acesso'}
          </button>
        </p>
      </div>
    </main>
  )
}
