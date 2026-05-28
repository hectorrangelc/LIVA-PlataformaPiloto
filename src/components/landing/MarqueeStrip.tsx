import { T } from './tokens'

const ANIMALS = [
  'Bella', 'Tobi', 'Luna', 'Max', 'Canela', 'Mochi',
  'Pelusa', 'Bruno', 'Nala', 'Coco', 'Frida', 'Thor',
  'Lola', 'Kira', 'Oso', 'Mía', 'Simón', 'Duna',
]

const doubled = [...ANIMALS, ...ANIMALS]

export function MarqueeStrip() {
  return (
    <div style={{ background: T.skyNavy, padding: '1.2rem 0', overflow: 'hidden' }}>
      <div
        className="animate-marquee"
        style={{ display: 'flex', width: 'max-content' }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: T.skyPale,
              flexShrink: 0,
              paddingRight: '2.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
            <span style={{ color: 'rgba(142,204,226,0.3)', paddingLeft: '2rem', marginRight: '-1.5rem' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
