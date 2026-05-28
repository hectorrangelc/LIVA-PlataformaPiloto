// src/app/api/apadrinamientos/crear/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { preApprovalClient } from '@/lib/mercadopago/client'
import { createClient } from '@/lib/supabase/server'

const esquema = z.object({
  animal_id: z.string().uuid(),
  monto_mensual: z.number().min(100, 'Mínimo $100 MXN mensual'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { animal_id, monto_mensual } = esquema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para apadrinar' }, { status: 401 })
    }

    const { data: animal } = await supabase
      .from('animales')
      .select('nombre')
      .eq('id', animal_id)
      .single()

    const suscripcion = await preApprovalClient.create({
      body: {
        reason: `Apadrinamiento mensual de ${animal?.nombre ?? 'animal'} — LIVA`,
        payer_email: user.email!,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: monto_mensual,
          currency_id: 'MXN',
        },
        back_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mis-apadrinamientos`,
        status: 'pending',
      },
    })

    await supabase.from('apadrinamientos').upsert({
      user_id: user.id,
      animal_id,
      monto_mensual_mxn: monto_mensual,
      suscripcion_id: suscripcion.id,
      activo: false,
    }, { onConflict: 'user_id,animal_id' })

    return NextResponse.json({
      init_point: suscripcion.init_point,
      suscripcion_id: suscripcion.id,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    console.error('[apadrinamientos/crear]', err)
    return NextResponse.json({ error: 'Error al crear el apadrinamiento' }, { status: 500 })
  }
}
