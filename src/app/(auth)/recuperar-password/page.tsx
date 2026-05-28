// src/app/(auth)/recuperar-password/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const esquema = z.object({ email: z.string().email('Email inválido') })
type Campos = z.infer<typeof esquema>

export default function RecuperarPasswordPage() {
  const supabase = createClient()
  const [enviado, setEnviado] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Campos>({
    resolver: zodResolver(esquema),
  })

  async function onSubmit(data: Campos) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/actualizar-password`,
    })
    if (error) { toast.error('Error al enviar el correo'); return }
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-8 border border-[#E8E0D8] text-center">
          <span className="text-5xl">📬</span>
          <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">Correo enviado</h1>
          <p className="text-[#6B6B6B] mt-2 text-sm">
            Revisa tu bandeja y sigue el enlace para crear una nueva contraseña.
          </p>
          <Link href="/login">
            <Button className="mt-6 w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white">
              Volver al login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-card p-8 border border-[#E8E0D8]">
        <div className="text-center mb-8">
          <span className="text-4xl">🔑</span>
          <h1 className="mt-3 text-2xl font-bold text-[#1A1A1A]">Recuperar contraseña</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Te enviaremos un enlace para crear una nueva contraseña
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="tu@email.com"
              className="mt-1" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}
            className="w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
            {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
          </Button>
        </form>
        <p className="text-center text-sm mt-6">
          <Link href="/login" className="text-[#E85D3A] hover:underline">← Volver al login</Link>
        </p>
      </div>
    </div>
  )
}
