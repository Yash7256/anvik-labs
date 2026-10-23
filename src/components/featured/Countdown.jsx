import { useCountdown } from '@/hooks/useCountdown'

const pad = (value) => String(value).padStart(2, '0')

export function Countdown() {
  const { days, hours, minutes, seconds, isLive, longDate, dateLabel } =
    useCountdown()

  return (
    <div className="featured__launch">
      <p className="featured__date-pill" data-featured-reveal>
        <span className="featured__date-dot" aria-hidden="true" />
        {dateLabel}
      </p>

      <div className="featured__countdown" aria-live="off">
        <span className="sr-only">
          {isLive ? 'Launched' : 'Launches'} {longDate}
        </span>

        {isLive ? (
          <p className="featured__live">
            <span className="featured__live-dot" aria-hidden="true" />
            Now live
          </p>
        ) : (
          <div className="featured__countdown-main" aria-hidden="true">
            <div className="featured__days">
              <span className="featured__days-number">
                {pad(days)
                  .split('')
                  .map((digit, index) => (
                    <span className="featured__digit-mask" key={index}>
                      <span
                        className="featured__digit"
                        data-countdown-roll
                        data-featured-reveal
                      >
                        {digit}
                      </span>
                    </span>
                  ))}
              </span>
              <span className="featured__days-label" data-featured-reveal>
                Days to launch
              </span>
              <span
                className="featured__days-underline"
                data-featured-reveal
                aria-hidden="true"
              />
            </div>

            <div className="featured__units">
              <div className="featured__unit" data-featured-reveal>
                <span
                  className="featured__unit-value"
                  data-countdown-roll
                  data-featured-reveal
                >
                  {pad(hours)}
                </span>
                <span className="featured__unit-label">HRS</span>
              </div>
              <div className="featured__unit" data-featured-reveal>
                <span
                  className="featured__unit-value"
                  data-countdown-roll
                  data-featured-reveal
                >
                  {pad(minutes)}
                </span>
                <span className="featured__unit-label">MIN</span>
              </div>
              <div className="featured__unit" data-featured-reveal>
                <span
                  className="featured__unit-value"
                  data-countdown-roll
                  data-featured-reveal
                >
                  {pad(seconds)}
                </span>
                <span className="featured__unit-label">SEC</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
