import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatearMonto, calcularPorcentaje } from '@/utils/formatters'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Campana } from '@/types'

export const metadata: Metadata = { title: 'Campañas — Admin LIVA' }

export default async function AdminCampanasPage() {
  const supabase = await createClient()
  const { data: campanas } = await supabase
    .from('campanas')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Campañas</h1>
        <Link href="/admin/campanas/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-[#E85D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#C94B2A]">
          <Plus className="w-4 h-4" /> Nueva campaña
        </Link>
      </div>

      <div className="space-y-4">
        {(!campanas || campanas.length === 0) ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E0D8]">
            <p className="text-[#9B9B9B]">Sin campañas aún. Crea la primera.</p>
          </div>
        ) : (
          (campanas as Campana[]).map((c) => {
            const pct = calcularPorcentaje(c.recaudado_mxn, c.meta_mxn)
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-[#E8E0D8] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {c.urgente && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Urgente</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {c.activa ? 'Activa' : 'Cerrada'}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1A1A1A]">{c.titulo}</h3>
                    <p className="text-sm text-[#6B6B6B] mt-0.5 line-clamp-1">{c.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#E85D3A] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-[#6B6B6B] shrink-0">
                    {formatearMonto(c.recaudado_mxn)} / {formatearMonto(c.meta_mxn)} ({pct}%)
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
