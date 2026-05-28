'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { T } from './tokens'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120)
    return () => clearTimeout(t)
  }, [])

  const fadeIn = (delay: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(1.8rem)',
    transition: `all 950ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
  })

  return (
    <section
      style={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 3rem 6.5rem',
        background: `linear-gradient(148deg, ${T.skyDark} 0%, ${T.skyBgMid} 50%, ${T.skyDark} 100%)`,
      }}
    >
      {/* Atmospheric orbs */}
      <div style={{ position: 'absolute', width: 560, height: 560, top: '10%', right: '-8%', borderRadius: '50%', background: `radial-gradient(circle, rgba(114,194,218,0.16) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 360, height: 360, bottom: '8%', left: '-4%', borderRadius: '50%', background: `radial-gradient(circle, rgba(63,160,188,0.18) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 700, height: 700, top: '30%', left: '20%', borderRadius: '50%', background: `radial-gradient(circle, rgba(142,204,226,0.07) 0%, transparent 65%)`, pointerEvents: 'none' }} />

      {/* Grain */}
      <div className="landing-grain" />

      <div className="landing-container" style={{ width: '100%', position: 'relative' }}>
        {/* Eyebrow badge */}
        <div style={fadeIn(100)}>
          <span
            style={{
              display: 'inline-block', borderRadius: 9999,
              padding: '0.25rem 0.85rem',
              border: `1px solid ${T.goldDim}`,
              color: T.gold,
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 500, marginBottom: '1.5rem',
            }}
          >
            Rescate · Adopción · Amor — Liga Vallesana
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            ...fadeIn(220),
            fontFamily: 'var(--font-fraunces), Georgia, serif',
            fontSize: 'clamp(2.3rem, 5.5vw, 5rem)',
            fontWeight: 300, lineHeight: 1.09,
            color: T.textLight,
            marginBottom: '1.75rem', maxWidth: 860,
          }}
        >
          Cada animal merece<br />
          <em style={{ fontStyle: 'italic', color: T.primary }}>un hogar que lo ame</em>
        </h1>

        {/* Sub */}
        <p
          style={{
            ...fadeIn(360),
            fontFamily: 'var(--font-jost), sans-serif',
            fontSize: '0.98rem', lineHeight: 1.78,
            color: T.textMuted, maxWidth: 490, marginBottom: '2.75rem',
          }}
        >
          Somos una ONG de rescate y adopción animal en el Valle de México. Más de 200 animales esperan una familia — uno de ellos podría ser el tuyo.
        </p>

        {/* CTAs */}
        <div style={{ ...fadeIn(480), display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href="/adoptar"
            className="landing-cta-primary"
            style={{ background: T.warmCta, color: T.textLight }}
          >
            Ver animales en adopción
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(240,248,252,0.15)', fontSize: '0.8rem',
              }}
            >
              →
            </span>
          </Link>

          <Link
            href="/donar"
            className="landing-cta-ghost"
            style={{ color: T.textMuted, borderBottom: `1px solid rgba(240,248,252,0.22)` }}
          >
            Quiero donar
          </Link>

          <Link
            href="/eventos"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              borderRadius: 9999, padding: '0.55rem 1.1rem',
              border: `1px solid ${T.goldDim}`,
              color: T.gold,
              fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.8rem', fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 300ms ease',
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%', background: T.gold, flexShrink: 0,
                animation: 'pulseDot 1.8s ease-in-out infinite',
              }}
            />
            Eventos este mes
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="landing-scroll-indicator">
          <div className="landing-scroll-line" />
          <span
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: T.textDim, writingMode: 'vertical-rl',
            }}
          >
            Explorar
          </span>
        </div>
      </div>
    </section>
  )
}
