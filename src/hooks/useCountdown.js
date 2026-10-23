import { useEffect, useMemo, useState } from 'react'

const DEFAULT_LAUNCH_DATE = '2026-11-08T00:00:00+05:30'
const SECOND_MS = 1_000
const DAY_SECONDS = 86_400
const HOUR_SECONDS = 3_600
const MINUTE_SECONDS = 60

const SHORT_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

const LONG_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

function resolveLaunchDate() {
  const configured = import.meta.env.VITE_LAUNCH_DATE || DEFAULT_LAUNCH_DATE
  const parsed = new Date(configured)

  if (Number.isNaN(parsed.getTime())) return new Date(DEFAULT_LAUNCH_DATE)
  return parsed
}

function getRemaining(target) {
  const remainingSeconds = Math.max(
    0,
    Math.ceil((target.getTime() - Date.now()) / SECOND_MS),
  )

  return {
    days: Math.floor(remainingSeconds / DAY_SECONDS),
    hours: Math.floor((remainingSeconds % DAY_SECONDS) / HOUR_SECONDS),
    minutes: Math.floor((remainingSeconds % HOUR_SECONDS) / MINUTE_SECONDS),
    seconds: remainingSeconds % MINUTE_SECONDS,
    isLive: remainingSeconds === 0,
  }
}

function isSameValue(current, next) {
  return (
    current.days === next.days &&
    current.hours === next.hours &&
    current.minutes === next.minutes &&
    current.seconds === next.seconds &&
    current.isLive === next.isLive
  )
}

const EMPTY_REMAINING = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isLive: false,
}

export function useCountdown() {
  const target = useMemo(() => resolveLaunchDate(), [])
  const [value, setValue] = useState(EMPTY_REMAINING)

  useEffect(() => {
    const tick = () => {
      const next = getRemaining(target)
      setValue((current) => (isSameValue(current, next) ? current : next))
    }

    tick()

    let interval

    const align = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, 1_000)
    }, 1_000 - (Date.now() % 1_000))

    const onVisibility = () => {
      if (!document.hidden) tick()
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearTimeout(align)
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [target])

  const shortDate = SHORT_DATE.format(target)
  const longDate = LONG_DATE.format(target)

  return {
    ...value,
    target,
    shortDate,
    longDate,
    dateLabel: `${value.isLive ? 'Launched' : 'Launches'} ${shortDate}`,
    linkLabel: value.isLive ? 'Open Designers Room' : 'Explore Designers Room',
  }
}
