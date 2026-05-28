'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, PawPrint, ClipboardList, Users,
  Heart, Megaphone, BarChart2, LogOut, ChevronRight
} from 'lucide-react'

const NAV = [
  { href: '/admin',                   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/animales',          label: 'Animales',     icon: PawPrint },
  { href: '/admin/solicitudes',       label: 'Solicitudes',  icon: ClipboardList },
  { href: '/admin/crm/adoptantes',    label: 'Adoptantes',   icon: Users },
  { href: '/admin/crm/donadores',     label: 'Donadores',    icon: Heart },
  { href: '/admin/campanas',          label: 'Campañas',     icon: Megaphone },
  { href: '/admin/reportes',          label: 'Reportes',     icon: BarChart2 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 bg-[#1A1A1A] min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">LIVA</p>
            <p className="text-white/40 text-xs">Panel Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const activo = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activo
                  ? 'bg-[#E85D3A] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {activo && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 mb-1">
          ← Ver sitio público
        </Link>
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
