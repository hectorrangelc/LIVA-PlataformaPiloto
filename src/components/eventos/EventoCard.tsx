// src/components/eventos/EventoCard.tsx
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Evento } from '@/types'

const TIPO_BADGE: Record<string, { label: string; color: string }> = {
  adopcion:       { label: 'Adopción',      color: 'bg-orange-100 text-orange-700' },
  esterilizacion: { label: 'Esterilización', color: 'bg-blue-100 text-blue-700' },
  recaudacion:    { label: 'Recaudación',   color: 'bg-green-100 text-green-700' },
  voluntariado:   { label: 'Voluntariado',  color: 'bg-purple-100 text-purple-700' },
  otro:           { label: 'Evento',        color: 'bg-gray-100 text-gray-700' },
}

interface Props {
  evento: Evento
  pasado?: boolean
}

export function EventoCard({ evento, pasado = false }: Props) {
  const badge = TIPO_BADGE[evento.tipo] ?? TIPO_BADGE.otro
  const fecha = new Date(evento.fecha_inicio)

  return (
    <Link href={`/eventos/${evento.id}`}>
      <article className={`bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden
        hover:shadow-card-hover transition-shadow group ${pasado ? 'opacity-75' : ''}`}>
        <div className="aspect-video bg-[#FEF0EC] relative overflow-hidden">
          {evento.imagen_url ? (
            <img src={evento.imagen_url} alt={evento.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
          )}
          {pasado && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                Pasado
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${badge.color}`}>
            {badge.label}
          </span>
          <h3 className="font-semibold text-[#1A1A1A] line-clamp-2 group-hover:text-[#E85D3A] transition-colors">
            {evento.titulo}
          </h3>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{format(fecha, "d 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">
                {evento.lugar}{evento.ciudad ? `, ${evento.ciudad}` : ''}
              </span>
            </div>
            {evento.capacidad && (
              <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Capacidad: {evento.capacidad} personas</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
