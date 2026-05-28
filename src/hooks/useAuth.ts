'use client'
// hooks/useAuth.ts
// Hook de autenticación con Supabase — estado de sesión y usuario

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Usuario, Rol } from '@/types'

interface AuthState {
  user: User | null
  perfil: Usuario | null
  rol: Rol | null
  cargando: boolean
  estaAutenticado: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Obtener sesión inicial
    const obtenerSesion = async () => {
      const { data: { user: usuarioActual } } = await supabase.auth.getUser()
      setUser(usuarioActual)

      if (usuarioActual) {
        await cargarPerfil(usuarioActual.id)
      }

      setCargando(false)
    }

    obtenerSesion()

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (evento, sesion) => {
        const usuarioActual = sesion?.user ?? null
        setUser(usuarioActual)

        if (usuarioActual) {
          await cargarPerfil(usuarioActual.id)
        } else {
          setPerfil(null)
        }

        setCargando(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const cargarPerfil = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) setPerfil(data as Usuario)
  }

  return {
    user,
    perfil,
    rol: perfil?.rol ?? null,
    cargando,
    estaAutenticado: !!user,
  }
}
