'use client'
import { useState, useEffect } from 'react'
import { formatearMonto } from '@/utils/formatters'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DatosReporte } from '@/lib/reportes/generarReporte'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const METRICAS: { key: keyof DatosReporte; label: string; formato?: 'monto' | 'pct' }[] = [
  { key: 'animales_rescatados',     label: 'Animales rescatados' },
  { key: 'animales_adoptados',      label: 'Animales adoptados' },
  { key: 'solicitudes_recibidas',   label: 'Solicitudes recibidas' },
  { key: 'solicitudes_aprobadas',   label: 'Solicitudes aprobadas' },
  { key: 'solicitudes_denegadas',   label: 'Solicitudes denegadas' },
  { key: 'tasa_exito_porcentaje',   label: 'Tasa de éxito', formato: 'pct' },
  { key: 'animales_en_espera',      label: 'Animales en espera (actual)' },
  { key: 'animales_en_tratamiento', label: 'En tratamiento médico (actual)' },
  { key: 'total_donaciones_mxn',    label: 'Total donaciones', formato: 'monto' },
  { key: 'nuevos_donadores',        label: 'Donadores únicos' },
  { key: 'apadrinamientos_activos', label: 'Apadrinamientos activos (total)' },
  { key: 'nuevos_usuarios',         label: 'Nuevos usuarios registrados' },
  { key: 'eventos_realizados',      label: 'Eventos realizados' },
]

export default function AdminReportesPage() {
  const ahora = new Date()
  const [mes,  setMes]  = useState(ahora.getMonth() + 1)
  const [anio, setAnio] = useState(ahora.getFullYear())
  const [datos, setDatos] = useState<DatosReporte | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    fetch(`/api/admin/reportes?mes=${mes}&anio=${anio}`)
      .then(r => r.json())
      .then(d => { setDatos(d); setCargando(false) })
      .catch(() => setCargando(false))
  }, [mes, anio])

  function descargarCSV() {
    window.open(`/api/admin/reportes?mes=${mes}&anio=${anio}&formato=csv`, '_blank')
  }

  const anios = Array.from({ length: 5 }, (_, i) => ahora.getFullYear() - i)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Reportes</h1>
        <Button onClick={descargarCSV} variant="outline" className="border-[#E8E0D8]">
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <select value={mes} onChange={e => setMes(Number(e.target.value))}
          className="px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm bg-white">
          {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select value={anio} onChange={e => setAnio(Number(e.target.value))}
          className="px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm bg-white">
          {anios.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {cargando ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#F7F7F5] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : datos ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {METRICAS.map(({ key, label, formato }) => {
            const val = datos[key]
            const display = formato === 'monto' ? formatearMonto(val as number)
              : formato === 'pct' ? `${val}%`
              : String(val)
            return (
              <div key={key} className="bg-white rounded-2xl border border-[#E8E0D8] p-4">
                <p className="text-xs text-[#9B9B9B] mb-1">{label}</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{display}</p>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
