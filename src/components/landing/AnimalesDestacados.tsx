'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { T } from './tokens'

const ANIMALES = [
  {
    id: '1',
    nombre: 'Dante',
    especie: 'Perro',
    raza: 'Labrador mix',
    edad: '8 meses',
    ciudad: 'Valle de México',
    urgente: true,
    apadrinado: false,
    emoji: '🐕',
    gradiente: `linear-gradient(135deg, ${T.skyNavy} 0%, #0F2535 100%)`,
    span: true,
  },
  {
    id: '2',
    nombre: 'Miel',
    especie: 'Gata',
    raza: 'Doméstica',
    edad: '2 años',
    ciudad: 'Ecatepec',
    urgente: false,
    apadrinado: true,
    emoji: '🐈',
    gradiente: `linear-gradient(135deg, #0D2A3A 0%, ${T.skyNavy} 100%)`,
    span: false,
  },
  {
    id: '3',
    nombre: 'Gordo',
    especie: 'Perro',
    raza: 'Beagle mix',
    edad: '4 años',
    ciudad: 'Naucalpan',
    urgente: false,
    apadrinado: false,
    emoji: '🐶',
    gradiente: `linear-gradient(135deg, #132840 0%, #1B4D66 100%)`,
    span: false,
  },
]

export function AnimalesDestacados() {
  const [ref, inView] = useInView(0.1)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="landing-section"
      style={{ background: T.skyDark }}
    >
      <div className="landing-container">
        {/* Header */}
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '3rem',
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(1.5rem)',
            transition: 'all 700ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <div>
            <span className="landing-eyebrow" style={{ color: T.primary }}>
              Animales en adopción
            </span>
            <h2 className="landing-section-title" style={{ color: T.textLight }}>
              Conoce a quienes<br />
              <em style={{ fontStyle: 'italic', color: T.primary }}>esperan por ti</em>
            </h2>
          </div>
          <Link
            href="/adoptar"
            style={{
              fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.82rem',
              color: T.textMuted, textDecoration: 'none',
              borderBottom: `1px solid rgba(240,248,252,0.2)`, paddingBottom: 2,
              alignSelf: 'flex-end', whiteSpace: 'nowrap',
            }}
          >
            Ver todos los animales →
          </Link>
        </div>

        {/* Bento grid */}
        <div className="landing-bento">
          {ANIMALES.map((animal, i) => (
            <div
              key={animal.id}
              className={animal.span ? 'landing-span-2' : ''}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(3rem)',
                transition: `all 850ms cubic-bezier(0.32,0.72,0,1) ${180 + i * 140}ms`,
              }}
            >
              <div
                className="bezel-outer"
                style={{ background: T.textFaint, border: `1px solid ${T.borderDark}` }}
              >
                <div
                  className="bezel-inner bezel-inner-dark"
                  style={{
                    background: T.skyBgMid,
                    minHeight: animal.span ? 290 : 280,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Decorative emoji */}
                  <div
                    style={{
                      position: 'absolute', right: '1.5rem', bottom: '1rem',
                      fontSize: animal.span ? '9rem' : '5.5rem',
                      opacity: 0.07, userSelect: 'none', lineHeight: 1,
                      pointerEvents: 'none',
                    }}
                  >
                    {animal.emoji}
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {animal.urgente && (
                      <span
                        style={{
                          display: 'inline-block', borderRadius: 9999,
                          background: 'rgba(224,112,72,0.16)', border: '1px solid rgba(224,112,72,0.45)',
                          color: '#E8906A',
                          fontFamily: 'var(--font-jost), sans-serif',
                          fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                          fontWeight: 600, padding: '0.22rem 0.8rem',
                        }}
                      >
                        Urgente
                      </span>
                    )}
                    {animal.apadrinado && (
                      <span
                        style={{
                          display: 'inline-block', borderRadius: 9999,
                          background: 'rgba(200,168,70,0.16)', border: `1px solid ${T.goldDim}`,
                          color: T.gold,
                          fontFamily: 'var(--font-jost), sans-serif',
                          fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                          fontWeight: 600, padding: '0.22rem 0.8rem',
                        }}
                      >
                        Apadrinado
                      </span>
                    )}
                    {!animal.urgente && !animal.apadrinado && (
                      <span
                        style={{
                          display: 'inline-block', borderRadius: 9999,
                          background: 'rgba(114,194,218,0.14)', border: `1px solid rgba(114,194,218,0.35)`,
                          color: T.primary,
                          fontFamily: 'var(--font-jost), sans-serif',
                          fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                          fontWeight: 600, padding: '0.22rem 0.8rem',
                        }}
                      >
                        Disponible
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      fontSize: animal.span ? '1.9rem' : '1.5rem',
                      fontWeight: 400, color: T.textLight,
                      lineHeight: 1.2, marginBottom: '0.5rem',
                    }}
                  >
                    {animal.nombre}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.82rem', color: T.textMuted,
                      lineHeight: 1.5, marginBottom: '0.5rem',
                    }}
                  >
                    {animal.especie} · {animal.raza} · {animal.edad}
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.78rem', color: T.textDim,
                      marginBottom: '1.75rem',
                    }}
                  >
                    📍 {animal.ciudad}
                  </p>

                  <Link
                    href={`/animales/${animal.id}`}
                    style={{
                      fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.8rem',
                      color: T.primary, textDecoration: 'none', fontWeight: 500,
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    }}
                  >
                    Ver perfil completo →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
