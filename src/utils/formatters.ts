// utils/formatters.ts
// Funciones de formato para fechas, moneda y texto — México

/**
 * Formatea una fecha en formato dd/MM/yyyy (México)
 */
export function formatearFecha(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  })
}

/**
 * Formatea una fecha con hora en formato dd/MM/yyyy HH:mm
 */
export function formatearFechaHora(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City',
  })
}

/**
 * Formatea un monto en pesos mexicanos
 * Ejemplo: 1500 → "$1,500.00 MXN"
 */
export function formatearMonto(monto: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(monto)
}

/**
 * Formatea meses de edad a texto legible
 * Ejemplo: 3 → "3 meses", 14 → "1 año 2 meses", 24 → "2 años"
 */
export function formatearEdad(meses: number): string {
  if (meses < 1) return 'Recién nacido'
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  const años = Math.floor(meses / 12)
  const mesesRestantes = meses % 12
  if (mesesRestantes === 0) return `${años} ${años === 1 ? 'año' : 'años'}`
  return `${años} ${años === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalizar(texto: string): string {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

/**
 * Calcula porcentaje de recaudación de una campaña
 */
export function calcularPorcentaje(recaudado: number, meta: number): number {
  if (meta <= 0) return 0
  return Math.min(Math.round((recaudado / meta) * 100), 100)
}

/**
 * Genera texto de tiempo relativo ("hace 2 horas", "ayer", etc.)
 */
export function tiempoRelativo(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  const ahora = new Date()
  const diffMs = ahora.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMins / 60)
  const diffDias = Math.floor(diffHoras / 24)

  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  if (diffHoras < 24) return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`
  if (diffDias === 1) return 'Ayer'
  if (diffDias < 7) return `Hace ${diffDias} días`
  return formatearFecha(d)
}

/**
 * Trunca texto a un número máximo de caracteres
 */
export function truncarTexto(texto: string, maxCaracteres: number): string {
  if (texto.length <= maxCaracteres) return texto
  return texto.slice(0, maxCaracteres).trim() + '…'
}
