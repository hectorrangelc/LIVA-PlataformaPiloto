import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

const esquema = z.object({
  titulo: z.string().min(1).max(80),
  descripcion: z.string().min(1),
  historia: z.string().optional(),
  animal_id: z.string().uuid().optional(),
  meta_mxn: z.coerce.number().min(1),
  fecha_limite: z.string().optional(),
  imagen_url: z.string().url().optional().or(z.literal('')),
  urgente: z.boolean().default(false),
})

export async function POST(req: Request) {
  try {
    const data = esquema.parse(await req.json())
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const admin = await createAdminClient()
    const payload = { ...data, imagen_url: data.imagen_url || undefined, created_by: user?.id }
    const { error } = await admin.from('campanas').insert(payload)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
