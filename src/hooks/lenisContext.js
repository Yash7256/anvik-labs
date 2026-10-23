import { createContext, useContext } from 'react'

export const LenisContext = createContext(null)

export function useLenis() {
  const context = useContext(LenisContext)
  if (!context) {
    throw new Error('useLenis must be used inside a LenisProvider')
  }
  return context
}
