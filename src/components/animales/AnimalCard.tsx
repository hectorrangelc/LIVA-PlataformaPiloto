'use client'
// components/animales/AnimalCard.tsx
// Tarjeta de animal para el catálogo — con favoritos, badge y animación hover

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, AlertCircle, Star } from 'lucide-react'
import { EstadoBadge } from './EstadoBadge'
import { formatearEdad } from '@/utils/formatters'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Animal } from '@/types'

interface AnimalCardProps {
  animal: Pick<
    Animal,
    | 'id'
    | 'nombre'
    | 'especie'
    | 'categoria_edad'
    | 'edad_meses'
    | 'sexo'
    | 'foto_principal'
    | 'estado'
    | 'ciudad_rescate'
    | 'urgente'
    | 'apadrinado'
  >
  esFavorito?: boolean
  usuarioId?: string
}

const ESPECIE_EMOJI: Record<string, string> = {
  perro: '🐕',
  gato: '🐱',
  otro: '🐾',
}

export function AnimalCard({ animal, esFavorito = false, usuarioId }: AnimalCardProps) {
  const [favorito, setFavorito] = useState(esFavorito)
  const [guardandoFavorito, setGuardandoFavorito] = useState(false)
  const supabase = createClient()

  const toggleFavorito = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!usuarioId) {
      toast.error('Inicia sesión para guardar favoritos')
      return
    }

    setGuardandoFavorito(true)

    try {
      if (favorito) {
        await supabase
          .from('animales_favoritos')
          .delete()
          .eq('user_id', usuarioId)
          .eq('animal_id', animal.id)
        setFavorito(false)
        toast.success(`${animal.nombre} eliminado de favoritos`)
      } else {
        await supabase
          .from('animales_favoritos')
          .insert({ user_id: usuarioId, animal_id: animal.id })
        setFavorito(true)
        toast.success(`¡${animal.nombre} guardado en favoritos! 💛`)
      }
    } catch {
      toast.error('No pudimos actualizar tus favoritos')
    } finally {
      setGuardandoFavorito(false)
    }
  }

  const imagenSrc = animal.foto_principal || '/images/animal-placeholder.jpg'
  const edadTexto = animal.edad_meses ? formatearEdad(animal.edad_meses) : 'Edad desconocida'
  const especieEmoji = ESPECIE_EMOJI[animal.especie] ?? '🐾'

  return (
    <Link href={`/animales/${animal.id}`} className="group block">
      <article className="relative bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F5EFE8]">
          <Image
            src={imagenSrc}
            alt={`${animal.nombre} — ${animal.especie} en adopción`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradiente inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5">
              {animal.urgente && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
                  <AlertCircle className="h-3 w-3" />
                  URGENTE
                </span>
              )}
              {animal.apadrinado && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E85D3A] text-white text-xs font-semibold shadow-sm">
                  <Star className="h-3 w-3 fill-white" />
                  Apadrinado
                </span>
              )}
            </div>

            {/* Botón favorito */}
            <button
              onClick={toggleFavorito}
              disabled={guardandoFavorito}
              aria-label={favorito ? `Quitar ${animal.nombre} de favoritos` : `Guardar ${animal.nombre} en favoritos`}
              className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200
                ${favorito
                  ? 'bg-[#E85D3A] text-white shadow-md'
                  : 'bg-white/80 text-[#6B6B6B] hover:bg-white hover:text-[#E85D3A]'
                }`}
            >
              <Heart className={`h-4 w-4 ${favorito ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Estado — bottom left */}
          <div className="absolute bottom-3 left-3">
            <EstadoBadge estado={animal.estado} />
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Nombre y especie */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#E85D3A] transition-colors truncate">
              {especieEmoji} {animal.nombre}
            </h3>
          </div>

          {/* Detalles */}
          <p className="text-sm text-[#6B6B6B] mb-3">
            {animal.categoria_edad
              ? animal.categoria_edad.charAt(0).toUpperCase() + animal.categoria_edad.slice(1)
              : 'Edad no especificada'
            }
            {animal.sexo && ` · ${animal.sexo === 'macho' ? 'Macho' : 'Hembra'}`}
            {' · '}{edadTexto}
          </p>

          {/* Ciudad */}
          {animal.ciudad_rescate && (
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-4">
              <MapPin className="h-3.5 w-3.5 text-[#E85D3A]" />
              {animal.ciudad_rescate}
            </div>
          )}

          {/* CTA */}
          <div className="w-full py-2.5 text-center rounded-xl bg-[#FEF0EC] text-[#E85D3A] text-sm font-semibold
                          group-hover:bg-[#E85D3A] group-hover:text-white transition-colors duration-200">
            Ver perfil →
          </div>
        </div>
      </article>
    </Link>
  )
}
