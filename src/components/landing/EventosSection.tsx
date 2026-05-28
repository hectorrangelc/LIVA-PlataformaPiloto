'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { T } from './tokens'

const EVENTOS = [
  {
    tipo: 'Adopción',
    tipoBg: 'rgba(114,194,218,0.14)',
    tipoBorder: 'rgba(114,194,218,0.35)',
    tipoColor: T.primary,
    titulo: 'Feria de Adopción Ecatepec',
    desc: 'Más de 40 perros y gatos disponibles para adopción. Incluye esterilización a precio accesible.',
    fecha: '7 Jun',
    lugar: 'Plaza Cívica, Ecatepec',
    span: true,
  },
  {
    tipo: 'Esterilización',
    tipoBg: 'rgba(63,160,188,0.14)',
    tipoBorder: 'rgba(63,160,188,0.4)',
    tipoColor: T.skyMid,
    titulo: 'Campaña de Esterilización',
    desc: 'Servicios de esterilización a bajo costo para comunidades del norte del Valle.',
    fecha: '14 Jun',
    lugar: 'Naucalpan de Juárez',
    span: false,
  },
  {
    tipo: 'Rescate',
    tipoBg: 'rgba(200,168,70,0.12)',
    tipoBorder: T.goldDim,
    tipoColor: T.gold,
    titulo: 'Jornada de Rescate Callejero',
    desc: 'Operativo de rescate y atención médica para animales en situación de calle.',
    fecha: '21 Jun',
    lugar: 'Chimalhuacán',
    span: false,
  },
]

export function EventosSection() {
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
            <span className="landing-eyebrow" style={{ color: T.gold }}>
              Próximos eventos
            </span>
            <h2 className="landing-section-title" style={{ color: T.textLight }}>
              Adopciones, esterilizaciones<br />
              <em style={{ fontStyle: 'italic', color: T.gold }}>y más este mes</em>
            </h2>
          </div>
          <Link
            href="/eventos"
            style={{
              fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.82rem',
              color: T.textMuted, textDecoration: 'none',
              borderBottom: `1px solid rgba(240,248,252,0.2)`, paddingBottom: 2,
              alignSelf: 'flex-end', whiteSpace: 'nowrap',
            }}
          >
            Ver todos los eventos →
          </Link>
        </div>

        {/* Grid */}
        <div className="landing-bento">
          {EVENTOS.map((ev, i) => (
            <div
              key={i}
              className={ev.span ? 'landing-span-2' : ''}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(3rem)',
                transition: `all 850ms cubic-bezier(0.32,0.72,0,1) ${180 + i * 140}ms`,
              }}
            >
              <div className="bezel-outer" style={{ background: T.textFaint, border: `1px solid ${T.borderDark}` }}>
                <div
                  className="bezel-inner bezel-inner-dark"
                  style={{ background: T.skyBgMid, minHeight: ev.span ? 220 : 240, position: 'relative' }}
                >
                  {/* Date badge */}
                  <div
                    style={{
                      position: 'absolute', top: '2rem', right: '2rem',
                      background: T.textFaint, border: `1px solid ${T.borderDark}`,
                      borderRadius: 12, padding: '0.5rem 0.85rem', textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '1.4rem', fontWeight: 300, color: T.textLight, lineHeight: 1 }}>
                      {ev.fecha.split(' ')[0]}
                    </div>
                    <div style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textDim }}>
                      {ev.fecha.split(' ')[1]}
                    </div>
                  </div>

                  {/* Type badge */}
                  <span
                    style={{
                      display: 'inline-block', borderRadius: 9999,
                      background: ev.tipoBg, border: `1px solid ${ev.tipoBorder}`,
                      color: ev.tipoColor,
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                      fontWeight: 600, padding: '0.22rem 0.8rem', marginBottom: '1.25rem',
                    }}
                  >
                    {ev.tipo}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      fontSize: ev.span ? '1.7rem' : '1.4rem',
                      fontWeight: 400, color: T.textLight, lineHeight: 1.2,
                      marginBottom: '0.75rem', paddingRight: '6rem',
                    }}
                  >
                    {ev.titulo}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.85rem', color: T.textMuted,
                      lineHeight: 1.7, marginBottom: '1.25rem',
                      maxWidth: ev.span ? 480 : 'none',
                    }}
                  >
                    {ev.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.75rem', color: T.textDim }}>
                      📍 {ev.lugar}
                    </span>
                    <Link
                      href="/eventos"
                      style={{
                        fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.78rem',
                        color: ev.tipoColor, textDecoration: 'none', fontWeight: 500,
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap',
                      }}
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
