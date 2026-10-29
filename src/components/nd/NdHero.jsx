import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { HeroSplineBg } from './HeroSplineBg'
import { HERO_CONFIG } from '@/data/heroData'

export function NdHero() {
  const rootRef = useRef(null)
  const {
    socialProof,
    headline,
    subheadline,
    ctas,
    trustedLogos,
  } = HERO_CONFIG

  // Subtle load-in animation (fade up, 400–600ms, staggered)
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        rootRef.current?.querySelectorAll('[data-hero-reveal]'),
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          delay: 0.05,
        },
      )

    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="nd-hero-section" aria-label="Hero">
      <div className="nd-hero__visual-backdrop" aria-hidden="true">
        <HeroSplineBg />
      </div>
      <div className="nd-container">
        <div className="nd-hero__grid">
          <div className="nd-hero__content">
            {/* Eyebrow & Social Proof Badge */}
            <div data-hero-reveal className="nd-hero__badge-wrap">
              <div className="nd-hero__badge" role="region" aria-label="Studio overview">
                {socialProof.avatars && socialProof.avatars.length > 0 && (
                  <div className="nd-hero__avatar-stack" aria-hidden="true">
                    {socialProof.avatars.map((av, idx) => (
                      <img
                        key={idx}
                        src={av.src}
                        alt=""
                        className="nd-hero__avatar-item"
                        width="30"
                        height="30"
                        loading="eager"
                      />
                    ))}
                  </div>
                )}
                <span className="nd-hero__badge-text">{socialProof.text}</span>
              </div>
            </div>

            <h1 data-hero-reveal className="nd-hero__headline">
              {headline}
            </h1>

            {/* Subheadline (Max width ~560px, color contrast >= 4.5:1) */}
            <p data-hero-reveal className="nd-hero__subheadline">
              {subheadline}
            </p>

            {/* Primary & Secondary CTA Buttons */}
            <div data-hero-reveal className="nd-hero__cta-group">
              <MagneticButton
                href={ctas.primary.href}
                className="cv-btn-primary nd-hero__btn-primary"
                strength={10}
                aria-label={ctas.primary.ariaLabel}
              >
                <span>{ctas.primary.label}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="nd-hero__btn-icon"
                >
                  <path
                    d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </MagneticButton>

              <MagneticButton
                href={ctas.secondary.href}
                className="cv-btn-secondary nd-hero__btn-secondary"
                strength={8}
                aria-label={ctas.secondary.ariaLabel}
              >
                <span>{ctas.secondary.label}</span>
              </MagneticButton>
            </div>

          </div>
        </div>

        {/* Social Proof: Trusted by teams logo row
        {trustedLogos && trustedLogos.length > 0 && (
          // <div data-hero-reveal className="nd-hero__trusted-row" aria-label="Trusted by teams">
          //   <p className="nd-hero__trusted-label">Trusted by founders and growing teams</p>
          //   <div className="nd-hero__trusted-logos">
          //     {trustedLogos.map((logo) => (
          //       <div key={logo.name} className="nd-hero__trusted-item" title={logo.name}>
          //         <img
          //           src={logo.src}
          //           alt={logo.alt || `${logo.name} logo`}
          //           className="nd-hero__trusted-img"
          //           loading="lazy"
          //         />
          //       </div>
          //     ))}
          //   </div>
          // </div>
        )} */}
      </div>
    </section>
  )
}
