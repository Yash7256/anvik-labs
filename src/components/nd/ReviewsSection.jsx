import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const TESTIMONIALS = [
  {
    quote: "Conversion transformed our business overnight. From stale organic growth to explosive growth with Google Ads and it's scaling everyday.",
    name: "Jonathan Day",
    role: "Co-founder of Monday",
    avatar: "https://framerusercontent.com/images/RnlZlUp5GcLVlfS43Q4nd6kA9c.jpg?scale-down-to=512",
  },
  {
    quote: "We never realised the power of paid advertising until we found Conversion. It's doubled our revenue in just a few months, absolutely incredible.",
    name: "Melissa Reid",
    role: "Founder of Tuesday",
    avatar: "https://framerusercontent.com/images/5P0eN6qtSxQg8Lrk6rw2GR9e7eI.jpg?width=3744&height=5616",
  },
  {
    quote: "Conversion turned our marketing game around! With their paid advertising strategies, we saw a remarkable boost in sales that we never thought possible.",
    name: "Chris Wright",
    role: "CEO of Wednesday",
    avatar: "https://framerusercontent.com/images/G1bC6MQnKLl8c7ZyjwpJlVGuw.jpg?width=3023&height=3023",
  },
  {
    quote: "Before discovering Conversion, we were hesitant about investing in paid advertising, but the team proved us wrong with their incredible results.",
    name: "Terri Williams",
    role: "Founder of Thursday",
    avatar: "https://framerusercontent.com/images/oUkBi1c8nERocfQrJWNLxZ9Fipw.jpg?width=3974&height=5000",
  },
  {
    quote: "Conversion exceeded our expectations! Their approach to paid advertising is unparalleled, resulting in a substantial growth in our revenue stream.",
    name: "Belinda Meyers",
    role: "COO of Friday",
    avatar: "https://framerusercontent.com/images/kIBiy2xM79Ac692vRBBeMc3YFw8.jpg?width=5184&height=3456",
  },
  {
    quote: "Thanks to Conversion, our business experienced a remarkable turnaround. Their expertise in paid advertising tripled our revenue in record time.",
    name: "Sarah Yanna",
    role: "Director of Saturday",
    avatar: "https://framerusercontent.com/images/X69CSaL5GOIA9ZgjxkdlXWjG7w.jpg?width=4000&height=2667",
  },
]

export function ReviewsSection() {
  const rootRef = useRef(null)

  useGSAP(() => {
    // Header stagger
    const header = rootRef.current?.querySelector('.nd-section-header')
    if (header) {
      gsap.fromTo(
        [...header.children],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: header, start: 'top 85%' },
        },
      )
    }

    // Cards + stars
    const cards = rootRef.current?.querySelectorAll('.nd-testimonial-card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )

      const stars = card.querySelector('.nd-testimonial-card__stars')
      if (stars) {
        gsap.fromTo(
          stars,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            delay: i * 0.08 + 0.2,
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          },
        )
      }
    })
  }, { scope: rootRef })

  return (
    <section id="reviews" className="nd-testimonials" ref={rootRef}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Testimonials</span>
          </div>
          <h2 className="nd-section-title">
            There's a reason people are <em>raving</em> about us.
          </h2>
          <p className="nd-section-desc">
            Hear what our clients have to say. Our testimonials reflect the satisfaction our clients have in our services.
          </p>
        </div>

        <div className="nd-testimonials__grid">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="nd-testimonial-card">
              <div className="nd-testimonial-card__stars">★★★★★</div>
              <p className="nd-testimonial-card__quote">"{t.quote}"</p>
              <div className="nd-testimonial-card__author">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="nd-testimonial-card__avatar"
                />
                <div>
                  <div className="nd-testimonial-card__name">{t.name}</div>
                  <div className="nd-testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
