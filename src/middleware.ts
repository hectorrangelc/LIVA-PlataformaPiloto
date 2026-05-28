// middleware.ts — Protección de rutas con Supabase Auth
// Rutas protegidas: /admin/* y /(dashboard)/*
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware if Supabase is not configured (local dev without .env)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refrescar sesión — CRÍTICO para Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirigir a /login si no está autenticado en rutas protegidas
  const rutasProtegidas = ['/perfil', '/mis-solicitudes', '/mis-apadrinamientos']
  const esRutaProtegida = rutasProtegidas.some((ruta) => pathname.startsWith(ruta))

  if (esRutaProtegida && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirigir a /login si no está autenticado en /admin/*
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verificar rol admin o staff
    const { data: perfil } = await supabase
      .from('users')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (!perfil || !['admin', 'staff'].includes(perfil.rol)) {
      // Sin permisos → redirigir a inicio
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Redirigir a /perfil si ya está autenticado e intenta acceder a /login o /registro
  if (user && (pathname === '/login' || pathname === '/registro')) {
    const url = request.nextUrl.clone()
    url.pathname = '/perfil'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas excepto:
     * - _next/static, _next/image
     * - favicon.ico
     * - archivos estáticos con extensión
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
