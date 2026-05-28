// src/app/api/donaciones/webhook/route.ts
import { NextResponse } from 'next/server'
import { paymentClient } from '@/lib/mercadopago/client'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.type === 'payment' && body.data?.id) {
      const pago = await paymentClient.get({ id: String(body.data.id) })

      if (pago.status === 'approved') {
        const supabase = await createAdminClient()
        const meta = pago.metadata as {
          campana_id?: string
          animal_id?: string
          user_id?: string
        }

        await supabase.from('donaciones').insert({
          user_id: meta.user_id ?? null,
          monto_mxn: pago.transaction_amount,
          tipo: 'unica',
          canal: 'mercadopago',
          campana_id: meta.campana_id ?? null,
          animal_id: meta.animal_id ?? null,
          estado: 'completada',
          referencia_pago: String(pago.id),
        })

        if (meta.campana_id) {
          await supabase.rpc('incrementar_recaudado', {
            p_campana_id: meta.campana_id,
            p_monto: pago.transaction_amount,
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[donaciones/webhook]', err)
    return NextResponse.json({ received: true })
  }
}
