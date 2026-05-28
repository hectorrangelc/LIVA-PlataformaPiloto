// src/app/(auth)/registro/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const esquema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmar: z.string(),
}).refine((d) => d.password === d.confirmar, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar'],
})
type Campos = z.infer<typeof esquema>

export default function RegistroPage() {
  const router = useRouter()
  const supabase = createClient()
  const [confirmado, setConfirmado] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Campos>({
    resolver: zodResolver(esquema),
  })

  async function onSubmit(data: Campos) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { nombre: data.nombre, apellido: data.apellido },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    setConfirmado(true)
  }

  if (confirmado) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-8 border border-[#E8E0D8] text-center">
          <span className="text-5xl">📧</span>
          <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">Revisa tu correo</h1>
          <p className="text-[#6B6B6B] mt-2 text-sm">
            Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta LIVA.
          </p>
          <Button className="mt-6 w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white"
            onClick={() => router.push('/login')}>
            Volver al login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-card p-8 border border-[#E8E0D8]">
        <div className="text-center mb-8">
          <span className="text-4xl">🐾</span>
          <h1 className="mt-3 text-2xl font-bold text-[#1A1A1A]">Únete a LIVA</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Crea tu cuenta para adoptar, donar o ser voluntario</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" placeholder="Ana" className="mt-1" {...register('nombre')} />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" placeholder="García" className="mt-1" {...register('apellido')} />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="tu@email.com"
              className="mt-1" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" placeholder="Mínimo 8 caracteres"
              className="mt-1" {...register('password')} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirmar">Confirmar contraseña</Label>
            <Input id="confirmar" type="password" placeholder="••••••••"
              className="mt-1" {...register('confirmar')} />
            {errors.confirmar && <p className="text-red-500 text-xs mt-1">{errors.confirmar.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}
            className="w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#E85D3A] font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
