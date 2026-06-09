import { useState, useCallback } from 'react'
import { AuthContext } from './authShared'
import * as authService from '../services/authService'

/**
 * AuthProvider — guarda o estado de autenticação (usuário logado + token).
 * O token em si fica no localStorage (lido pelo interceptor em api.js);
 * aqui guardamos o objeto do usuário e expomos login/logout.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.getUsuarioSalvo())

  const logado = !!usuario && authService.estaLogado()

  const entrar = useCallback(async (credenciais) => {
    const u = await authService.login(credenciais)
    setUsuario(u)
    return u
  }, [])

  const primeiroAcesso = useCallback(async (credenciais) => {
    const u = await authService.primeiroAcesso(credenciais)
    setUsuario(u)
    return u
  }, [])

  const sair = useCallback(() => {
    authService.logout()
    setUsuario(null)
  }, [])

  const valor = { usuario, logado, entrar, primeiroAcesso, sair }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
