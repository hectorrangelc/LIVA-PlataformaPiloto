// app/(public)/adoptar/page.tsx
// Catálogo de animales con filtros sincronizados en URL
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AnimalCard } from '@/components/animales/AnimalCard'
import { FiltrosAnimales } from '@/components/animales/FiltrosAnimales'
import { Skeleton } from '@/components/ui/skeleton'
import { PawPrint } from 'lucide-react'
import type { Animal } from '@/types'

export const metadata: Metadata = {
  title: 'Adoptar',
  description: 'Encuentra a tu compañero ideal. Perros, gatos y más animales esperan un hogar en LIVA.',
}

// Número de animales por página
const POR_PAGINA = 12

interface PageProps {
  searchParams: Promise<{
    especie?: string
    categoria_edad?: string
    sexo?: string
    compatible_ninos?: string
    compatible_animales?: string
    apto_departamento?: string
    ciudad_rescate?: string
    busqueda?: string
    pagina?: string
  }>
}

async function ListaAnimales({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const pagina = parseInt(params.pagina ?? '1', 10)
  const desde = (pagina - 1) * POR_PAGINA

  // Construir query con filtros
  let query = supabase
    .from('animales')
    .select('id, nombre, especie, categoria_edad, edad_meses, sexo, foto_principal, estado, ciudad_rescate, urgente, apadrinado', { count: 'exact' })
    .eq('visible', true)
    .eq('estado', 'disponible')
    .order('urgente', { ascending: false })
    .order('created_at', { ascending: false })
    .range(desde, desde + POR_PAGINA - 1)

  // Aplicar filtros opcionales
  if (params.especie) query = query.eq('especie', params.especie)
  if (params.categoria_edad) query = query.eq('categoria_edad', params.categoria_edad)
  if (params.sexo) query = query.eq('sexo', params.sexo)
  if (params.compatible_ninos === 'true') query = query.eq('compatible_ninos', true)
  if (params.compatible_animales === 'true') query = query.eq('compatible_animales', true)
  if (params.apto_departamento === 'true') query = query.eq('apto_departamento', true)
  if (params.ciudad_rescate) query = query.eq('ciudad_rescate', params.ciudad_rescate)
  if (params.busqueda) query = query.ilike('nombre', `%${params.busqueda}%`)

  const { data: animales, count } = await query

  const total = count ?? 0
  const hayMas = desde + POR_PAGINA < total

  if (!animales || animales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF0EC]">
          <PawPrint className="h-10 w-10 text-[#E85D3A]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
          No encontramos animales
        </h3>
        <p className="text-[#6B6B6B] max-w-sm">
          Intenta ajustar los filtros o vuelve pronto — ¡rescatamos animales constantemente!
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Grid de animales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {animales.map((animal) => (
          <AnimalCard key={animal.id} animal={animal as Animal} />
        ))}
      </div>

      {/* Paginación */}
      {total > POR_PAGINA && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {pagina > 1 && (
            <a
              href={`?${new URLSearchParams({ ...params, pagina: String(pagina - 1) }).toString()}`}
              className="px-5 py-2.5 rounded-xl border border-[#E8E0D8] text-sm font-medium text-[#1A1A1A] hover:border-[#E85D3A] hover:text-[#E85D3A] transition-colors"
            >
              ← Anterior
            </a>
          )}
          <span className="text-sm text-[#6B6B6B]">
            Página {pagina} de {Math.ceil(total / POR_PAGINA)}
          </span>
          {hayMas && (
            <a
              href={`?${new URLSearchParams({ ...params, pagina: String(pagina + 1) }).toString()}`}
              className="px-5 py-2.5 rounded-xl bg-[#E85D3A] text-white text-sm font-semibold hover:bg-[#C94B2A] transition-colors"
            >
              Siguiente →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-card">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdoptarPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      {/* Header de la sección */}
      <div className="bg-white border-b border-[#E8E0D8] py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-lora text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
            Animales en adopción 🐾
          </h1>
          <p className="text-[#6B6B6B] text-lg">
            Cada uno tiene una historia. ¿Cuál te toca el corazón?
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros desktop */}
          <aside className="w-full lg:w-72 shrink-0">
            <Suspense>
              <FiltrosAnimales />
            </Suspense>
          </aside>

          {/* Lista de animales */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<SkeletonGrid />}>
              <ListaAnimales searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
