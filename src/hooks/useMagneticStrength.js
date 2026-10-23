import { useEffect, useState } from 'react'

export function useMagneticStrength(max = 10) {
  const [strength, setStrength] = useState(() => {
    if (typeof window === 'undefined') return 0
    return window.matchMedia('(min-width: 768px)').matches ? max : 0
  })

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => setStrength(media.matches ? max : 0)

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [max])

  return strength
}
