// src/components/donaciones/ProgresoCapana.tsx
import { formatearMonto, calcularPorcentaje } from '@/utils/formatters'
import type { Campana } from '@/types'

interface Props {
  campana: Campana
  numDonadores?: number
}

export function ProgresoCapana({ campana, numDonadores = 0 }: Props) {
  const porcentaje = calcularPorcentaje(campana.recaudado_mxn, campana.meta_mxn)
  const diasRestantes = campana.fecha_limite
    ? Math.max(0, Math.ceil((new Date(campana.fecha_limite).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5">
      {campana.urgente && (
        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-3">
          🚨 Urgente
        </span>
      )}
      <h3 className="font-bold text-[#1A1A1A] mb-1">{campana.titulo}</h3>
      <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">{campana.descripcion}</p>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-[#6B6B6B] mb-1.5">
          <span>{formatearMonto(campana.recaudado_mxn)} recaudados</span>
          <span>{porcentaje}%</span>
        </div>
        <div className="h-2.5 bg-[#F5F0EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E85D3A] rounded-full transition-all duration-700"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <p className="text-xs text-[#9B9B9B] mt-1">
          Meta: {formatearMonto(campana.meta_mxn)}
        </p>
      </div>

      <div className="flex gap-4 text-xs text-[#6B6B6B]">
        {numDonadores > 0 && (
          <span>🤝 {numDonadores} {numDonadores === 1 ? 'donador' : 'donadores'}</span>
        )}
        {diasRestantes !== null && (
          <span>⏰ {diasRestantes === 0 ? 'Vence hoy' : `${diasRestantes} días restantes`}</span>
        )}
      </div>
    </div>
  )
}
