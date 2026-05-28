// src/app/(public)/eventos/[id]/BotonRegistrarEvento.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Props {
  eventoId: string
  userId: string | null
  yaRegistrado: boolean
}

export function BotonRegistrarEvento({ eventoId, userId, yaRegistrado: inicial }: Props) {
  const [registrado, setRegistrado] = useState(inicial)
  const [cargando, setCargando] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function registrar() {
    if (!userId) {
      router.push(`/login?redirect=/eventos/${eventoId}`)
      return
    }
    setCargando(true)
    const { error } = await supabase.from('registros_evento').insert({
      evento_id: eventoId,
      user_id: userId,
    })
    if (error) { toast.error('No se pudo registrar. Intenta de nuevo.') }
    else { setRegistrado(true); toast.success('¡Te has registrado en el evento!') }
    setCargando(false)
  }

  async function cancelar() {
    if (!userId) return
    setCargando(true)
    const { error } = await supabase.from('registros_evento')
      .delete()
      .eq('evento_id', eventoId)
      .eq('user_id', userId)
    if (error) { toast.error('No se pudo cancelar el registro.') }
    else { setRegistrado(false); toast.success('Registro cancelado') }
    setCargando(false)
  }

  if (registrado) {
    return (
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-green-700 text-sm font-medium">
          <span>✓</span> Estás registrado en este evento
        </p>
        <Button variant="outline" size="sm" onClick={cancelar} disabled={cargando}
          className="w-full text-xs border-[#E8E0D8] text-[#6B6B6B] hover:border-red-300 hover:text-red-500">
          {cargando ? 'Cancelando...' : 'Cancelar registro'}
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={registrar} disabled={cargando}
      className="w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold">
      {cargando
        ? 'Procesando...'
        : userId
          ? 'Registrarme en este evento'
          : 'Iniciar sesión para registrarme'}
    </Button>
  )
}
