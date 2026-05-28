// components/shared/Footer.tsx
// Footer completo con links, redes sociales y datos de contacto LIVA
import Link from 'next/link'
import { Heart, Instagram, Facebook, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'

const LINKS_FOOTER = {
  adoptar: [
    { label: 'Ver animales en adopción', href: '/adoptar' },
    { label: 'Cómo funciona la adopción', href: '/adoptar#como-funciona' },
    { label: 'Formulario de solicitud', href: '/adoptar#solicitud' },
    { label: 'Preguntas frecuentes', href: '/adoptar#faq' },
  ],
  apoyar: [
    { label: 'Hacer una donación', href: '/donar' },
    { label: 'Apadrinar un animal', href: '/donar#apadrinar' },
    { label: 'Campañas activas', href: '/donar#campanas' },
    { label: 'Ser voluntario', href: '/comunidad#voluntariado' },
  ],
  comunidad: [
    { label: 'Noticias y rescates', href: '/comunidad' },
    { label: 'Próximos eventos', href: '/eventos' },
    { label: 'Historias de éxito', href: '/comunidad#exitos' },
  ],
}

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* CTA superior */}
      <div className="gradient-liva py-12 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-lora text-3xl md:text-4xl font-bold text-white mb-4">
            Cada adopción salva una vida 🐾
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Cientos de animales esperan encontrar su hogar para siempre. Tú puedes ser la diferencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/adoptar"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#E85D3A] font-semibold rounded-xl hover:bg-[#FFFBF7] transition-colors shadow-sm"
            >
              Ver animales en adopción
            </Link>
            <Link
              href="/donar"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors border border-white/30"
            >
              Hacer una donación
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal del footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Columna: Logo + descripción */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E85D3A]">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-white">LIVA</span>
            </Link>
            <p className="text-white/65 text-sm leading-relaxed mb-6 max-w-xs">
              Somos una organización sin fines de lucro dedicada al rescate, rehabilitación
              y adopción de animales en México desde 2018.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/liva.mx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de LIVA"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-[#E85D3A] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/liva.mx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de LIVA"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-[#E85D3A] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5200000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de LIVA"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-[#E85D3A] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columna: Adoptar */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Adoptar
            </h3>
            <ul className="space-y-3">
              {LINKS_FOOTER.adoptar.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#F0845F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna: Apoyar */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Apoyar
            </h3>
            <ul className="space-y-3">
              {LINKS_FOOTER.apoyar.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#F0845F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna: Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#E85D3A] mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">
                  Ciudad de México, México
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#E85D3A] shrink-0" />
                <a
                  href="mailto:hola@liva.org.mx"
                  className="text-sm text-white/60 hover:text-[#F0845F] transition-colors"
                >
                  hola@liva.org.mx
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#E85D3A] shrink-0" />
                <a
                  href="tel:+5200000000000"
                  className="text-sm text-white/60 hover:text-[#F0845F] transition-colors"
                >
                  +52 (55) 0000-0000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {anio} LIVA — Asociación de Rescate y Adopción Animal A.C. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacidad" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Aviso de privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Términos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
