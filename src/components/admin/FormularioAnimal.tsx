'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X } from 'lucide-react'
import type { Animal } from '@/types'

const esquema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  especie: z.enum(['perro', 'gato', 'otro']),
  raza_estimada: z.string().optional(),
  edad_meses: z.union([z.string(), z.number()]).transform(v => (v === '' || v === null || v === undefined ? undefined : Number(v))).pipe(z.number().min(0).optional()),
  peso_kg: z.union([z.string(), z.number()]).transform(v => (v === '' || v === null || v === undefined ? undefined : Number(v))).pipe(z.number().min(0).optional()),
  sexo: z.enum(['macho', 'hembra']).optional(),
  categoria_edad: z.enum(['cachorro', 'joven', 'adulto', 'senior']).optional(),
  esterilizado: z.boolean().default(false),
  estado: z.enum(['disponible','en_proceso','adoptado','cuarentena','tratamiento_medico','fallecido','en_transito']).default('disponible'),
  urgente: z.boolean().default(false),
  visible: z.boolean().default(true),
  ciudad_rescate: z.string().optional(),
  historia: z.string().optional(),
  personalidad: z.string().optional(),
  necesidades_especiales: z.string().optional(),
  compatible_ninos: z.boolean().default(true),
  compatible_animales: z.boolean().default(true),
  apto_departamento: z.boolean().default(true),
})
type Campos = z.input<typeof esquema>
type CamposSalida = z.output<typeof esquema>

interface Props { animal?: Partial<Animal> }

export function FormularioAnimal({ animal }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [fotos, setFotos] = useState<string[]>(animal?.fotos ?? [])
  const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(animal?.foto_principal ?? null)
  const [subiendo, setSubiendo] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Campos, unknown, CamposSalida>({
    resolver: zodResolver(esquema),
    defaultValues: {
      nombre: animal?.nombre ?? '',
      especie: animal?.especie ?? 'perro',
      raza_estimada: animal?.raza_estimada ?? '',
      edad_meses: animal?.edad_meses ?? undefined,
      peso_kg: animal?.peso_kg ?? undefined,
      sexo: animal?.sexo ?? undefined,
      categoria_edad: animal?.categoria_edad ?? undefined,
      esterilizado: animal?.esterilizado ?? false,
      estado: animal?.estado ?? 'disponible',
      urgente: animal?.urgente ?? false,
      visible: animal?.visible ?? true,
      ciudad_rescate: animal?.ciudad_rescate ?? '',
      historia: animal?.historia ?? '',
      personalidad: animal?.personalidad ?? '',
      necesidades_especiales: animal?.necesidades_especiales ?? '',
      compatible_ninos: animal?.compatible_ninos ?? true,
      compatible_animales: animal?.compatible_animales ?? true,
      apto_departamento: animal?.apto_departamento ?? true,
    },
  })

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (archivo.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB por foto'); return }
    if (fotos.length >= 10) { toast.error('Máximo 10 fotos'); return }
    setSubiendo(true)
    const nombre = `${Date.now()}-${archivo.name}`
    const { data, error } = await supabase.storage.from('animales-fotos').upload(nombre, archivo)
    if (error) { toast.error('Error al subir foto'); setSubiendo(false); return }
    const { data: urlData } = supabase.storage.from('animales-fotos').getPublicUrl(data.path)
    const nuevaUrl = urlData.publicUrl
    setFotos(prev => [...prev, nuevaUrl])
    if (!fotoPrincipal) setFotoPrincipal(nuevaUrl)
    setSubiendo(false)
  }

  function eliminarFoto(url: string) {
    setFotos(prev => prev.filter(f => f !== url))
    if (fotoPrincipal === url) setFotoPrincipal(fotos.find(f => f !== url) ?? null)
  }

  async function onSubmit(data: CamposSalida) {
    const payload = { ...data, fotos, foto_principal: fotoPrincipal }
    if (animal?.id) {
      const { error } = await supabase.from('animales').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', animal.id)
      if (error) { toast.error('Error al guardar'); return }
      toast.success('Animal actualizado')
    } else {
      const { error } = await supabase.from('animales').insert(payload)
      if (error) { toast.error('Error al crear'); return }
      toast.success('Animal creado exitosamente')
    }
    router.push('/admin/animales')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-8 p-6">
      {/* Sección 1: Info básica */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Información básica</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Nombre *</Label>
            <Input {...register('nombre')} className="mt-1" />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>
          <div>
            <Label>Especie *</Label>
            <select {...register('especie')} className="mt-1 w-full border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm">
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <Label>Raza estimada</Label>
            <Input {...register('raza_estimada')} className="mt-1" placeholder="Mestizo, Labrador..." />
          </div>
          <div>
            <Label>Sexo</Label>
            <select {...register('sexo')} className="mt-1 w-full border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm">
              <option value="">Sin especificar</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
          <div>
            <Label>Categoría de edad</Label>
            <select {...register('categoria_edad')} className="mt-1 w-full border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm">
              <option value="">Sin especificar</option>
              <option value="cachorro">Cachorro</option>
              <option value="joven">Joven</option>
              <option value="adulto">Adulto</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <Label>Edad (meses)</Label>
            <Input {...register('edad_meses')} type="number" min="0" className="mt-1" />
          </div>
          <div>
            <Label>Peso (kg)</Label>
            <Input {...register('peso_kg')} type="number" step="0.1" min="0" className="mt-1" />
          </div>
          <div>
            <Label>Ciudad de rescate</Label>
            <Input {...register('ciudad_rescate')} className="mt-1" placeholder="Ciudad de México" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="esterilizado" {...register('esterilizado')} className="w-4 h-4 accent-[#E85D3A]" />
            <Label htmlFor="esterilizado">Esterilizado</Label>
          </div>
        </div>
      </div>

      {/* Sección 2: Estado */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Estado y visibilidad</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Estado</Label>
            <select {...register('estado')} className="mt-1 w-full border border-[#E8E0D8] rounded-lg px-3 py-2 text-sm">
              <option value="disponible">Disponible</option>
              <option value="en_proceso">En proceso</option>
              <option value="adoptado">Adoptado</option>
              <option value="cuarentena">Cuarentena</option>
              <option value="tratamiento_medico">Tratamiento médico</option>
              <option value="en_transito">En tránsito</option>
              <option value="fallecido">Fallecido</option>
            </select>
          </div>
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="urgente" {...register('urgente')} className="w-4 h-4 accent-[#E85D3A]" />
              <Label htmlFor="urgente">Caso urgente</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="visible" {...register('visible')} className="w-4 h-4 accent-[#E85D3A]" />
              <Label htmlFor="visible">Visible en el sitio</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 3: Historia */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Historia y personalidad</h2>
        <div className="space-y-4">
          <div>
            <Label>Historia</Label>
            <Textarea {...register('historia')} className="mt-1 min-h-[100px]" placeholder="Cuenta su historia de rescate..." />
          </div>
          <div>
            <Label>Personalidad</Label>
            <Textarea {...register('personalidad')} className="mt-1 min-h-[80px]" placeholder="Cariñoso, juguetón, tímido al inicio..." />
          </div>
          <div>
            <Label>Necesidades especiales</Label>
            <Input {...register('necesidades_especiales')} className="mt-1" placeholder="Medicación diaria, dieta especial..." />
          </div>
        </div>
      </div>

      {/* Sección 4: Compatibilidades */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Compatibilidades</h2>
        <div className="space-y-3">
          {[
            { id: 'compatible_ninos',    label: 'Compatible con niños' },
            { id: 'compatible_animales', label: 'Compatible con otros animales' },
            { id: 'apto_departamento',   label: 'Apto para departamento' },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <input type="checkbox" id={id} {...register(id as keyof Campos)} className="w-4 h-4 accent-[#E85D3A]" />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 5: Fotos */}
      <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-1">Fotos</h2>
        <p className="text-xs text-[#9B9B9B] mb-4">Máx. 10 fotos · 5 MB c/u · JPG, PNG, WebP. Haz clic en una foto para marcarla como principal.</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {fotos.map((url) => (
            <div key={url} className="relative group aspect-square">
              <img src={url} alt="" className={`w-full h-full object-cover rounded-lg border-2 cursor-pointer ${
                fotoPrincipal === url ? 'border-[#E85D3A]' : 'border-transparent'
              }`} onClick={() => setFotoPrincipal(url)} />
              {fotoPrincipal === url && (
                <span className="absolute bottom-1 left-1 bg-[#E85D3A] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Principal</span>
              )}
              <button type="button" onClick={() => eliminarFoto(url)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {fotos.length < 10 && (
            <label className={`aspect-square border-2 border-dashed border-[#E8E0D8] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#E85D3A] transition-colors ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-5 h-5 text-[#9B9B9B] mb-1" />
              <span className="text-xs text-[#9B9B9B]">{subiendo ? 'Subiendo...' : 'Agregar'}</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={subirFoto} disabled={subiendo} />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/animales')}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
          {isSubmitting ? 'Guardando...' : animal?.id ? 'Guardar cambios' : 'Crear animal'}
        </Button>
      </div>
    </form>
  )
}
