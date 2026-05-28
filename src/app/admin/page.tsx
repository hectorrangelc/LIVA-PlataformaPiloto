import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/admin/MetricCard'
import { formatearMonto, formatearFecha } from '@/utils/formatters'
import {
  PawPrint, Heart, Clock, Stethoscope,
  ClipboardList, TrendingUp, Banknote, UserPlus
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard — Admin LIVA' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [
    { count: rescatadosMes },
    { count: adoptadosMes },
    { count: enEspera },
    { count: enTratamiento },
    { count: solicitudesMes },
    { data: donacionesMes },
    { count: usuariosMes },
    { data: solicitudesPendientes },
  ] = await Promise.all([
    supabase.from('animales').select('*', { count: 'exact', head: true }).gte('created_at', inicioMes),
    supabase.from('animales').select('*', { count: 'exact', head: true }).eq('estado', 'adoptado').gte('updated_at', inicioMes),
    supabase.from('animales').select('*', { count: 'exact', head: true }).eq('estado', 'en_proceso'),
    supabase.from('animales').select('*', { count: 'exact', head: true }).eq('estado', 'tratamiento_medico'),
    supabase.from('solicitudes_adopcion').select('*', { count: 'exact', head: true }).gte('created_at', inicioMes),
    supabase.from('donaciones').select('monto_mxn').eq('estado', 'completada').gte('created_at', inicioMes),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', inicioMes),
    supabase.from('solicitudes_adopcion')
      .select('id, estado, created_at, animales(nombre, foto_principal), users(nombre, apellido)')
      .in('estado', ['recibida', 'en_revision'])
      .order('created_at', { ascending: true })
      .limit(8),
  ])

  const totalDonaciones = donacionesMes?.reduce((sum, d) => sum + (d.monto_mxn ?? 0), 0) ?? 0
  const totalSols = solicitudesMes ?? 0
  const { count: completadas } = await supabase
    .from('solicitudes_adopcion')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'completada')
    .gte('created_at', inicioMes)
  const tasaExito = totalSols > 0 ? Math.round(((completadas ?? 0) / totalSols) * 100) : 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#6B6B6B] text-sm mt-0.5">
          {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })} — métricas en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard titulo="Rescatados este mes" valor={rescatadosMes ?? 0} icon={PawPrint} color="coral" />
        <MetricCard titulo="Adoptados este mes"  valor={adoptadosMes ?? 0} icon={Heart}    color="green" />
        <MetricCard titulo="En proceso"          valor={enEspera ?? 0}    icon={Clock}    color="blue" />
        <MetricCard titulo="En tratamiento"      valor={enTratamiento ?? 0} icon={Stethoscope} color="yellow" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard titulo="Solicitudes este mes"    valor={solicitudesMes ?? 0}          icon={ClipboardList} color="blue" />
        <MetricCard titulo="Tasa de éxito"           valor={`${tasaExito}%`}              icon={TrendingUp}    color="green" />
        <MetricCard titulo="Donaciones este mes"     valor={formatearMonto(totalDonaciones)} icon={Banknote}   color="coral" />
        <MetricCard titulo="Nuevos usuarios"         valor={usuariosMes ?? 0}             icon={UserPlus}      color="yellow" />
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E0D8]">
          <h2 className="font-semibold text-[#1A1A1A]">Solicitudes pendientes</h2>
          <Link href="/admin/solicitudes" className="text-sm text-[#E85D3A] hover:underline">
            Ver kanban →
          </Link>
        </div>
        <div className="divide-y divide-[#F5F0EB]">
          {!solicitudesPendientes || solicitudesPendientes.length === 0 ? (
            <p className="text-center py-8 text-[#6B6B6B] text-sm">No hay solicitudes pendientes</p>
          ) : (
            solicitudesPendientes.map((sol) => {
              const animal = sol.animales as unknown as { nombre: string; foto_principal: string | null } | null
              const usuario = sol.users as unknown as { nombre: string; apellido: string | null } | null
              const diasEspera = Math.floor((Date.now() - new Date(sol.created_at).getTime()) / 86400000)
              return (
                <div key={sol.id} className="flex items-center gap-4 px-5 py-3">
                  {animal?.foto_principal && (
                    <img src={animal.foto_principal} alt={animal.nombre}
                      className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">
                      {usuario?.nombre} {usuario?.apellido} → {animal?.nombre}
                    </p>
                    <p className="text-xs text-[#9B9B9B]">{formatearFecha(sol.created_at)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    diasEspera > 7 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {diasEspera === 0 ? 'Hoy' : `${diasEspera}d`}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    sol.estado === 'recibida' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {sol.estado === 'recibida' ? 'Recibida' : 'En revisión'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
