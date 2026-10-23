import { useEffect, useState } from 'react'

const IST_TIME = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const formatIST = (date) => `${IST_TIME.format(date)} IST`

export function StudioMeta() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="hero-micro">
      <span className="hero-micro__est">Est. 2026</span>
      <time className="hero-micro__time" dateTime={now.toISOString()}>
        {formatIST(now)}
      </time>
      <span className="hero-micro__status">
        <span className="hero-micro__dot" aria-hidden="true" />
        Available for freelance
      </span>
    </div>
  )
}
