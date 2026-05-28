import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Error en el pago' }

export default function ErrorDonacionPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">Hubo un problema</h1>
        <p className="text-[#6B6B6B] mb-8">
          El pago no pudo procesarse. No se realizó ningún cargo.
          Puedes intentarlo de nuevo o donar por transferencia bancaria.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/donar"
            className="px-6 py-3 bg-[#E85D3A] text-white rounded-xl font-semibold hover:bg-[#C94B2A]">
            Intentar de nuevo
          </Link>
          <Link href="/"
            className="px-6 py-3 border border-[#E8E0D8] text-[#1A1A1A] rounded-xl font-medium hover:border-[#E85D3A]">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
