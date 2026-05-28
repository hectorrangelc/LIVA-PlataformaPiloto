// src/app/(dashboard)/mis-solicitudes/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import type { EstadoSolicitud } from '@/types'

export const metadata: Metadata = { title: 'Mis solicitudes' }

type BadgeConfig = { label: string; color: string; Icon: typeof Clock }

const ESTADO_CONFIG: Record<EstadoSolicitud, BadgeConfig> = {
  recibida:          { label: 'Recibida',          color: 'bg-blue-100 text-blue-700',      Icon: Clock },
  en_revision:       { label: 'En revisión',       color: 'bg-yellow-100 text-yellow-700',  Icon: Clock },
  visita_programada: { label: 'Visita programada', color: 'bg-orange-100 text-orange-700',  Icon: Clock },
  aprobada:          { label: 'Aprobada',          color: 'bg-green-100 text-green-700',    Icon: CheckCircle },
  en_espera:         { label: 'En espera',         color: 'bg-gray-100 text-gray-700',      Icon: Clock },
  denegada:          { label: 'Denegada',          color: 'bg-red-100 text-red-700',        Icon: XCircle },
  contrato_firmado:  { label: 'Contrato firmado',  color: 'bg-purple-100 text-purple-700',  Icon: CheckCircle },
  completada:        { label: 'Completada',        color: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle },
}

export default async function MisSolicitudesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mis-solicitudes')

  const { data: solicitudes } = await supabase
    .from('solicitudes_adopcion')
    .select('id, estado, created_at, animales(id, nombre, foto_principal)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">
        Mis solicitudes de adopción
      </h1>

      {!solicitudes || solicitudes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E0D8]">
          <FileText className="w-12 h-12 text-[#E8E0D8] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Sin solicitudes aún</h3>
          <p className="text-[#6B6B6B] text-sm mb-4">
            Cuando solicites adoptar un animal, aparecerá aquí con su estado.
          </p>
          <Link href="/adoptar"
            className="inline-block px-5 py-2.5 bg-[#E85D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#C94B2A]">
            Ver animales en adopción
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => {
            const config = ESTADO_CONFIG[sol.estado as EstadoSolicitud]
            const { Icon } = config
            const animal = sol.animales as unknown as { id: string; nombre: string; foto_principal: string | null }
            return (
              <div key={sol.id} className="bg-white rounded-2xl border border-[#E8E0D8] p-4 flex items-center gap-4">
                {animal?.foto_principal && (
                  <img src={animal.foto_principal} alt={animal.nombre}
                    className="w-16 h-16 rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1A1A1A]">
                    <Link href={`/animales/${animal?.id}`} className="hover:text-[#E85D3A]">
                      {animal?.nombre ?? 'Animal'}
                    </Link>
                  </h3>
                  <p className="text-[#6B6B6B] text-xs mt-0.5">
                    {new Date(sol.created_at).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
