'use client'
// components/animales/ShareButtons.tsx
// Botones de compartir para WhatsApp, Facebook y copiar link

import { useState } from 'react'
import { MessageCircle, Facebook, Link2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonsProps {
  animal: {
    id: string
    nombre: string
    foto_principal?: string | null
  }
  urlPerfil: string
}

export function ShareButtons({ animal, urlPerfil }: ShareButtonsProps) {
  const [copiado, setCopiado] = useState(false)

  // WhatsApp: mensaje predefinido con link
  const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(
    `🐾 ¡${animal.nombre} busca un hogar! Conoce su historia en LIVA:\n${urlPerfil}`
  )}`

  // Facebook Share Dialog
  const urlFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlPerfil)}`

  // Copiar link al portapapeles
  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlPerfil)
      setCopiado(true)
      toast.success('¡Link copiado! Compártelo en tu Story de Instagram 📸')
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      toast.error('No pudimos copiar el link')
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-[#1A1A1A] mb-3 uppercase tracking-wide">
        Comparte a {animal.nombre}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {/* WhatsApp */}
        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir a ${animal.nombre} en WhatsApp`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold
                     hover:bg-[#1da851] transition-colors shadow-sm"
        >
          <MessageCircle className="h-4 w-4 fill-white" />
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={urlFacebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir a ${animal.nombre} en Facebook`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-semibold
                     hover:bg-[#1462cc] transition-colors shadow-sm"
        >
          <Facebook className="h-4 w-4 fill-white" />
          Facebook
        </a>

        {/* Copiar link (para Instagram Stories) */}
        <button
          onClick={copiarLink}
          aria-label="Copiar link del perfil"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm
            ${copiado
              ? 'bg-[#E8F5EE] text-[#2D6A4F] border border-[#2D6A4F]/30'
              : 'bg-[#F5EFE8] text-[#1A1A1A] border border-[#E8E0D8] hover:bg-[#FEF0EC] hover:border-[#E85D3A] hover:text-[#E85D3A]'
            }`}
        >
          {copiado ? (
            <>
              <Check className="h-4 w-4 text-[#2D6A4F]" />
              ¡Link copiado!
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              Copiar link
            </>
          )}
        </button>
      </div>
      {copiado && (
        <p className="text-xs text-[#6B6B6B] mt-2">
          📸 Pégalo en tu Story de Instagram para darle más difusión
        </p>
      )}
    </div>
  )
}
