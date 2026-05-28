// src/app/(public)/eventos/page.tsx
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { EventoCard } from '@/components/eventos/EventoCard'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Evento } from '@/types'

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Jornadas de adopción, esterilización y voluntariado. Únete a la comunidad LIVA.',
}

async function ListaEventos() {
  const supabase = await createClient()
  const ahora = new Date().toISOString()

  const [{ data: proximos }, { data: pasados }] = await Promise.all([
    supabase.from('eventos')
      .select('*')
      .eq('activo', true)
      .gte('fecha_inicio', ahora)
      .order('fecha_inicio', { ascending: true })
      .limit(12),
    supabase.from('eventos')
      .select('*')
      .eq('activo', true)
      .lt('fecha_inicio', ahora)
      .order('fecha_inicio', { ascending: false })
      .limit(6),
  ])

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Próximos eventos</h2>
        {!proximos || proximos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E0D8]">
            <p className="text-[#6B6B6B]">No hay eventos próximos por ahora. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proximos.map((evento) => (
              <EventoCard key={evento.id} evento={evento as Evento} />
            ))}
          </div>
        )}
      </section>

      {pasados && pasados.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-[#6B6B6B] mb-4">Eventos pasados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pasados.map((evento) => (
              <EventoCard key={evento.id} evento={evento as Evento} pasado />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D8]">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div className="bg-white border-b border-[#E8E0D8] py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-lora text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
            Eventos LIVA 🎪
          </h1>
          <p className="text-[#6B6B6B] text-lg">
            Jornadas de adopción, esterilización y voluntariado. Sé parte del cambio.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SkeletonGrid />}>
          <ListaEventos />
        </Suspense>
      </div>
    </div>
  )
}
