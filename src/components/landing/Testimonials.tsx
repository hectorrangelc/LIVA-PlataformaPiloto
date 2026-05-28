'use client'

import { useInView } from '@/hooks/useInView'
import { T } from './tokens'

const TESTIMONIALS = [
  {
    initial: 'A',
    bg: T.skyMid,
    quote: 'Adopté a Luna hace un año y fue la mejor decisión de mi vida. El proceso con LIVA fue transparente, amoroso y muy bien organizado. Se aseguraron de que el match fuera perfecto.',
    nombre: 'Andrea Mejía Torres',
    rol: 'Adoptante — Ciudad de México',
  },
  {
    initial: 'R',
    bg: T.skyNavy,
    quote: 'Soy voluntario en LIVA desde hace 3 años. Ver cómo un animal rescatado de la calle encuentra un hogar es algo que no tiene precio. Es trabajo de corazón.',
    nombre: 'Roberto Fuentes',
    rol: 'Voluntario — Ecatepec',
  },
  {
    initial: 'C',
    bg: '#0A2030',
    quote: 'Apadrinamos a Gordo porque no podíamos adoptarlo aún. Recibir actualizaciones y fotos suyas cada semana nos llenó el corazón. Eventualmente lo adoptamos.',
    nombre: 'Carmen y Luis Ávila',
    rol: 'Familia adoptante — Naucalpan',
  },
]

export function Testimonials() {
  const [ref, inView] = useInView()

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
            marginBottom: '3.5rem',
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(1.5rem)',
            transition: 'all 700ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <span className="landing-eyebrow" style={{ color: T.primary }}>
            Historias reales
          </span>
          <h2 className="landing-section-title" style={{ color: T.textLight }}>
            Palabras de quienes<br />
            <em style={{ fontStyle: 'italic', color: T.primary }}>viven la adopción</em>
          </h2>
        </div>

        <div className="landing-grid-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(3rem)',
                transition: `all 850ms cubic-bezier(0.32,0.72,0,1) ${200 + i * 130}ms`,
              }}
            >
              <div className="bezel-outer" style={{ background: T.textFaint, border: `1px solid ${T.borderDark}` }}>
                <div
                  className="bezel-inner bezel-inner-dark"
                  style={{ background: T.skyBgMid, minHeight: 320 }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: t.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      marginBottom: '1.5rem', flexShrink: 0,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '1rem', color: T.textLight, fontWeight: 600 }}>
                      {t.initial}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic',
                      fontSize: '1rem', color: 'rgba(240,248,252,0.82)',
                      lineHeight: 1.82, flex: 1, marginBottom: '1.5rem',
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div>
                    <div style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.83rem', fontWeight: 600, color: T.textLight, letterSpacing: '0.03em' }}>
                      {t.nombre}
                    </div>
                    <div style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.72rem', color: T.textDim, marginTop: '0.2rem' }}>
                      {t.rol}
                    </div>
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
