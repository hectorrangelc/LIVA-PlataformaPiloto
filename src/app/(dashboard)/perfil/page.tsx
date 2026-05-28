// src/app/(dashboard)/perfil/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { UserCircle, LogOut, Heart, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const esquema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().optional(),
  telefono: z.string().optional(),
  ciudad: z.string().optional(),
})
type Campos = z.infer<typeof esquema>

export default function PerfilPage() {
  const { perfil, cargando } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Campos>({
    resolver: zodResolver(esquema),
    values: perfil ? {
      nombre: perfil.nombre,
      apellido: perfil.apellido ?? '',
      telefono: perfil.telefono ?? '',
      ciudad: perfil.ciudad ?? '',
    } : undefined,
  })

  async function onSubmit(data: Campos) {
    if (!perfil) return
    setGuardando(true)
    const { error } = await supabase
      .from('users')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', perfil.id)
    if (error) { toast.error('Error al guardar los cambios') }
    else { toast.success('Perfil actualizado') }
    setGuardando(false)
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (cargando) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#FEF0EC] flex items-center justify-center">
          <UserCircle className="w-7 h-7 text-[#E85D3A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Mi perfil</h1>
          <p className="text-[#6B6B6B] text-sm">{perfil?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/mis-solicitudes"
          className="flex items-center gap-2 p-4 rounded-xl border border-[#E8E0D8] bg-white hover:border-[#E85D3A] transition-colors">
          <FileText className="w-5 h-5 text-[#E85D3A]" />
          <span className="text-sm font-medium text-[#1A1A1A]">Mis solicitudes</span>
        </Link>
        <Link href="/mis-apadrinamientos"
          className="flex items-center gap-2 p-4 rounded-xl border border-[#E8E0D8] bg-white hover:border-[#E85D3A] transition-colors">
          <Heart className="w-5 h-5 text-[#E85D3A]" />
          <span className="text-sm font-medium text-[#1A1A1A]">Mis apadrinamientos</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Datos personales</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" className="mt-1" {...register('nombre')} />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" className="mt-1" {...register('apellido')} />
            </div>
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" type="tel" placeholder="55 1234 5678" className="mt-1" {...register('telefono')} />
          </div>
          <div>
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input id="ciudad" placeholder="Ciudad de México" className="mt-1" {...register('ciudad')} />
          </div>
          <Button type="submit" disabled={guardando}
            className="bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={cerrarSesion}
          className="border-[#E8E0D8] text-[#6B6B6B] hover:border-red-300 hover:text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
