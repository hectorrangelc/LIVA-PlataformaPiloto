import type { Metadata } from 'next'
import { FormularioAnimal } from '@/components/admin/FormularioAnimal'

export const metadata: Metadata = { title: 'Nuevo animal — Admin LIVA' }

export default function NuevoAnimalPage() {
  return (
    <div>
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Nuevo animal</h1>
      </div>
      <FormularioAnimal />
    </div>
  )
}
