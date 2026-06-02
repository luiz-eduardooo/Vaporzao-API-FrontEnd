import { createContext, useContext } from 'react'

export const WishlistContext = createContext(null)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist precisa estar dentro de <WishlistProvider>')
  return ctx
}
