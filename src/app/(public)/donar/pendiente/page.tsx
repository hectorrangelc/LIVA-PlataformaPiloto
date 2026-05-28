import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Pago pendiente' }

export default function PendienteDonacionPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">Pago en proceso</h1>
        <p className="text-[#6B6B6B] mb-8">
          Tu pago está siendo verificado por MercadoPago. Este proceso puede tomar
          unos minutos. Te notificaremos por correo cuando se confirme.
        </p>
        <Link href="/"
          className="inline-block px-6 py-3 bg-[#E85D3A] text-white rounded-xl font-semibold hover:bg-[#C94B2A]">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
