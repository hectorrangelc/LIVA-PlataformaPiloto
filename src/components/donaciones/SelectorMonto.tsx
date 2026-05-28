// src/components/donaciones/SelectorMonto.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatearMonto } from '@/utils/formatters'

const MONTOS_SUGERIDOS = [
  { monto: 100, impacto: 'Vacunas por 1 mes' },
  { monto: 250, impacto: 'Desparasitación completa' },
  { monto: 500, impacto: 'Esterilización de emergencia' },
  { monto: 1000, impacto: 'Semana veterinaria' },
]

interface Props {
  campanaId?: string
  animalId?: string
}

export function SelectorMonto({ campanaId, animalId }: Props) {
  const [tipo, setTipo] = useState<'unica' | 'mensual'>('unica')
  const [montoSeleccionado, setMontoSeleccionado] = useState<number | null>(250)
  const [montoCustom, setMontoCustom] = useState('')
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const montoFinal = montoCustom ? parseFloat(montoCustom) : montoSeleccionado

  async function donar() {
    if (!montoFinal || montoFinal < 10) {
      toast.error('El monto mínimo es $10 MXN')
      return
    }
    setCargando(true)

    const endpoint = tipo === 'unica'
      ? '/api/donaciones/crear'
      : '/api/apadrinamientos/crear'

    const body = tipo === 'unica'
      ? { monto: montoFinal, campana_id: campanaId, animal_id: animalId }
      : { animal_id: animalId, monto_mensual: montoFinal }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? 'Error al procesar la donación')
      setCargando(false)
      return
    }

    router.push(data.init_point)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
      <div className="flex rounded-xl bg-[#F5F0EB] p-1 mb-6">
        {(['unica', 'mensual'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tipo === t
                ? 'bg-white text-[#E85D3A] shadow-sm'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            {t === 'unica' ? 'Donación única' : 'Mensual'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {MONTOS_SUGERIDOS.map(({ monto, impacto }) => (
          <button
            key={monto}
            onClick={() => { setMontoSeleccionado(monto); setMontoCustom('') }}
            className={`p-3 rounded-xl border text-left transition-all ${
              montoSeleccionado === monto && !montoCustom
                ? 'border-[#E85D3A] bg-[#FEF0EC]'
                : 'border-[#E8E0D8] hover:border-[#E85D3A]'
            }`}
          >
            <p className="font-bold text-[#1A1A1A]">{formatearMonto(monto)}</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">{impacto}</p>
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-sm">$</span>
        <Input
          type="number"
          min="10"
          placeholder="Otro monto"
          value={montoCustom}
          onChange={(e) => { setMontoCustom(e.target.value); setMontoSeleccionado(null) }}
          className="pl-7"
        />
      </div>

      <Button
        onClick={donar}
        disabled={cargando || !montoFinal || montoFinal < 10}
        className="w-full bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-bold py-3 text-base"
      >
        {cargando
          ? 'Procesando...'
          : tipo === 'unica'
            ? `Donar ${montoFinal ? formatearMonto(montoFinal) : ''}`
            : `Apadrinar ${montoFinal ? formatearMonto(montoFinal) + '/mes' : ''}`}
      </Button>

      <p className="text-center text-xs text-[#9B9B9B] mt-3">
        Pago seguro con MercadoPago 🔒
      </p>
    </div>
  )
}
