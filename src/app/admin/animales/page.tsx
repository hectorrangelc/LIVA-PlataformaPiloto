import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TablaAnimales } from '@/components/admin/TablaAnimales'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import type { Animal } from '@/types'
import { Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Animales — Admin LIVA' }

interface PageProps {
  searchParams: Promise<{ especie?: string; estado?: string; busqueda?: string; pagina?: string }>
}

const POR_PAGINA = 25

async function ListaAnimales({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const pagina = parseInt(params.pagina ?? '1', 10)
  const desde = (pagina - 1) * POR_PAGINA

  let query = supabase
    .from('animales')
    .select('*', { count: 'exact' })
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .range(desde, desde + POR_PAGINA - 1)

  if (params.especie)  query = query.eq('especie', params.especie)
  if (params.estado)   query = query.eq('estado', params.estado)
  if (params.busqueda) query = query.ilike('nombre', `%${params.busqueda}%`)

  const { data: animales, count } = await query
  const total = count ?? 0

  return (
    <div>
      <TablaAnimales animales={(animales ?? []) as Animal[]} />
      {total > POR_PAGINA && (
        <div className="mt-4 flex justify-center gap-3 text-sm">
          {pagina > 1 && (
            <a href={`?${new URLSearchParams({ ...params, pagina: String(pagina - 1) })}`}
              className="px-4 py-2 border border-[#E8E0D8] rounded-lg hover:border-[#E85D3A]">
              ← Anterior
            </a>
          )}
          <span className="px-4 py-2 text-[#6B6B6B]">Pág {pagina} de {Math.ceil(total / POR_PAGINA)}</span>
          {desde + POR_PAGINA < total && (
            <a href={`?${new URLSearchParams({ ...params, pagina: String(pagina + 1) })}`}
              className="px-4 py-2 bg-[#E85D3A] text-white rounded-lg hover:bg-[#C94B2A]">
              Siguiente →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminAnimalesPage({ searchParams }: PageProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Inventario de animales</h1>
        <Link href="/admin/animales/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-[#E85D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#C94B2A]">
          <Plus className="w-4 h-4" /> Nuevo animal
        </Link>
      </div>

      <form className="flex gap-3 mb-6 flex-wrap">
        <select name="especie" className="px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm bg-white">
          <option value="">Todas las especies</option>
          <option value="perro">Perros</option>
          <option value="gato">Gatos</option>
          <option value="otro">Otros</option>
        </select>
        <select name="estado" className="px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm bg-white">
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="en_proceso">En proceso</option>
          <option value="adoptado">Adoptado</option>
          <option value="cuarentena">Cuarentena</option>
          <option value="tratamiento_medico">Tratamiento</option>
        </select>
        <input name="busqueda" type="search" placeholder="Buscar por nombre..."
          className="px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm flex-1 min-w-40" />
        <button type="submit" className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium">
          Filtrar
        </button>
      </form>

      <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
        <ListaAnimales searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
