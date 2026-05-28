'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { T } from './tokens'

const STEPS = [
  {
    number: '01',
    tag: 'Primer paso',
    title: 'Solicita',
    desc: 'Llena nuestro formulario de adopción en línea. Cuéntanos sobre tu hogar, estilo de vida y el tipo de compañero que buscas. Solo toma 5 minutos.',
    link: 'Comenzar solicitud →',
    href: '/adoptar',
  },
  {
    number: '02',
    tag: 'Proceso',
    title: 'Conoce',
    desc: 'Coordinamos una entrevista y visita de hogar contigo. Queremos asegurarnos de que el match sea perfecto para ti y para el animal.',
    link: 'Ver requisitos →',
    href: '/adoptar#requisitos',
  },
  {
    number: '03',
    tag: 'El gran momento',
    title: 'Lleva a casa',
    desc: 'Firman el contrato de adopción responsable y el animal viaja contigo. Hacemos seguimiento durante los primeros meses para apoyarte.',
    link: 'Leer el proceso completo →',
    href: '/adoptar#proceso',
  },
]

export function AdoptionSteps() {
  const [ref, inView] = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="landing-section"
      style={{ background: T.cream }}
    >
      <div className="landing-container">
        {/* Header */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(1.5rem)',
            transition: 'all 700ms cubic-bezier(0.32,0.72,0,1)',
            marginBottom: '3.5rem',
          }}
        >
          <span className="landing-eyebrow" style={{ color: T.skyMid }}>
            Cómo adoptar
          </span>
          <h2 className="landing-section-title" style={{ color: T.foreground }}>
            Tres pasos para<br />
            <em style={{ fontStyle: 'italic', color: T.accent }}>cambiar una vida</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="landing-grid-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(2.5rem)',
                transition: `all 750ms cubic-bezier(0.32,0.72,0,1) ${i * 130}ms`,
              }}
            >
              <div className="bezel-outer" style={{ background: `rgba(15,46,64,0.04)`, border: `1px solid ${T.borderLight}` }}>
                <div
                  className="bezel-inner bezel-inner-light"
                  style={{ background: T.creamLt }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      fontSize: '3rem', fontWeight: 300, lineHeight: 1,
                      color: T.primary, marginBottom: '1.25rem', opacity: 0.6,
                    }}
                  >
                    {step.number}
                  </div>

                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.67rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      fontWeight: 600, color: T.skyMid, marginBottom: '0.75rem',
                    }}
                  >
                    {step.tag}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      fontSize: '1.55rem', fontWeight: 400, lineHeight: 1.2,
                      color: T.foreground, marginBottom: '0.9rem',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.88rem', lineHeight: 1.75,
                      color: '#3A6278', flex: 1, marginBottom: '1.5rem',
                    }}
                  >
                    {step.desc}
                  </p>

                  <Link
                    href={step.href}
                    style={{
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontSize: '0.82rem', fontWeight: 500,
                      color: T.skyMid, textDecoration: 'none',
                      borderBottom: `1px solid rgba(63,160,188,0.35)`, paddingBottom: 1,
                      alignSelf: 'flex-start',
                      transition: 'opacity 300ms ease',
                    }}
                  >
                    {step.link}
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
