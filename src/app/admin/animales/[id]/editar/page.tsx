import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FormularioAnimal } from '@/components/admin/FormularioAnimal'
import type { Animal } from '@/types'

export const metadata: Metadata = { title: 'Editar animal — Admin LIVA' }

export default async function EditarAnimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: animal } = await supabase.from('animales').select('*').eq('id', id).single()
  if (!animal) notFound()
  return (
    <div>
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Editar — {animal.nombre}</h1>
      </div>
      <FormularioAnimal animal={animal as Animal} />
    </div>
  )
}
