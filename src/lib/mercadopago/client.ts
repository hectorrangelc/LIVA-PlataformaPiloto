// src/lib/mercadopago/client.ts
import MercadoPagoConfig, { Payment, Preference, PreApproval } from 'mercadopago'

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
})

export const paymentClient = new Payment(mpClient)
export const preferenceClient = new Preference(mpClient)
export const preApprovalClient = new PreApproval(mpClient)
