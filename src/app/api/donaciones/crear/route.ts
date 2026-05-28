// src/app/api/donaciones/crear/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { preferenceClient } from '@/lib/mercadopago/client'
import { createClient } from '@/lib/supabase/server'

const esquema = z.object({
  monto: z.number().min(10, 'Mínimo $10 MXN'),
  campana_id: z.string().uuid().optional(),
  animal_id: z.string().uuid().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { monto, campana_id, animal_id } = esquema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const emailPagador = user?.email ?? 'anonimo@liva.org.mx'

    const titulo = campana_id
      ? 'Donación a campaña LIVA'
      : animal_id
        ? 'Donación para apoyo de animal LIVA'
        : 'Donación a LIVA'

    const preference = await preferenceClient.create({
      body: {
        items: [{
          id: campana_id ?? animal_id ?? 'donacion-general',
          title: titulo,
          quantity: 1,
          currency_id: 'MXN',
          unit_price: monto,
        }],
        payer: { email: emailPagador },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/donar/gracias`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/donar/error`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/donar/pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/donaciones/webhook`,
        metadata: { campana_id, animal_id, user_id: user?.id },
      },
    })

    return NextResponse.json({ init_point: preference.init_point })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error('[donaciones/crear]', err)
    return NextResponse.json({ error: 'Error al crear la donación' }, { status: 500 })
  }
}
