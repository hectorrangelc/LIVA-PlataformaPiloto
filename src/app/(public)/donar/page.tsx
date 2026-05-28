// src/app/(public)/donar/page.tsx
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SelectorMonto } from '@/components/donaciones/SelectorMonto'
import { ProgresoCapana } from '@/components/donaciones/ProgresoCapana'
import { DatosTransferencia } from '@/components/donaciones/DatosTransferencia'
import { AnimalCard } from '@/components/animales/AnimalCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import type { Campana, Animal } from '@/types'
import { Heart, Zap, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Donar',
  description: 'Apoya a LIVA y salva vidas. Dona una vez o conviértete en padrino mensual de un animal rescatado.',
}

async function SeccionCampanas() {
  const supabase = await createClient()
  const { data: campanas } = await supabase
    .from('campanas')
    .select('*')
    .eq('activa', true)
    .order('urgente', { ascending: false })
    .limit(3)

  if (!campanas || campanas.length === 0) return null

  const { data: conteos } = await supabase
    .from('donaciones')
    .select('campana_id')
    .in('campana_id', campanas.map(c => c.id))
    .eq('estado', 'completada')

  const donadores = campanas.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = conteos?.filter(d => d.campana_id === c.id).length ?? 0
    return acc
  }, {})

  return (
    <section className="py-12 bg-white border-b border-[#E8E0D8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-[#E85D3A]" />
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Campañas activas</h2>
        </div>
        <p className="text-[#6B6B6B] mb-8">Cada peso va directo a quienes más lo necesitan.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campanas.map((campana) => (
            <div key={campana.id} className="flex flex-col gap-4">
              <ProgresoCapana
                campana={campana as Campana}
                numDonadores={donadores[campana.id]}
              />
              <SelectorMonto campanaId={campana.id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

async function SeccionApadrinamiento() {
  const supabase = await createClient()
  const { data: animales } = await supabase
    .from('animales')
    .select('id, nombre, especie, categoria_edad, edad_meses, sexo, foto_principal, estado, ciudad_rescate, urgente, apadrinado')
    .eq('visible', true)
    .eq('estado', 'disponible')
    .eq('apadrinado', false)
    .order('urgente', { ascending: false })
    .limit(6)

  if (!animales || animales.length === 0) return null

  return (
    <section className="py-12 bg-[#FFFBF7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-[#E85D3A]" />
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Apadrinar un animal</h2>
        </div>
        <p className="text-[#6B6B6B] mb-8">
          Con $100–$500 al mes cubres sus gastos de alimentación y atención veterinaria.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animales.map((animal) => (
            <AnimalCard key={animal.id} animal={animal as Animal} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkeletonSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 max-w-7xl mx-auto px-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  )
}

export default function DonarPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div className="bg-white border-b border-[#E8E0D8] py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-lora text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
            Tu apoyo salva vidas 🐾
          </h1>
          <p className="text-[#6B6B6B] text-lg max-w-xl">
            LIVA es una ONG 100% autofinanciada. Cada donación va directo al cuidado
            de los animales rescatados en México.
          </p>
        </div>
      </div>

      <section className="py-12 bg-[#FFFBF7] border-b border-[#E8E0D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">Dona ahora</h2>
              <p className="text-[#6B6B6B] mb-6">
                Elige el monto que puedas. Cada peso cuenta para vacunas,
                atención veterinaria, alimento y rescates de emergencia.
              </p>
              <div className="space-y-2 text-sm text-[#6B6B6B]">
                {[
                  { monto: '$100', uso: 'Vacunas completas para 1 animal' },
                  { monto: '$250', uso: 'Desparasitación + vitaminas' },
                  { monto: '$500', uso: 'Esterilización de emergencia' },
                  { monto: '$1,000', uso: 'Semana de atención veterinaria' },
                ].map(({ monto, uso }) => (
                  <div key={monto} className="flex gap-2">
                    <span className="font-bold text-[#E85D3A] w-16 shrink-0">{monto}</span>
                    <span>{uso}</span>
                  </div>
                ))}
              </div>
            </div>
            <SelectorMonto />
          </div>
        </div>
      </section>

      <Suspense fallback={<SkeletonSection />}>
        <SeccionCampanas />
      </Suspense>

      <Suspense fallback={<SkeletonSection />}>
        <SeccionApadrinamiento />
      </Suspense>

      <section className="py-12 bg-white border-t border-[#E8E0D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-[#E85D3A]" />
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Transferencia bancaria</h2>
              </div>
              <p className="text-[#6B6B6B]">
                Prefiero transferir directo. Usa los datos bancarios y sube tu comprobante
                para que podamos confirmarlo.
              </p>
            </div>
            <DatosTransferencia />
          </div>
        </div>
      </section>
    </div>
  )
}
