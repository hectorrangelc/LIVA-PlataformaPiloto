import { createAdminClient } from '@/lib/supabase/server'

export interface DatosReporte {
  animales_rescatados: number
  animales_adoptados: number
  solicitudes_recibidas: number
  solicitudes_aprobadas: number
  solicitudes_denegadas: number
  tasa_exito_porcentaje: number
  animales_en_espera: number
  animales_en_tratamiento: number
  total_donaciones_mxn: number
  nuevos_donadores: number
  apadrinamientos_activos: number
  nuevos_usuarios: number
  eventos_realizados: number
}

export async function generarReporte(mes: number, anio: number): Promise<DatosReporte> {
  const supabase = await createAdminClient()
  const inicio = new Date(anio, mes - 1, 1).toISOString()
  const fin    = new Date(anio, mes, 0, 23, 59, 59).toISOString()

  const [
    { count: rescatados },
    { count: adoptados },
    { count: solicitudes },
    { count: aprobadas },
    { count: denegadas },
    { count: enEspera },
    { count: enTratamiento },
    { data: donaciones },
    { count: nuevosUsuarios },
    { count: apadrinamientos },
    { count: eventos },
  ] = await Promise.all([
    supabase.from('animales').select('*', { count: 'exact', head: true }).gte('created_at', inicio).lte('created_at', fin),
    supabase.from('animales').select('*', { count: 'exact', head: true }).eq('estado', 'adoptado').gte('updated_at', inicio).lte('updated_at', fin),
    supabase.from('solicitudes_adopcion').select('*', { count: 'exact', head: true }).gte('created_at', inicio).lte('created_at', fin),
    supabase.from('solicitudes_adopcion').select('*', { count: 'exact', head: true }).eq('estado', 'completada').gte('created_at', inicio).lte('created_at', fin),
    supabase.from('solicitudes_adopcion').select('*', { count: 'exact', head: true }).eq('estado', 'denegada').gte('created_at', inicio).lte('created_at', fin),
    supabase.from('animales').select('*', { count: 'exact', head: true }).eq('estado', 'en_proceso'),
    supabase.from('animales').select('*', { count: 'exact', head: true }).eq('estado', 'tratamiento_medico'),
    supabase.from('donaciones').select('monto_mxn, user_id').eq('estado', 'completada').gte('created_at', inicio).lte('created_at', fin),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', inicio).lte('created_at', fin),
    supabase.from('apadrinamientos').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('eventos').select('*', { count: 'exact', head: true }).gte('fecha_inicio', inicio).lte('fecha_inicio', fin),
  ])

  const totalDonaciones = (donaciones ?? []).reduce((s, d) => s + (d.monto_mxn ?? 0), 0)
  const donadoresUnicos = new Set((donaciones ?? []).filter(d => d.user_id).map(d => d.user_id)).size
  const sol = solicitudes ?? 0
  const apr = aprobadas ?? 0

  return {
    animales_rescatados:      rescatados ?? 0,
    animales_adoptados:       adoptados ?? 0,
    solicitudes_recibidas:    sol,
    solicitudes_aprobadas:    apr,
    solicitudes_denegadas:    denegadas ?? 0,
    tasa_exito_porcentaje:    sol > 0 ? Math.round((apr / sol) * 100) : 0,
    animales_en_espera:       enEspera ?? 0,
    animales_en_tratamiento:  enTratamiento ?? 0,
    total_donaciones_mxn:     totalDonaciones,
    nuevos_donadores:         donadoresUnicos,
    apadrinamientos_activos:  apadrinamientos ?? 0,
    nuevos_usuarios:          nuevosUsuarios ?? 0,
    eventos_realizados:       eventos ?? 0,
  }
}
