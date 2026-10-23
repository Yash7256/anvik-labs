import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function useIstClock(updateIntervalMs = 30000) {
  const [time, setTime] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()))
    update()
    const id = setInterval(update, updateIntervalMs)
    return () => clearInterval(id)
  }, [updateIntervalMs])

  return time
}
