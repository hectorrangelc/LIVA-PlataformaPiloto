import Link from 'next/link'
import { T } from './tokens'

const FOOTER_COLS: Record<string, { label: string; href: string }[]> = {
  Adoptar: [
    { label: 'Ver animales',        href: '/adoptar' },
    { label: 'Proceso de adopción', href: '/adoptar#proceso' },
    { label: 'Requisitos',          href: '/adoptar#requisitos' },
    { label: 'Seguimiento',         href: '/seguimiento' },
  ],
  Apoyar: [
    { label: 'Donar',               href: '/donar' },
    { label: 'Apadrinar',           href: '/apadrinar' },
    { label: 'Voluntariado',        href: '/voluntariado' },
    { label: 'Donación en especie', href: '/donar#especie' },
  ],
  Comunidad: [
    { label: 'Eventos',       href: '/eventos' },
    { label: 'Nosotros',      href: '/nosotros' },
    { label: 'Transparencia', href: '/transparencia' },
    { label: 'Noticias',      href: '/noticias' },
  ],
}

export function FooterLanding() {
  return (
    <footer
      style={{
        background: '#08202E',
        padding: '5rem 3rem 2.5rem',
        borderTop: `1px solid ${T.borderDark}`,
      }}
    >
      <div className="landing-container">
        <div className="landing-footer-grid">
          {/* Brand column */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: T.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: 15, color: T.skyNavy }}>L</span>
              </div>
              <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '1.1rem', fontWeight: 600, color: T.textLight, letterSpacing: '0.08em' }}>
                LIVA
              </span>
            </Link>

            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.82rem', color: 'rgba(240,248,252,0.38)', lineHeight: 1.85, maxWidth: 220, marginTop: '0.75rem' }}>
              Liga Vallesana para los Derechos de los Animales A.C. Rescate y adopción responsable en el Valle de México.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
              {['IG', 'FB', 'TW', 'WA'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="landing-social-icon"
                  style={{ border: `1px solid rgba(240,248,252,0.1)`, color: 'rgba(240,248,252,0.38)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_COLS).map(([col, links]) => (
            <div key={col}>
              <h4
                style={{
                  fontFamily: 'var(--font-jost), sans-serif',
                  fontSize: '0.67rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(240,248,252,0.32)', marginBottom: '1.1rem', fontWeight: 600,
                }}
              >
                {col}
              </h4>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="landing-footer-link"
                  style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.82rem', color: 'rgba(240,248,252,0.52)', display: 'block', marginBottom: '0.55rem' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid rgba(240,248,252,0.05)`,
            paddingTop: '1.5rem',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
          }}
        >
          <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.72rem', color: 'rgba(240,248,252,0.2)' }}>
            © 2026 LIVA — Liga Vallesana para los Derechos de los Animales A.C.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Aviso de Privacidad', 'Transparencia', 'Contacto'].map((l) => (
              <Link
                key={l}
                href="#"
                style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '0.72rem', color: 'rgba(240,248,252,0.2)', textDecoration: 'none' }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
