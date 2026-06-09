import { createContext, useContext } from 'react'

export const BibliotecaContext = createContext(null)

export function useBiblioteca() {
  const ctx = useContext(BibliotecaContext)
  if (!ctx) throw new Error('useBiblioteca precisa estar dentro de <BibliotecaProvider>')
  return ctx
}
