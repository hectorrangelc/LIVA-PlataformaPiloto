'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { T } from './tokens'

const NAV_LINKS = [
  { label: 'Adoptar',   href: '/adoptar' },
  { label: 'Donar',     href: '/donar' },
  { label: 'Eventos',   href: '/eventos' },
  { label: 'Comunidad', href: '/comunidad' },
]

const MENU_COLS = [
  {
    label: 'Adoptar',
    sub: [
      { title: 'Ver animales',       desc: 'Perros, gatos y más en adopción.' },
      { title: 'Proceso de adopción', desc: 'Cómo funciona paso a paso.' },
      { title: 'Requisitos',          desc: 'Lo que necesitas para adoptar.' },
      { title: 'Seguimiento',         desc: 'Actualiza el estado de tu solicitud.' },
    ],
  },
  {
    label: 'Apoyar',
    sub: [
      { title: 'Donar',            desc: 'Apoya económicamente a LIVA.' },
      { title: 'Apadrinar animal', desc: 'Financia el cuidado de un animal.' },
      { title: 'Voluntariado',     desc: 'Únete a nuestro equipo de voluntarios.' },
      { title: 'Donación en especie', desc: 'Alimento, medicamentos y más.' },
    ],
  },
  {
    label: 'Comunidad',
    sub: [
      { title: 'Eventos',         desc: 'Adopciones, esterilizaciones y más.' },
      { title: 'Nosotros',        desc: 'Quiénes somos y qué hacemos.' },
      { title: 'Transparencia',   desc: 'Reportes y uso de donativos.' },
    ],
  },
  { label: 'Noticias', sub: [] },
]

export function FloatingNav() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className="landing-nav"
        style={{
          background: scrolled ? 'rgba(15,46,64,0.95)' : 'rgba(15,46,64,0.45)',
          border: `1px solid ${scrolled ? T.textFaint : T.borderDark}`,
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: T.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: 14, color: T.skyNavy }}>
              L
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '1rem', fontWeight: 600, color: T.textLight, letterSpacing: '0.08em' }}>
            LIVA
          </span>
        </Link>

        {/* Desktop links */}
        <div className="landing-nav-desktop flex gap-7 items-center">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="landing-nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex gap-3 items-center">
          <Link
            href="/adoptar"
            className="landing-nav-cta"
            style={{
              background: T.warmCta, color: T.textLight,
              borderRadius: 9999, padding: '0.45rem 1.2rem',
              fontFamily: 'var(--font-jost), sans-serif',
              fontSize: '0.76rem', fontWeight: 500, letterSpacing: '0.06em',
              textDecoration: 'none',
            }}
          >
            Adoptar
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="landing-hamburger"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="landing-ham-line" style={{ transform: open ? 'rotate(45deg) translate(4px,5px)' : 'none' }} />
            <span className="landing-ham-line" style={{ opacity: open ? 0 : 1 }} />
            <span className="landing-ham-line" style={{ transform: open ? 'rotate(-45deg) translate(4px,-5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Fullscreen overlay */}
      <div
        className="landing-menu-overlay"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          background: 'rgba(8,28,40,0.97)',
        }}
      >
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '2.5rem 5rem', maxWidth: 780, width: '100%', padding: '2rem 4rem',
          }}
        >
          {MENU_COLS.map((col, i) => (
            <div
              key={col.label}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'none' : 'translateY(2.5rem)',
                transition: `all 650ms cubic-bezier(0.32,0.72,0,1) ${i * 80}ms`,
              }}
            >
              <Link
                href="#"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 300,
                  color: T.textLight, textDecoration: 'none',
                  display: 'block', marginBottom: '1rem', lineHeight: 1.1,
                }}
                onClick={() => setOpen(false)}
              >
                {col.label}
              </Link>
              {col.sub.map((s) => (
                <div key={s.title} style={{ marginBottom: '0.55rem' }}>
                  <Link href="#" style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.85rem', color: T.textMuted, textDecoration: 'none', display: 'block', lineHeight: 1.3 }}>
                    {s.title}
                  </Link>
                  <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.72rem', color: T.textDim, display: 'block' }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0, padding: '0 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.75rem', color: T.textDim, letterSpacing: '0.05em' }}>
            LIVA — Liga Vallesana para los Derechos de los Animales A.C.
          </span>
          <Link
            href="/adoptar"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: T.warmCta, color: T.textLight, borderRadius: 9999,
              padding: '0.7rem 1.4rem',
              fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.82rem', fontWeight: 500,
              textDecoration: 'none',
            }}
            onClick={() => setOpen(false)}
          >
            Ver animales en adopción
          </Link>
        </div>
      </div>
    </>
  )
}
