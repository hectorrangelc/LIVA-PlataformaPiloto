'use client'
// components/animales/GaleriaFotos.tsx
// Galería con lightbox y navegación para el perfil del animal
import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GaleriaFotosProps {
  fotoPrincipal?: string | null
  fotos: string[]
  nombreAnimal: string
}

export function GaleriaFotos({ fotoPrincipal, fotos, nombreAnimal }: GaleriaFotosProps) {
  // Combinar foto principal con el array de fotos, sin duplicados
  const todasLasFotos = [
    ...(fotoPrincipal ? [fotoPrincipal] : []),
    ...fotos.filter((f) => f !== fotoPrincipal),
  ]

  const [fotoActiva, setFotoActiva] = useState(0)
  const [lightboxAbierto, setLightboxAbierto] = useState(false)
  const [fotoLightbox, setFotoLightbox] = useState(0)

  const abrirLightbox = (indice: number) => {
    setFotoLightbox(indice)
    setLightboxAbierto(true)
  }

  const cerrarLightbox = () => setLightboxAbierto(false)

  const anterior = useCallback(() => {
    setFotoLightbox((i) => (i === 0 ? todasLasFotos.length - 1 : i - 1))
  }, [todasLasFotos.length])

  const siguiente = useCallback(() => {
    setFotoLightbox((i) => (i === todasLasFotos.length - 1 ? 0 : i + 1))
  }, [todasLasFotos.length])

  // Navegación con teclado en lightbox
  useEffect(() => {
    if (!lightboxAbierto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarLightbox()
      if (e.key === 'ArrowLeft') anterior()
      if (e.key === 'ArrowRight') siguiente()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxAbierto, anterior, siguiente])

  const imagenPlaceholder = '/images/animal-placeholder.jpg'

  if (todasLasFotos.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-2xl bg-[#F5EFE8] flex items-center justify-center">
        <p className="text-[#6B6B6B] text-sm">Sin fotos disponibles</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Foto principal */}
      <div
        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F5EFE8] cursor-zoom-in group"
        onClick={() => abrirLightbox(fotoActiva)}
      >
        <Image
          src={todasLasFotos[fotoActiva] ?? imagenPlaceholder}
          alt={`${nombreAnimal} — foto ${fotoActiva + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />
        {/* Overlay de zoom */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
            <ZoomIn className="h-5 w-5 text-[#1A1A1A]" />
          </div>
        </div>

        {/* Contador de fotos */}
        {todasLasFotos.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
            {fotoActiva + 1} / {todasLasFotos.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {todasLasFotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {todasLasFotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setFotoActiva(i)}
              aria-label={`Ver foto ${i + 1} de ${nombreAnimal}`}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
                ${fotoActiva === i
                  ? 'border-[#E85D3A] shadow-md scale-105'
                  : 'border-transparent hover:border-[#E85D3A]/50'
                }`}
            >
              <Image
                src={foto ?? imagenPlaceholder}
                alt={`${nombreAnimal} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={cerrarLightbox}
        >
          {/* Cerrar */}
          <button
            onClick={cerrarLightbox}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Anterior */}
          {todasLasFotos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); anterior() }}
              aria-label="Foto anterior"
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Imagen */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] mx-16 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={todasLasFotos[fotoLightbox] ?? imagenPlaceholder}
              alt={`${nombreAnimal} — foto ${fotoLightbox + 1}`}
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>

          {/* Siguiente */}
          {todasLasFotos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); siguiente() }}
              aria-label="Siguiente foto"
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/20 text-white text-sm">
            {fotoLightbox + 1} / {todasLasFotos.length}
          </div>
        </div>
      )}
    </div>
  )
}
