import { useState } from 'react'

export function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <section aria-labelledby="subscribe-title" style={{ padding: 'clamp(48px, 8vw, 88px) var(--nd-gutter)', borderTop: '1px solid var(--cv-border)' }}>
      <div className="nd-container" style={{ maxWidth: 760, textAlign: 'center' }}>
        <h2 id="subscribe-title" className="nd-section-title">Ideas for better <em>digital products.</em></h2>
        <p className="nd-section-desc">Get occasional notes on product design, development, and the work behind both.</p>
        {subscribed ? (
          <p role="status" style={{ color: 'var(--cv-accent)', fontWeight: 600 }}>Thanks for subscribing.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '28px auto 0' }}>
            <label htmlFor="subscribe-email" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Email address</label>
            <input id="subscribe-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" style={{ flex: 1, minWidth: 0, padding: '12px 16px', borderRadius: 999, border: '1px solid var(--cv-border)', background: 'var(--cv-surface)', color: 'var(--cv-text)' }} />
            <button type="submit" className="cv-btn-primary">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  )
}
