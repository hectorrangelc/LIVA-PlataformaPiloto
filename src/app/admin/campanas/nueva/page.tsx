'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const esquema = z.object({
  titulo: z.string().min(1, 'Requerido').max(80, 'Máx. 80 caracteres'),
  descripcion: z.string().min(1, 'Requerido'),
  historia: z.string().optional(),
  meta_mxn: z.string().min(1, 'Requerido'),
  fecha_limite: z.string().optional(),
  imagen_url: z.string().optional(),
  urgente: z.boolean(),
})
type Campos = z.infer<typeof esquema>

export default function NuevaCampanaPage() {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Campos>({
    resolver: zodResolver(esquema),
    defaultValues: { urgente: false },
  })
  const titulo = watch('titulo', '')

  async function onSubmit(data: Campos) {
    const payload = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      historia: data.historia || undefined,
      meta_mxn: parseFloat(data.meta_mxn),
      fecha_limite: data.fecha_limite || undefined,
      imagen_url: data.imagen_url || undefined,
      urgente: data.urgente,
    }
    const res = await fetch('/api/admin/campanas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (!res.ok) { const e = await res.json(); toast.error(e.error ?? 'Error'); return }
    toast.success('Campaña creada')
    router.push('/admin/campanas')
    router.refresh()
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Nueva campaña</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5 space-y-4">
          <div>
            <Label>Título * <span className="text-[#9B9B9B] text-xs">({(titulo ?? '').length}/80)</span></Label>
            <Input {...register('titulo')} className="mt-1" maxLength={80} placeholder="Rescate de emergencia — Max" />
            {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
          </div>
          <div>
            <Label>Descripción *</Label>
            <Textarea {...register('descripcion')} className="mt-1 min-h-[80px]" placeholder="Resumen del caso..." />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
          </div>
          <div>
            <Label>Historia completa</Label>
            <Textarea {...register('historia')} className="mt-1 min-h-[120px]" placeholder="Cuenta la historia con más detalle..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta de recaudación (MXN) *</Label>
              <Input type="number" min="1" {...register('meta_mxn')} className="mt-1" placeholder="5000" />
              {errors.meta_mxn && <p className="text-red-500 text-xs mt-1">{errors.meta_mxn.message}</p>}
            </div>
            <div>
              <Label>Fecha límite (opcional)</Label>
              <Input type="date" {...register('fecha_limite')} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>URL imagen principal (opcional)</Label>
            <Input type="url" {...register('imagen_url')} className="mt-1" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="urgente" {...register('urgente')} className="w-4 h-4 accent-[#E85D3A]" />
            <Label htmlFor="urgente">Marcar como urgente</Label>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/campanas')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
            {isSubmitting ? 'Creando...' : 'Crear campaña'}
          </Button>
        </div>
      </form>
    </div>
  )
}
