// app/(public)/animales/[id]/page.tsx
// Perfil individual del animal con galería, OG tags, compartir y formulario de solicitud
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GaleriaFotos } from '@/components/animales/GaleriaFotos'
import { EstadoBadge } from '@/components/animales/EstadoBadge'
import { ShareButtons } from '@/components/animales/ShareButtons'
import { AnimalCard } from '@/components/animales/AnimalCard'
import { formatearEdad } from '@/utils/formatters'
import {
  Heart, Scale, Syringe, Baby, PawPrint,
  Building2, AlertCircle, Star, Calendar, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

// Genera metadatos Open Graph dinámicos para compartir en redes
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: animal } = await supabase
    .from('animales')
    .select('nombre, especie, historia, foto_principal, ciudad_rescate')
    .eq('id', id)
    .eq('visible', true)
    .single()

  if (!animal) return { title: 'Animal no encontrado' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const descripcion = animal.historia
    ? animal.historia.slice(0, 155) + '…'
    : `${animal.nombre} busca un hogar en LIVA. ¡Conócelo y dale una oportunidad!`

  return {
    title: `${animal.nombre} — Adopción`,
    description: descripcion,
    openGraph: {
      title: `${animal.nombre} busca un hogar 🐾`,
      description: descripcion,
      images: animal.foto_principal
        ? [{ url: animal.foto_principal, width: 1200, height: 630, alt: `${animal.nombre} — LIVA` }]
        : [],
      url: `${baseUrl}/animales/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${animal.nombre} busca un hogar 🐾`,
      description: descripcion,
      images: animal.foto_principal ? [animal.foto_principal] : [],
    },
  }
}

// Íconos y labels para compatibilidades
const COMPATIBILIDADES = [
  { campo: 'compatible_ninos', label: 'Compatible con niños', icono: Baby },
  { campo: 'compatible_animales', label: 'Compatible con otros animales', icono: PawPrint },
  { campo: 'apto_departamento', label: 'Apto para departamento', icono: Building2 },
]

export default async function PerfilAnimalPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Obtener datos del animal
  const { data: animal } = await supabase
    .from('animales')
    .select('*')
    .eq('id', id)
    .eq('visible', true)
    .single()

  if (!animal) notFound()

  // Obtener animales similares (misma especie, disponibles)
  const { data: similares } = await supabase
    .from('animales')
    .select('id, nombre, especie, categoria_edad, edad_meses, sexo, foto_principal, estado, ciudad_rescate, urgente, apadrinado')
    .eq('especie', animal.especie)
    .eq('visible', true)
    .eq('estado', 'disponible')
    .neq('id', id)
    .limit(4)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const urlPerfil = `${baseUrl}/animales/${id}`
  const puedeAdoptar = animal.estado === 'disponible'

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Columna izquierda: Galería */}
          <div>
            <GaleriaFotos
              fotoPrincipal={animal.foto_principal}
              fotos={animal.fotos ?? []}
              nombreAnimal={animal.nombre}
            />
          </div>

          {/* Columna derecha: Información */}
          <div className="flex flex-col">
            {/* Header del perfil */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <EstadoBadge estado={animal.estado} tamaño="md" />
                {animal.urgente && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold border border-red-200">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Adopción urgente
                  </span>
                )}
                {animal.apadrinado && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF0EC] text-[#E85D3A] text-sm font-semibold border border-[#E85D3A]/20">
                    <Star className="h-3.5 w-3.5 fill-[#E85D3A]" />
                    Apadrinado
                  </span>
                )}
              </div>

              <h1 className="font-lora text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">
                {animal.nombre}
              </h1>

              {animal.ciudad_rescate && (
                <p className="flex items-center gap-1.5 text-[#6B6B6B]">
                  <MapPin className="h-4 w-4 text-[#E85D3A]" />
                  Rescatado en {animal.ciudad_rescate}
                </p>
              )}
            </div>

            {/* Ficha técnica */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: 'Especie',
                  valor: animal.especie === 'perro' ? '🐕 Perro' : animal.especie === 'gato' ? '🐱 Gato' : '🐾 Otro',
                },
                {
                  label: 'Raza',
                  valor: animal.raza_estimada ?? 'Mixta',
                },
                {
                  label: 'Edad',
                  valor: animal.edad_meses ? formatearEdad(animal.edad_meses) : 'No registrada',
                },
                {
                  label: 'Peso',
                  valor: animal.peso_kg ? `${animal.peso_kg} kg` : 'No registrado',
                },
                {
                  label: 'Sexo',
                  valor: animal.sexo === 'macho' ? '♂ Macho' : animal.sexo === 'hembra' ? '♀ Hembra' : 'No registrado',
                },
                {
                  label: 'Esterilizado',
                  valor: animal.esterilizado ? '✅ Sí' : '❌ No',
                },
              ].map(({ label, valor }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl border border-[#E8E0D8] p-3 shadow-sm"
                >
                  <p className="text-xs text-[#6B6B6B] font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{valor}</p>
                </div>
              ))}
            </div>

            {/* Compatibilidades */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3 uppercase tracking-wide">
                Compatibilidades
              </h2>
              <div className="flex flex-col gap-2">
                {COMPATIBILIDADES.map(({ campo, label, icono: Icono }) => {
                  const esCompatible = Boolean(animal[campo as keyof typeof animal])
                  return (
                    <div key={campo} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg
                        ${esCompatible ? 'bg-[#E8F5EE] text-[#2D6A4F]' : 'bg-gray-100 text-gray-400'}`}>
                        <Icono className="h-4 w-4" />
                      </div>
                      <span className={`text-sm ${esCompatible ? 'text-[#1A1A1A] font-medium' : 'text-[#6B6B6B] line-through'}`}>
                        {label}
                      </span>
                      <span className="ml-auto text-sm">
                        {esCompatible ? '✅' : '❌'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {puedeAdoptar ? (
                <Button
                  className="flex-1 bg-[#E85D3A] hover:bg-[#C94B2A] text-white font-bold py-6 rounded-xl text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  asChild
                >
                  <Link href={`/adoptar?animal=${id}`}>
                    <Heart className="h-5 w-5 mr-2 fill-white" />
                    Quiero adoptar a {animal.nombre}
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className="flex-1 py-6 rounded-xl text-base opacity-60"
                >
                  {animal.estado === 'adoptado' ? '✓ Ya fue adoptado' : 'No disponible'}
                </Button>
              )}

              <Button
                variant="outline"
                className="sm:w-auto border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#E8F5EE] py-6 rounded-xl font-semibold"
                asChild
              >
                <Link href={`/donar?animal_id=${id}&tipo=apadrinamiento`}>
                  <Star className="h-4 w-4 mr-2" />
                  Apadrinar
                </Link>
              </Button>
            </div>

            {/* Compartir */}
            <ShareButtons animal={{ id, nombre: animal.nombre, foto_principal: animal.foto_principal }} urlPerfil={urlPerfil} />
          </div>
        </div>

        {/* Historia */}
        {animal.historia && (
          <section className="mb-12 max-w-3xl">
            <h2 className="font-lora text-2xl font-bold text-[#1A1A1A] mb-4">
              Su historia 📖
            </h2>
            <div className="bg-white rounded-2xl border border-[#E8E0D8] p-8 shadow-card">
              <p className="font-lora text-lg text-[#1A1A1A] leading-relaxed whitespace-pre-line">
                {animal.historia}
              </p>
            </div>
          </section>
        )}

        {/* Personalidad */}
        {animal.personalidad && (
          <section className="mb-12 max-w-3xl">
            <h2 className="font-lora text-2xl font-bold text-[#1A1A1A] mb-4">
              Su personalidad ✨
            </h2>
            <div className="bg-[#FEF0EC] rounded-2xl border border-[#E85D3A]/20 p-8">
              <p className="text-base text-[#1A1A1A] leading-relaxed">{animal.personalidad}</p>
            </div>
          </section>
        )}

        {/* Necesidades especiales */}
        {animal.necesidades_especiales && (
          <section className="mb-12 max-w-3xl">
            <h2 className="font-lora text-2xl font-bold text-[#1A1A1A] mb-4">
              Necesidades especiales 💊
            </h2>
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8">
              <p className="text-base text-[#1A1A1A] leading-relaxed">{animal.necesidades_especiales}</p>
            </div>
          </section>
        )}

        {/* Separador */}
        {similares && similares.length > 0 && (
          <section>
            <h2 className="font-lora text-2xl font-bold text-[#1A1A1A] mb-6">
              También buscan un hogar 🐾
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similares.map((a) => (
                <AnimalCard key={a.id} animal={a as any} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
