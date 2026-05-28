// src/app/(dashboard)/mis-apadrinamientos/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { formatearMonto } from '@/utils/formatters'
import type { Apadrinamiento } from '@/types'

export const metadata: Metadata = { title: 'Mis apadrinamientos' }

export default async function MisApadrinamientosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mis-apadrinamientos')

  const { data: apadrinamientos } = await supabase
    .from('apadrinamientos')
    .select('*, animales(id, nombre, foto_principal)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Mis apadrinamientos</h1>

      {!apadrinamientos || apadrinamientos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E0D8]">
          <Heart className="w-12 h-12 text-[#E8E0D8] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Sin apadrinamientos aún</h3>
          <p className="text-[#6B6B6B] text-sm mb-4">
            Cuando apadrines un animal, aparecerá aquí con el monto mensual.
          </p>
          <Link href="/donar"
            className="inline-block px-5 py-2.5 bg-[#E85D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#C94B2A]">
            Apadrinar un animal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apadrinamientos.map((ap) => {
            const a = ap as Apadrinamiento & { animales: { id: string; nombre: string; foto_principal: string | null } | null }
            return (
              <div key={ap.id} className="bg-white rounded-2xl border border-[#E8E0D8] p-4 flex items-center gap-4">
                {a.animales?.foto_principal && (
                  <img src={a.animales.foto_principal} alt={a.animales.nombre}
                    className="w-16 h-16 rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1A1A1A]">
                    <Link href={`/animales/${a.animales?.id}`} className="hover:text-[#E85D3A]">
                      {a.animales?.nombre ?? 'Animal'}
                    </Link>
                  </h3>
                  <p className="text-[#6B6B6B] text-xs mt-0.5">
                    {formatearMonto(ap.monto_mensual_mxn)}/mes
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  ap.activo
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <Heart className="w-3 h-3" />
                  {ap.activo ? 'Activo' : 'Pendiente'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
