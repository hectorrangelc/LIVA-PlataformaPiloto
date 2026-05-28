'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { T } from './tokens'

const STATS = [
  { num: '1,240', unit: 'adopt', label: 'animales adoptados en lo que va del año' },
  { num: '320+',  unit: 'rescat', label: 'rescates atendidos este año en el Valle de México' },
  { num: '85',    unit: 'volunt', label: 'voluntarios activos apoyando cada semana' },
  { num: '6',     unit: 'años',  label: 'de operación continua rescatando vidas' },
]

export function StatsSection() {
  const [ref, inView] = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="landing-section"
      style={{ background: T.cream }}
    >
      <div className="landing-container landing-stats-layout">
        {/* Left copy */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(2rem)',
            transition: 'all 750ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <span className="landing-eyebrow" style={{ color: T.warmCta }}>
            Nuestro impacto
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(1.9rem, 3.2vw, 2.9rem)',
              fontWeight: 300, color: T.foreground,
              lineHeight: 1.2, marginBottom: '1.25rem',
            }}
          >
            Cada rescate importa.<br />
            <em style={{ fontStyle: 'italic', color: T.skyMid }}>Cada adopción también.</em>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.93rem', color: '#3A6278',
              lineHeight: 1.82, marginBottom: '2.25rem', maxWidth: 370,
            }}
          >
            Trabajamos con autoridades locales, veterinarios y cientos de voluntarios para rescatar, rehabilitar y dar en adopción a animales en situación vulnerable en el Valle de México.
          </p>
          <Link
            href="/nosotros"
            className="landing-cta-primary"
            style={{ background: T.skyNavy, color: T.textLight }}
          >
            Conocer más sobre LIVA
            <span
              style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(240,248,252,0.12)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem',
              }}
            >
              →
            </span>
          </Link>
        </div>

        {/* Right: stat grid */}
        <div className="landing-grid-2">
          {STATS.map((s, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(2rem)',
                transition: `all 750ms cubic-bezier(0.32,0.72,0,1) ${i * 100}ms`,
              }}
            >
              <div className="bezel-outer" style={{ background: 'rgba(15,46,64,0.04)', border: `1px solid ${T.borderLight}` }}>
                <div className="bezel-inner bezel-inner-light" style={{ background: T.creamLt, minHeight: 'auto', padding: '1.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.45rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-fraunces), serif',
                        fontSize: '2.5rem', fontWeight: 300, color: T.foreground, lineHeight: 1,
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-jost), sans-serif',
                        fontSize: '0.66rem', letterSpacing: '0.13em', textTransform: 'uppercase',
                        color: T.skyMid, fontWeight: 600,
                      }}
                    >
                      {s.unit}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.78rem', color: T.muted, lineHeight: 1.55 }}>
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
