// types/index.ts
// Tipos globales de TypeScript para la plataforma LIVA
// Complementan los tipos auto-generados de Supabase

// ── Roles de usuario ────────────────────────────────────────
export type Rol = 'user' | 'volunteer' | 'staff' | 'admin'

// ── Especies y estados de animales ─────────────────────────
export type Especie = 'perro' | 'gato' | 'otro'
export type CategoriaEdad = 'cachorro' | 'joven' | 'adulto' | 'senior'
export type Sexo = 'macho' | 'hembra'
export type EstadoAnimal =
  | 'disponible'
  | 'en_proceso'
  | 'adoptado'
  | 'cuarentena'
  | 'tratamiento_medico'
  | 'fallecido'
  | 'en_transito'

// ── Tipo Animal (para componentes UI) ──────────────────────
export interface Animal {
  id: string
  nombre: string
  especie: Especie
  raza_estimada?: string | null
  edad_meses?: number | null
  categoria_edad?: CategoriaEdad | null
  peso_kg?: number | null
  sexo?: Sexo | null
  esterilizado: boolean
  estado: EstadoAnimal
  historia?: string | null
  personalidad?: string | null
  necesidades_especiales?: string | null
  compatible_ninos: boolean
  compatible_animales: boolean
  apto_departamento: boolean
  fotos: string[]
  foto_principal?: string | null
  fecha_ingreso?: string | null
  ciudad_rescate?: string | null
  apadrinado: boolean
  urgente: boolean
  visible: boolean
  created_at: string
  updated_at: string
}

// ── Tipo Usuario (perfil público) ──────────────────────────
export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido?: string | null
  telefono?: string | null
  ciudad?: string | null
  estado_republica?: string | null
  foto_url?: string | null
  bio?: string | null
  rol: Rol
  activo: boolean
  created_at: string
  updated_at: string
}

// ── Solicitud de adopción ───────────────────────────────────
export type EstadoSolicitud =
  | 'recibida'
  | 'en_revision'
  | 'visita_programada'
  | 'aprobada'
  | 'en_espera'
  | 'denegada'
  | 'contrato_firmado'
  | 'completada'

export interface SolicitudAdopcion {
  id: string
  animal_id: string
  user_id: string
  estado: EstadoSolicitud
  vivienda_tipo?: 'propia' | 'arrendada' | null
  vivienda_m2?: number | null
  vivienda_exterior?: boolean | null
  num_adultos?: number | null
  num_ninos?: number | null
  edades_ninos?: string | null
  mascotas_actuales?: string | null
  experiencia_previa?: string | null
  motivacion?: string | null
  referencias?: string | null
  doc_identificacion?: string | null
  doc_domicilio?: string | null
  notas_admin?: string | null
  motivo_denegacion?: string | null
  fecha_visita?: string | null
  fecha_entrega?: string | null
  created_at: string
  updated_at: string
}

// ── Donación ───────────────────────────────────────────────
export type TipoDonacion = 'unica' | 'recurrente'
export type CanalDonacion = 'mercadopago' | 'transferencia' | 'efectivo' | 'otro'
export type EstadoDonacion = 'pendiente' | 'completada' | 'fallida' | 'reembolsada'

export interface Donacion {
  id: string
  user_id?: string | null
  monto_mxn: number
  tipo: TipoDonacion
  canal: CanalDonacion
  campana_id?: string | null
  animal_id?: string | null
  estado: EstadoDonacion
  referencia_pago?: string | null
  comprobante_url?: string | null
  notas?: string | null
  created_at: string
}

// ── Campaña ────────────────────────────────────────────────
export interface Campana {
  id: string
  titulo: string
  descripcion: string
  historia?: string | null
  animal_id?: string | null
  meta_mxn: number
  recaudado_mxn: number
  activa: boolean
  urgente: boolean
  imagen_url?: string | null
  fecha_limite?: string | null
  created_by?: string | null
  created_at: string
  updated_at: string
}

// ── Evento ─────────────────────────────────────────────────
export type TipoEvento = 'adopcion' | 'esterilizacion' | 'recaudacion' | 'voluntariado' | 'otro'

export interface Evento {
  id: string
  tipo: TipoEvento
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_fin?: string | null
  lugar: string
  direccion?: string | null
  ciudad?: string | null
  imagen_url?: string | null
  capacidad?: number | null
  activo: boolean
  resultados?: string | null
  fotos_post: string[]
  created_at: string
}

// ── Filtros del catálogo ───────────────────────────────────
export interface FiltrosAnimales {
  especie?: Especie
  categoria_edad?: CategoriaEdad
  sexo?: Sexo
  estado?: EstadoAnimal
  compatible_ninos?: boolean
  compatible_animales?: boolean
  apto_departamento?: boolean
  ciudad_rescate?: string
  busqueda?: string
}

// ── Respuesta paginada ─────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
