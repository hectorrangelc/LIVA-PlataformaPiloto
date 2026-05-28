import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'

const esquema = z.object({
  estado: z.enum(['recibida','en_revision','visita_programada','aprobada','en_espera','denegada','contrato_firmado','completada']).optional(),
  notas_admin: z.string().optional(),
  motivo_denegacion: z.string().optional(),
  fecha_visita: z.string().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = esquema.parse(await req.json())
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('solicitudes_adopcion')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
