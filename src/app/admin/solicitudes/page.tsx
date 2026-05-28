import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { KanbanSolicitudes } from '@/components/admin/KanbanSolicitudes'
import type { EstadoSolicitud } from '@/types'

export const metadata: Metadata = { title: 'Solicitudes — Admin LIVA' }

type SolicitudResumen = {
  id: string
  estado: EstadoSolicitud
  created_at: string
  animales: { nombre: string; foto_principal: string | null } | null
  users: { nombre: string; apellido: string | null } | null
}

export default async function AdminSolicitudesPage() {
  const supabase = await createClient()
  const { data: solicitudes } = await supabase
    .from('solicitudes_adopcion')
    .select('id, estado, created_at, animales(nombre, foto_principal), users(nombre, apellido)')
    .not('estado', 'in', '("denegada","completada")')
    .order('created_at', { ascending: true })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Pipeline de adopciones</h1>
        <p className="text-[#6B6B6B] text-sm mt-0.5">Arrastra las tarjetas para cambiar el estado de la solicitud</p>
      </div>
      <KanbanSolicitudes solicitudes={(solicitudes ?? []) as SolicitudResumen[]} />
    </div>
  )
}
