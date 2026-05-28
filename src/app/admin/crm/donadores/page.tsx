import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatearMonto, formatearFecha } from '@/utils/formatters'

export const metadata: Metadata = { title: 'Donadores — Admin LIVA' }

export default async function CrmDonadoresPage() {
  const supabase = await createClient()
  const { data: donaciones } = await supabase
    .from('donaciones')
    .select('id, monto_mxn, tipo, canal, estado, created_at, users(nombre, apellido, email)')
    .eq('estado', 'completada')
    .order('created_at', { ascending: false })
    .limit(200)

  const porUsuario = (donaciones ?? []).reduce<Record<string, {
    nombre: string; email: string; total: number; count: number; ultima: string; tipo: string
  }>>((acc, d) => {
    const u = d.users as unknown as { nombre: string; apellido: string | null; email: string } | null
    const key = u?.email ?? `anonimo-${d.id}`
    const nombre = u ? `${u.nombre} ${u.apellido ?? ''}`.trim() : 'Anónimo'
    if (!acc[key]) acc[key] = { nombre, email: u?.email ?? '—', total: 0, count: 0, ultima: d.created_at, tipo: d.tipo }
    acc[key].total += d.monto_mxn
    acc[key].count += 1
    if (d.created_at > acc[key].ultima) { acc[key].ultima = d.created_at; acc[key].tipo = d.tipo }
    return acc
  }, {})

  const donadores = Object.values(porUsuario).sort((a, b) => b.total - a.total)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">CRM — Donadores</h1>
        <span className="text-sm text-[#6B6B6B]">{donadores.length} donadores únicos</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E0D8] bg-[#F7F7F5]">
                {['Donador','Email','Total donado','# Donaciones','Tipo','Última donación'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {donadores.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-[#9B9B9B]">Sin donaciones completadas aún</td></tr>
              ) : (
                donadores.map((d, i) => (
                  <tr key={i} className="hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{d.nombre}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{d.email}</td>
                    <td className="px-4 py-3 font-semibold text-[#E85D3A]">{formatearMonto(d.total)}</td>
                    <td className="px-4 py-3 text-center text-[#6B6B6B]">{d.count}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        d.tipo === 'recurrente' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>{d.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-[#9B9B9B]">{formatearFecha(d.ultima)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
