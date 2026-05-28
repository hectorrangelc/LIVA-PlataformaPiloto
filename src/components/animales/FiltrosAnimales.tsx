'use client'
// components/animales/FiltrosAnimales.tsx
// Panel de filtros del catálogo — sincronizado con URL params

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FiltrosAnimales as TipoFiltros } from '@/types'

interface FiltrosAnimalesProps {
  totalResultados?: number
}

const CIUDADES_MX = [
  'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla',
  'Tijuana', 'León', 'Querétaro', 'San Luis Potosí', 'Mérida', 'Toluca',
]

export function FiltrosAnimales({ totalResultados }: FiltrosAnimalesProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [busqueda, setBusqueda] = useState(searchParams.get('busqueda') ?? '')
  const [panelAbierto, setPanelAbierto] = useState(false)

  // Leer filtros actuales desde URL
  const filtrosActuales: TipoFiltros = {
    especie: (searchParams.get('especie') as TipoFiltros['especie']) || undefined,
    categoria_edad: (searchParams.get('categoria_edad') as TipoFiltros['categoria_edad']) || undefined,
    sexo: (searchParams.get('sexo') as TipoFiltros['sexo']) || undefined,
    compatible_ninos: searchParams.get('compatible_ninos') === 'true' || undefined,
    compatible_animales: searchParams.get('compatible_animales') === 'true' || undefined,
    apto_departamento: searchParams.get('apto_departamento') === 'true' || undefined,
    ciudad_rescate: searchParams.get('ciudad_rescate') || undefined,
    busqueda: searchParams.get('busqueda') || undefined,
  }

  const filtrosActivos = Object.values(filtrosActuales).filter(Boolean).length

  // Actualizar URL con nuevos filtros
  const actualizarFiltro = useCallback(
    (nombre: string, valor: string | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (valor === null || valor === '' || valor === false) {
        params.delete(nombre)
      } else {
        params.set(nombre, String(valor))
      }
      params.delete('pagina') // Resetear paginación
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const limpiarFiltros = () => {
    setBusqueda('')
    router.push(pathname)
  }

  // Búsqueda con debounce manual
  let timerId: NodeJS.Timeout
  const manejarBusqueda = (valor: string) => {
    setBusqueda(valor)
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      actualizarFiltro('busqueda', valor || null)
    }, 300)
  }

  // Panel de filtros (reutilizable en desktop y mobile)
  const PanelFiltros = () => (
    <div className="flex flex-col gap-6">
      {/* Especie */}
      <div>
        <Label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">Especie</Label>
        <div className="flex gap-2 flex-wrap">
          {[
            { valor: '', label: 'Todos', emoji: '🐾' },
            { valor: 'perro', label: 'Perros', emoji: '🐕' },
            { valor: 'gato', label: 'Gatos', emoji: '🐱' },
            { valor: 'otro', label: 'Otros', emoji: '🐾' },
          ].map((op) => (
            <button
              key={op.valor}
              onClick={() => actualizarFiltro('especie', op.valor || null)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all
                ${(filtrosActuales.especie ?? '') === op.valor
                  ? 'bg-[#E85D3A] text-white border-[#E85D3A]'
                  : 'bg-white text-[#6B6B6B] border-[#E8E0D8] hover:border-[#E85D3A] hover:text-[#E85D3A]'
                }`}
            >
              <span>{op.emoji}</span>
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Edad */}
      <div>
        <Label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">Edad</Label>
        <Select
          value={filtrosActuales.categoria_edad ?? ''}
          onValueChange={(v) => actualizarFiltro('categoria_edad', v || null)}
        >
          <SelectTrigger className="rounded-xl border-[#E8E0D8]">
            <SelectValue placeholder="Cualquier edad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Cualquier edad</SelectItem>
            <SelectItem value="cachorro">🍼 Cachorro (0–12 meses)</SelectItem>
            <SelectItem value="joven">🌱 Joven (1–2 años)</SelectItem>
            <SelectItem value="adulto">🌟 Adulto (3–7 años)</SelectItem>
            <SelectItem value="senior">🌿 Senior (8+ años)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sexo */}
      <div>
        <Label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">Sexo</Label>
        <div className="flex gap-2">
          {[
            { valor: '', label: 'Todos' },
            { valor: 'macho', label: '♂ Macho' },
            { valor: 'hembra', label: '♀ Hembra' },
          ].map((op) => (
            <button
              key={op.valor}
              onClick={() => actualizarFiltro('sexo', op.valor || null)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                ${(filtrosActuales.sexo ?? '') === op.valor
                  ? 'bg-[#E85D3A] text-white border-[#E85D3A]'
                  : 'bg-white text-[#6B6B6B] border-[#E8E0D8] hover:border-[#E85D3A]'
                }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ciudad */}
      <div>
        <Label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">Ciudad</Label>
        <Select
          value={filtrosActuales.ciudad_rescate ?? ''}
          onValueChange={(v) => actualizarFiltro('ciudad_rescate', v || null)}
        >
          <SelectTrigger className="rounded-xl border-[#E8E0D8]">
            <SelectValue placeholder="Cualquier ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Cualquier ciudad</SelectItem>
            {CIUDADES_MX.map((ciudad) => (
              <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Compatibilidades */}
      <div>
        <Label className="text-sm font-semibold text-[#1A1A1A] mb-3 block">Compatibilidades</Label>
        <div className="flex flex-col gap-3">
          {[
            { campo: 'compatible_ninos', label: '👶 Compatible con niños' },
            { campo: 'compatible_animales', label: '🐾 Compatible con otros animales' },
            { campo: 'apto_departamento', label: '🏠 Apto para departamento' },
          ].map(({ campo, label }) => (
            <div key={campo} className="flex items-center gap-3">
              <Checkbox
                id={campo}
                checked={!!filtrosActuales[campo as keyof TipoFiltros]}
                onCheckedChange={(checked) =>
                  actualizarFiltro(campo, checked ? true : null)
                }
                className="data-[state=checked]:bg-[#E85D3A] data-[state=checked]:border-[#E85D3A]"
              />
              <label htmlFor={campo} className="text-sm text-[#1A1A1A] cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Limpiar filtros */}
      {filtrosActivos > 0 && (
        <Button
          variant="ghost"
          onClick={limpiarFiltros}
          className="w-full text-[#E85D3A] hover:bg-[#FEF0EC] rounded-xl"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros ({filtrosActivos})
        </Button>
      )}
    </div>
  )

  return (
    <div className="w-full">
      {/* Barra de búsqueda + controles */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
          <Input
            id="busqueda-animales"
            type="search"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => manejarBusqueda(e.target.value)}
            className="pl-10 rounded-xl border-[#E8E0D8] bg-white focus:border-[#E85D3A] focus:ring-[#E85D3A]/20"
          />
        </div>

        {/* Botón filtros mobile */}
        <Sheet open={panelAbierto} onOpenChange={setPanelAbierto}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="lg:hidden rounded-xl border-[#E8E0D8] gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {filtrosActivos > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E85D3A] text-white text-xs font-bold">
                  {filtrosActivos}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-[#FFFBF7] border-r border-[#E8E0D8]">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-[#1A1A1A]">Filtros</SheetTitle>
            </SheetHeader>
            <PanelFiltros />
          </SheetContent>
        </Sheet>

        {/* Indicador de resultados */}
        {totalResultados !== undefined && (
          <div className="flex items-center text-sm text-[#6B6B6B] whitespace-nowrap self-center">
            <span className="font-semibold text-[#1A1A1A]">{totalResultados}</span>
            &nbsp;{totalResultados === 1 ? 'animal' : 'animales'}
          </div>
        )}
      </div>

      {/* Panel de filtros desktop (sidebar) */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#E85D3A]" />
              Filtros
              {filtrosActivos > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E85D3A] text-white text-xs font-bold">
                  {filtrosActivos}
                </span>
              )}
            </h2>
          </div>
          <PanelFiltros />
        </div>
      </div>
    </div>
  )
}
