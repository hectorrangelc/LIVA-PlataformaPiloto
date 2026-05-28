'use client'
import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'
import { formatearFecha } from '@/utils/formatters'
import type { EstadoSolicitud } from '@/types'

const COLUMNAS: { id: EstadoSolicitud; label: string; color: string }[] = [
  { id: 'recibida',          label: 'Recibida',       color: 'border-blue-300' },
  { id: 'en_revision',       label: 'En revisión',    color: 'border-yellow-300' },
  { id: 'visita_programada', label: 'Visita prog.',   color: 'border-orange-300' },
  { id: 'aprobada',          label: 'Aprobada',       color: 'border-green-300' },
  { id: 'contrato_firmado',  label: 'Contrato',       color: 'border-purple-300' },
  { id: 'completada',        label: 'Completada',     color: 'border-emerald-300' },
]

type SolicitudResumen = {
  id: string
  estado: EstadoSolicitud
  created_at: string
  animales: { nombre: string; foto_principal: string | null } | null
  users: { nombre: string; apellido: string | null } | null
}

function TarjetaKanban({ sol }: { sol: SolicitudResumen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: sol.id })
  const style = { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }
  const dias = Math.floor((Date.now() - new Date(sol.created_at).getTime()) / 86400000)

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className="bg-white rounded-xl border border-[#E8E0D8] p-3 cursor-grab active:cursor-grabbing select-none">
      <div className="flex items-center gap-2 mb-2">
        {sol.animales?.foto_principal && (
          <img src={sol.animales.foto_principal} alt={sol.animales.nombre}
            className="w-8 h-8 rounded-lg object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#1A1A1A] truncate">{sol.animales?.nombre}</p>
          <p className="text-xs text-[#9B9B9B] truncate">{sol.users?.nombre} {sol.users?.apellido}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#9B9B9B]">{formatearFecha(sol.created_at)}</span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
          dias > 7 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {dias === 0 ? 'Hoy' : `${dias}d`}
        </span>
      </div>
    </div>
  )
}

function ColumnaKanban({ col, cards }: { col: typeof COLUMNAS[0]; cards: SolicitudResumen[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })
  return (
    <div className="flex-1 min-w-[180px]">
      <div className={`rounded-t-xl border-t-2 px-3 py-2 bg-[#F7F7F5] border-x border-[#E8E0D8] ${col.color}`}>
        <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">{col.label}</p>
        <p className="text-lg font-bold text-[#1A1A1A]">{cards.length}</p>
      </div>
      <div ref={setNodeRef}
        className={`min-h-[300px] space-y-2 p-2 border border-t-0 border-[#E8E0D8] rounded-b-xl transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-[#FAFAF8]'
        }`}>
        {cards.map(s => <TarjetaKanban key={s.id} sol={s} />)}
      </div>
    </div>
  )
}

export function KanbanSolicitudes({ solicitudes: inicial }: { solicitudes: SolicitudResumen[] }) {
  const [solicitudes, setSolicitudes] = useState(inicial)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const columnas = COLUMNAS.reduce<Record<string, SolicitudResumen[]>>((acc, col) => {
    acc[col.id] = solicitudes.filter(s => s.estado === col.id)
    return acc
  }, {})

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  async function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const nuevoEstado = over.id as EstadoSolicitud
    const solicitud = solicitudes.find(s => s.id === active.id)
    if (!solicitud || solicitud.estado === nuevoEstado) return

    setSolicitudes(prev => prev.map(s => s.id === active.id ? { ...s, estado: nuevoEstado } : s))

    const res = await fetch(`/api/admin/solicitudes/${active.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    if (!res.ok) {
      setSolicitudes(prev => prev.map(s => s.id === active.id ? { ...s, estado: solicitud.estado } : s))
      toast.error('Error al actualizar el estado')
    } else {
      toast.success(`Movido a: ${COLUMNAS.find(c => c.id === nuevoEstado)?.label}`)
    }
  }

  const activeCard = activeId ? solicitudes.find(s => s.id === activeId) : null

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNAS.map(col => (
          <ColumnaKanban key={col.id} col={col} cards={columnas[col.id] ?? []} />
        ))}
      </div>
      <DragOverlay>
        {activeCard && <TarjetaKanban sol={activeCard} />}
      </DragOverlay>
    </DndContext>
  )
}
