'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, Pencil, Stethoscope, Archive, AlertCircle } from 'lucide-react'
import { formatearFecha } from '@/utils/formatters'
import type { Animal } from '@/types'

const ESTADO_OPTS: { value: Animal['estado']; label: string }[] = [
  { value: 'disponible',         label: 'Disponible' },
  { value: 'en_proceso',         label: 'En proceso' },
  { value: 'adoptado',           label: 'Adoptado' },
  { value: 'cuarentena',         label: 'Cuarentena' },
  { value: 'tratamiento_medico', label: 'Tratamiento' },
  { value: 'en_transito',        label: 'En tránsito' },
  { value: 'fallecido',          label: 'Fallecido' },
]

const ESTADO_COLOR: Record<string, string> = {
  disponible:         'bg-green-100 text-green-700',
  en_proceso:         'bg-blue-100 text-blue-700',
  adoptado:           'bg-purple-100 text-purple-700',
  cuarentena:         'bg-yellow-100 text-yellow-700',
  tratamiento_medico: 'bg-red-100 text-red-700',
  en_transito:        'bg-orange-100 text-orange-700',
  fallecido:          'bg-gray-100 text-gray-500',
}

interface Props { animales: Animal[] }

export function TablaAnimales({ animales: inicial }: Props) {
  const [animales, setAnimales] = useState(inicial)
  const router = useRouter()

  async function patchAnimal(id: string, data: Record<string, unknown>) {
    const res = await fetch(`/api/admin/animales/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('Error al actualizar'); return }
    setAnimales(prev => prev.map(a => a.id === id ? { ...a, ...data } as Animal : a))
    toast.success('Actualizado')
  }

  async function archivar(id: string) {
    if (!confirm('¿Archivar este animal? Dejará de ser visible en el sitio.')) return
    await patchAnimal(id, { visible: false })
    setAnimales(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E0D8] bg-[#F7F7F5]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Animal</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Especie</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Ciudad</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Ingreso</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Urgente</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F0EB]">
            {animales.map((animal) => (
              <tr key={animal.id} className="hover:bg-[#FAFAF8] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {animal.foto_principal
                      ? <img src={animal.foto_principal} alt={animal.nombre} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      : <div className="w-9 h-9 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-lg shrink-0">🐾</div>
                    }
                    <span className="font-medium text-[#1A1A1A]">{animal.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6B6B6B] capitalize">{animal.especie}</td>
                <td className="px-4 py-3">
                  <select
                    value={animal.estado}
                    onChange={(e) => patchAnimal(animal.id, { estado: e.target.value })}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ESTADO_COLOR[animal.estado] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {ESTADO_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-[#6B6B6B]">{animal.ciudad_rescate ?? '—'}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">{animal.fecha_ingreso ? formatearFecha(animal.fecha_ingreso) : '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => patchAnimal(animal.id, { urgente: !animal.urgente })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      animal.urgente ? 'bg-red-100 text-red-600' : 'bg-[#F5F0EB] text-[#9B9B9B] hover:text-red-500'
                    }`}
                    title={animal.urgente ? 'Quitar urgencia' : 'Marcar urgente'}
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/animales/${animal.id}`} target="_blank" rel="noopener"
                      className="w-8 h-8 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                      title="Ver perfil público">
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => router.push(`/admin/animales/${animal.id}/editar`)}
                      className="w-8 h-8 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-[#6B6B6B] hover:text-[#E85D3A] transition-colors"
                      title="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => router.push(`/admin/animales/${animal.id}/medico`)}
                      className="w-8 h-8 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-[#6B6B6B] hover:text-blue-500 transition-colors"
                      title="Historial médico">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => archivar(animal.id)}
                      className="w-8 h-8 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-[#6B6B6B] hover:text-red-500 transition-colors"
                      title="Archivar">
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {animales.length === 0 && (
          <p className="text-center py-12 text-[#9B9B9B] text-sm">No se encontraron animales</p>
        )}
      </div>
    </div>
  )
}
