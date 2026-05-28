// src/app/(public)/eventos/[id]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BotonRegistrarEvento } from './BotonRegistrarEvento'
import type { Evento } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('eventos').select('titulo, descripcion, imagen_url').eq('id', id).single()
  if (!data) return { title: 'Evento no encontrado' }
  return {
    title: data.titulo,
    description: data.descripcion,
    openGraph: { images: data.imagen_url ? [data.imagen_url] : [] },
  }
}

export default async function EventoDetallePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: evento } = await supabase
    .from('eventos').select('*').eq('id', id).single()

  if (!evento) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let yaRegistrado = false
  if (user) {
    const { data: reg } = await supabase
      .from('registros_evento')
      .select('id')
      .eq('evento_id', id)
      .eq('user_id', user.id)
      .single()
    yaRegistrado = !!reg
  }

  const e = evento as Evento
  const fechaInicio = new Date(e.fecha_inicio)
  const esPasado = fechaInicio < new Date()

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/eventos"
          className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#E85D3A] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Todos los eventos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {e.imagen_url && (
              <img src={e.imagen_url} alt={e.titulo}
                className="w-full aspect-video object-cover rounded-2xl mb-6" />
            )}
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">{e.titulo}</h1>
            <p className="text-[#6B6B6B] leading-relaxed whitespace-pre-line">{e.descripcion}</p>
            {esPasado && e.resultados && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">Resultados del evento</h3>
                <p className="text-green-700 text-sm">{e.resultados}</p>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5">
              <h2 className="font-semibold text-[#1A1A1A] mb-4">Detalles</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#E85D3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {format(fechaInicio, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {format(fechaInicio, 'h:mm a', { locale: es })}
                      {e.fecha_fin && ` — ${format(new Date(e.fecha_fin), 'h:mm a', { locale: es })}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E85D3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{e.lugar}</p>
                    {e.direccion && <p className="text-xs text-[#6B6B6B]">{e.direccion}</p>}
                    {e.ciudad && <p className="text-xs text-[#6B6B6B]">{e.ciudad}</p>}
                  </div>
                </div>
                {e.capacidad && (
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#E85D3A] shrink-0" />
                    <p className="text-sm text-[#6B6B6B]">Capacidad: {e.capacidad} personas</p>
                  </div>
                )}
              </div>
              {!esPasado && (
                <div className="mt-5">
                  <BotonRegistrarEvento
                    eventoId={id}
                    userId={user?.id ?? null}
                    yaRegistrado={yaRegistrado}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
