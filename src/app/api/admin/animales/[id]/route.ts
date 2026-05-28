import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'

const esquema = z.object({
  estado: z.enum(['disponible','en_proceso','adoptado','cuarentena','tratamiento_medico','fallecido','en_transito']).optional(),
  urgente: z.boolean().optional(),
  visible: z.boolean().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = esquema.parse(body)
    const supabase = await createAdminClient()
    const { error } = await supabase.from('animales').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
