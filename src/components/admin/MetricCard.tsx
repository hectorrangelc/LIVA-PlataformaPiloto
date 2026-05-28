import type { LucideIcon } from 'lucide-react'

interface Props {
  titulo: string
  valor: string | number
  subtitulo?: string
  icon: LucideIcon
  color?: 'coral' | 'green' | 'blue' | 'yellow'
}

const COLOR_MAP = {
  coral:  { bg: 'bg-[#FEF0EC]', text: 'text-[#E85D3A]' },
  green:  { bg: 'bg-green-50',  text: 'text-green-600' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
}

export function MetricCard({ titulo, valor, subtitulo, icon: Icon, color = 'coral' }: Props) {
  const { bg, text } = COLOR_MAP[color]
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-[#6B6B6B] font-medium">{titulo}</p>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${text}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1A1A1A]">{valor}</p>
      {subtitulo && <p className="text-xs text-[#9B9B9B] mt-1">{subtitulo}</p>}
    </div>
  )
}
