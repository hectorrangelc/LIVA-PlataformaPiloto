// components/animales/EstadoBadge.tsx
// Badge de estado del animal con colores semánticos consistentes

interface EstadoBadgeProps {
  estado: string
  tamaño?: 'sm' | 'md'
}

const ESTADO_CONFIG: Record<string, { label: string; clase: string }> = {
  disponible:          { label: 'Disponible',       clase: 'bg-green-100 text-green-800 border-green-200' },
  en_proceso:          { label: 'En proceso',        clase: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  adoptado:            { label: 'Adoptado ✓',        clase: 'bg-blue-100 text-blue-800 border-blue-200' },
  cuarentena:          { label: 'En cuarentena',     clase: 'bg-orange-100 text-orange-800 border-orange-200' },
  tratamiento_medico:  { label: 'En tratamiento',    clase: 'bg-red-100 text-red-800 border-red-200' },
  en_transito:         { label: 'En tránsito',       clase: 'bg-purple-100 text-purple-800 border-purple-200' },
  fallecido:           { label: 'Fallecido',         clase: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export function EstadoBadge({ estado, tamaño = 'sm' }: EstadoBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    clase: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const tamañoClase = tamaño === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-sm'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${tamañoClase} ${config.clase}`}
    >
      {config.label}
    </span>
  )
}
