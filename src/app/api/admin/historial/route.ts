import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'

const TIPOS = ['consulta','vacuna','cirugia','desparasitacion','laboratorio','tratamiento','revision'] as const

const esquema = z.object({
  animal_id: z.string().uuid(),
  fecha: z.string().min(1),
  tipo: z.enum(TIPOS),
  descripcion: z.string().min(1),
  veterinario: z.string().optional(),
  costo_mxn: z.coerce.number().optional(),
  notas: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const data = esquema.parse(await req.json())
    const supabase = await createAdminClient()
    const { error } = await supabase.from('historial_medico').insert(data)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
