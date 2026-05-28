'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { T } from './tokens'

export function DonacionesCTA() {
  const [ref, inView] = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="landing-section"
      style={{
        background: `linear-gradient(120deg, ${T.skyNavy} 0%, ${T.skyDark} 100%)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle orb */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,194,218,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div
        className="landing-container"
        style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '3rem', flexWrap: 'wrap',
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(2rem)',
          transition: 'all 800ms cubic-bezier(0.32,0.72,0,1)',
          position: 'relative',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: T.textMuted, fontWeight: 500, display: 'block', marginBottom: '0.75rem',
            }}
          >
            Apoya nuestra misión
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 300, color: T.textLight, lineHeight: 1.2,
            }}
          >
            Tu apoyo salva vidas.<br />
            <em style={{ fontStyle: 'italic', color: T.primary }}>Hoy mismo.</em>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', flexShrink: 0 }}>
          <Link
            href="/donar"
            style={{
              display: 'inline-flex', alignItems: 'center',
              borderRadius: 9999, padding: '0.85rem 1.75rem',
              background: T.textLight, color: T.skyNavy,
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.05em',
              textDecoration: 'none',
              transition: 'opacity 300ms ease',
            }}
          >
            Donar ahora
          </Link>
          <Link
            href="/apadrinar"
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.88rem', color: T.textMuted,
              textDecoration: 'none',
              borderBottom: `1px solid rgba(240,248,252,0.3)`, paddingBottom: 2,
            }}
          >
            Apadrinar un animal →
          </Link>
        </div>
      </div>
    </section>
  )
}
