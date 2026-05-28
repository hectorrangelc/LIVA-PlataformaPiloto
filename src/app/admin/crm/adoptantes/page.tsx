import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatearFecha } from '@/utils/formatters'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Adoptantes — Admin LIVA' }

export default async function CrmAdoptantesPage() {
  const supabase = await createClient()
  const { data: adopciones } = await supabase
    .from('solicitudes_adopcion')
    .select('id, created_at, fecha_entrega, notas_admin, users(id, nombre, apellido, email, telefono), animales(nombre, foto_principal)')
    .eq('estado', 'completada')
    .order('fecha_entrega', { ascending: false })
    .limit(100)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">CRM — Adoptantes</h1>
        <span className="text-sm text-[#6B6B6B]">{adopciones?.length ?? 0} adopciones completadas</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E0D8] bg-[#F7F7F5]">
                {['Adoptante', 'Animal', 'Fecha adopción', 'Contacto', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {(!adopciones || adopciones.length === 0) ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#9B9B9B]">Sin adopciones completadas aún</td></tr>
              ) : (
                adopciones.map((a) => {
                  const usuario = a.users as unknown as { id: string; nombre: string; apellido: string | null; email: string; telefono: string | null }
                  const animal  = a.animales as unknown as { nombre: string; foto_principal: string | null } | null
                  return (
                    <tr key={a.id} className="hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                        {usuario?.nombre} {usuario?.apellido}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {animal?.foto_principal && <img src={animal.foto_principal} alt="" className="w-7 h-7 rounded-lg object-cover" />}
                          <span className="text-[#6B6B6B]">{animal?.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#6B6B6B]">{a.fecha_entrega ? formatearFecha(a.fecha_entrega) : '—'}</td>
                      <td className="px-4 py-3 text-[#6B6B6B]">
                        <p>{usuario?.email}</p>
                        {usuario?.telefono && <p className="text-xs">{usuario.telefono}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/crm/adoptantes/${a.id}`}
                          className="text-xs text-[#E85D3A] hover:underline">
                          Ver seguimiento
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
