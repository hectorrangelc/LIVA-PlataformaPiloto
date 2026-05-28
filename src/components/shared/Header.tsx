'use client'
// components/shared/Header.tsx
// Header responsivo con navegación, avatar de usuario y menú mobile

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  User,
  FileText,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const NAVEGACION = [
  { label: 'Adoptar', href: '/adoptar' },
  { label: 'Donar', href: '/donar' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Comunidad', href: '/comunidad' },
]

export function Header() {
  const { perfil, estaAutenticado, cargando } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const iniciales = perfil
    ? `${perfil.nombre.charAt(0)}${perfil.apellido?.charAt(0) ?? ''}`.toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E0D8] bg-[#FFFBF7]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E85D3A] shadow-sm transition-transform group-hover:scale-105">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">
              LIVA
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAVEGACION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-[#6B6B6B] rounded-lg transition-colors hover:text-[#E85D3A] hover:bg-[#FEF0EC]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/adoptar">
              <Button
                className="bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold rounded-xl px-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Quiero adoptar
              </Button>
            </Link>

            {cargando ? (
              <div className="h-9 w-9 rounded-full bg-[#F5EFE8] animate-pulse" />
            ) : estaAutenticado ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[#F5EFE8] transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={perfil?.foto_url ?? ''} alt={perfil?.nombre} />
                      <AvatarFallback className="bg-[#E85D3A] text-white text-xs font-bold">
                        {iniciales}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-[#6B6B6B]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 mt-1 rounded-xl border-[#E8E0D8]">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                      {perfil?.nombre} {perfil?.apellido}
                    </p>
                    <p className="text-xs text-[#6B6B6B] truncate">{perfil?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-solicitudes" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" /> Mis solicitudes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-apadrinamientos" className="flex items-center gap-2 cursor-pointer">
                      <Star className="h-4 w-4" /> Mis apadrinamientos
                    </Link>
                  </DropdownMenuItem>
                  {(perfil?.rol === 'admin' || perfil?.rol === 'staff') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer font-medium text-[#E85D3A]">
                          Panel admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={cerrarSesion}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="rounded-xl border-[#E8E0D8] hover:border-[#E85D3A] hover:text-[#E85D3A]">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Menú mobile */}
          <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-lg hover:bg-[#F5EFE8] transition-colors">
                <Menu className="h-6 w-6 text-[#1A1A1A]" />
                <span className="sr-only">Abrir menú</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[#FFFBF7] border-l border-[#E8E0D8]">
              <div className="flex flex-col h-full">
                {/* Header del drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-[#E8E0D8]">
                  <Link href="/" onClick={() => setMenuAbierto(false)} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E85D3A]">
                      <Heart className="h-4 w-4 text-white fill-white" />
                    </div>
                    <span className="text-lg font-bold text-[#1A1A1A]">LIVA</span>
                  </Link>
                </div>

                {/* Navegación mobile */}
                <nav className="flex flex-col gap-1 py-6">
                  {NAVEGACION.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuAbierto(false)}
                      className="px-4 py-3 text-base font-medium text-[#1A1A1A] rounded-xl hover:bg-[#FEF0EC] hover:text-[#E85D3A] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Acciones mobile */}
                <div className="mt-auto pt-6 border-t border-[#E8E0D8] flex flex-col gap-3">
                  <Link href="/adoptar" onClick={() => setMenuAbierto(false)}>
                    <Button className="w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-semibold rounded-xl">
                      Quiero adoptar
                    </Button>
                  </Link>
                  {!estaAutenticado && (
                    <Link href="/login" onClick={() => setMenuAbierto(false)}>
                      <Button variant="outline" className="w-full rounded-xl border-[#E8E0D8]">
                        Iniciar sesión
                      </Button>
                    </Link>
                  )}
                  {estaAutenticado && (
                    <Button
                      variant="ghost"
                      onClick={cerrarSesion}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
