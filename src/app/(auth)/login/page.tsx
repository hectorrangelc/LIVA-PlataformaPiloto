// src/app/(auth)/login/page.tsx
'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type Campos = z.infer<typeof esquema>

function FormularioLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/perfil'
  const supabase = createClient()
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Campos>({
    resolver: zodResolver(esquema),
  })

  async function onSubmit(data: Campos) {
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast.error('Email o contraseña incorrectos')
      setCargando(false)
      return
    }
    router.push(redirect)
    router.refresh()
  }

  async function loginConGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) toast.error('Error al conectar con Google')
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-card p-8 border border-[#E8E0D8]">
        <div className="text-center mb-8">
          <span className="text-4xl">🐾</span>
          <h1 className="mt-3 text-2xl font-bold text-[#1A1A1A]">Bienvenido de vuelta</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Inicia sesión en tu cuenta LIVA</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="tu@email.com"
              className="mt-1" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" placeholder="••••••••"
              className="mt-1" {...register('password')} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="text-right">
            <Link href="/recuperar-password" className="text-sm text-[#E85D3A] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button type="submit" disabled={cargando}
            className="w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E0D8]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-[#9B9B9B]">o continúa con</span>
          </div>
        </div>

        <Button type="button" variant="outline" onClick={loginConGoogle}
          className="w-full border-[#E8E0D8] hover:border-[#E85D3A]">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </Button>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-[#E85D3A] font-medium hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <FormularioLogin />
    </Suspense>
  )
}
