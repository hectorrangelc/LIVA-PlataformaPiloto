'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatearFecha, formatearMonto } from '@/utils/formatters'
import { Plus } from 'lucide-react'

const TIPO_OPTS = ['consulta','vacuna','cirugia','desparasitacion','laboratorio','tratamiento','revision'] as const

const TIPO_COLOR: Record<string, string> = {
  consulta:        'bg-blue-100 text-blue-700',
  vacuna:          'bg-green-100 text-green-700',
  cirugia:         'bg-red-100 text-red-700',
  desparasitacion: 'bg-yellow-100 text-yellow-700',
  laboratorio:     'bg-purple-100 text-purple-700',
  tratamiento:     'bg-orange-100 text-orange-700',
  revision:        'bg-gray-100 text-gray-700',
}

const esquema = z.object({
  fecha: z.string().min(1, 'Requerido'),
  tipo: z.enum(TIPO_OPTS),
  descripcion: z.string().min(1, 'Requerido'),
  veterinario: z.string().optional(),
  costo_mxn: z.string().optional(),
  notas: z.string().optional(),
})

type Campos = {
  fecha: string
  tipo: typeof TIPO_OPTS[number]
  descripcion: string
  veterinario?: string
  costo_mxn?: string
  notas?: string
}

type RegistroMedico = {
  id: string
  fecha: string
  tipo: string
  descripcion: string
  veterinario?: string | null
  costo_mxn?: number | null
  notas?: string | null
}

export default function HistorialMedicoPage() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const [historial, setHistorial] = useState<RegistroMedico[]>([])
  const [animalNombre, setAnimalNombre] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Campos>({
    resolver: zodResolver(esquema),
    defaultValues: { fecha: new Date().toISOString().split('T')[0], tipo: 'consulta' },
  })

  useEffect(() => {
    supabase.from('animales').select('nombre').eq('id', id).single()
      .then(({ data }) => { if (data) setAnimalNombre(data.nombre) })
    supabase.from('historial_medico').select('*').eq('animal_id', id).order('fecha', { ascending: false })
      .then(({ data }) => { if (data) setHistorial(data as RegistroMedico[]) })
  }, [id])

  async function onSubmit(data: Campos) {
    const payload = {
      ...data,
      animal_id: id,
      costo_mxn: data.costo_mxn !== '' && data.costo_mxn !== undefined ? Number(data.costo_mxn) : undefined,
    }
    const res = await fetch('/api/admin/historial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) { toast.error('Error al guardar'); return }
    toast.success('Registro médico agregado')
    const { data: nuevos } = await supabase
      .from('historial_medico').select('*').eq('animal_id', id).order('fecha', { ascending: false })
    if (nuevos) setHistorial(nuevos as RegistroMedico[])
    reset({ fecha: new Date().toISOString().split('T')[0], tipo: 'consulta' })
    setMostrarForm(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Historial médico</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{animalNombre}</p>
        </div>
        <Button onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-[#E85D3A] hover:bg-[#C94B2A] text-white">
          <Plus className="w-4 h-4 mr-1" /> Nuevo registro
        </Button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-[#E8E0D8] p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#1A1A1A]">Nuevo registro médico</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha *</Label>
              <Input type="date" {...register('fecha')} className="mt-1" />
              {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha.message}</p>}
            </div>
            <div>
              <Label>Tipo *</Label>
              <select {...register('tipo')} className="mt-1 w-full border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm">
                {TIPO_OPTS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Descripción *</Label>
            <Textarea {...register('descripcion')} className="mt-1" placeholder="Describe el procedimiento o diagnóstico..." />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Veterinario</Label>
              <Input {...register('veterinario')} className="mt-1" placeholder="Nombre del vet" />
            </div>
            <div>
              <Label>Costo (MXN)</Label>
              <Input type="number" step="0.01" min="0" {...register('costo_mxn')} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Notas adicionales</Label>
            <Textarea {...register('notas')} className="mt-1 min-h-[60px]" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setMostrarForm(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#E85D3A] hover:bg-[#C94B2A] text-white">
              {isSubmitting ? 'Guardando...' : 'Guardar registro'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {historial.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E0D8]">
            <p className="text-[#9B9B9B] text-sm">Sin registros médicos aún</p>
          </div>
        ) : (
          historial.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-[#E8E0D8] p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TIPO_COLOR[r.tipo] ?? 'bg-gray-100 text-gray-700'}`}>
                    {r.tipo}
                  </span>
                  <span className="text-sm font-medium text-[#1A1A1A]">{formatearFecha(r.fecha)}</span>
                </div>
                {r.costo_mxn != null && (
                  <span className="text-xs text-[#6B6B6B]">{formatearMonto(r.costo_mxn)}</span>
                )}
              </div>
              <p className="text-sm text-[#1A1A1A] mb-1">{r.descripcion}</p>
              {r.veterinario && <p className="text-xs text-[#9B9B9B]">Vet: {r.veterinario}</p>}
              {r.notas && <p className="text-xs text-[#9B9B9B] mt-1">{r.notas}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
