import { useCallback, useRef, useState } from 'react'

export function useHoverLink() {
  const [active, setActive] = useState(null)
  const sources = useRef(new Map())

  const enter = useCallback((id, source = 'default') => {
    if (!id) return
    const tokens = sources.current.get(id) || new Set()
    tokens.add(source)
    sources.current.set(id, tokens)
    setActive(id)
  }, [])

  const leave = useCallback((id, source = 'default') => {
    if (!id) return
    const tokens = sources.current.get(id)
    if (!tokens) return

    tokens.delete(source)
    if (tokens.size > 0) return

    sources.current.delete(id)
    setActive((current) => (current === id ? null : current))
  }, [])

  const clear = useCallback(() => {
    sources.current.clear()
    setActive(null)
  }, [])

  return { active, enter, leave, clear }
}
