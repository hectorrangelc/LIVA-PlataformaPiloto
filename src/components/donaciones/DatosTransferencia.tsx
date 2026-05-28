// src/components/donaciones/DatosTransferencia.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Copy, Check, Upload } from 'lucide-react'

const DATOS_BANCARIOS = {
  banco: 'BBVA',
  clabe: '012 180 0012345678 90',
  numero_cuenta: '0123456789',
  beneficiario: 'Asociación LIVA A.C.',
  referencia: 'DONATIVO LIVA',
}

export function DatosTransferencia() {
  const [clabeCopiada, setClabeCopiada] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const supabase = createClient()

  async function copiarClabe() {
    await navigator.clipboard.writeText(DATOS_BANCARIOS.clabe.replace(/\s/g, ''))
    setClabeCopiada(true)
    setTimeout(() => setClabeCopiada(false), 2000)
  }

  async function subirComprobante(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    if (archivo.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe superar 5 MB')
      return
    }

    setSubiendo(true)
    const nombreArchivo = `${Date.now()}-${archivo.name}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('comprobantes')
      .upload(nombreArchivo, archivo)

    if (uploadError) {
      toast.error('Error al subir el comprobante')
      setSubiendo(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('comprobantes')
      .getPublicUrl(uploadData.path)

    const { error: dbError } = await supabase.from('donaciones').insert({
      monto_mxn: 0,
      tipo: 'unica',
      canal: 'transferencia',
      estado: 'pendiente',
      comprobante_url: urlData.publicUrl,
      notas: 'Comprobante pendiente de verificación por el equipo LIVA',
    })

    if (dbError) {
      toast.error('Error al registrar el comprobante')
    } else {
      toast.success('¡Comprobante enviado! El equipo LIVA lo verificará en breve.')
    }
    setSubiendo(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
      <h3 className="font-bold text-[#1A1A1A] mb-4">Transferencia bancaria</h3>

      <div className="space-y-3 mb-5">
        {Object.entries({
          Beneficiario: DATOS_BANCARIOS.beneficiario,
          Banco: DATOS_BANCARIOS.banco,
          'No. de cuenta': DATOS_BANCARIOS.numero_cuenta,
          Referencia: DATOS_BANCARIOS.referencia,
        }).map(([label, valor]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-[#6B6B6B]">{label}</span>
            <span className="font-medium text-[#1A1A1A]">{valor}</span>
          </div>
        ))}

        <div className="flex items-center justify-between bg-[#F5F0EB] rounded-xl p-3">
          <div>
            <p className="text-xs text-[#6B6B6B]">CLABE interbancaria</p>
            <p className="font-mono font-bold text-[#1A1A1A] text-sm tracking-wider">
              {DATOS_BANCARIOS.clabe}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copiarClabe}
            className="shrink-0 ml-3 border-[#E8E0D8]"
          >
            {clabeCopiada
              ? <><Check className="w-3.5 h-3.5 text-green-600 mr-1" /> Copiada</>
              : <><Copy className="w-3.5 h-3.5 mr-1" /> Copiar</>}
          </Button>
        </div>
      </div>

      <div className="border-t border-[#E8E0D8] pt-4">
        <p className="text-sm text-[#6B6B6B] mb-3">
          ¿Ya realizaste la transferencia? Sube tu comprobante para que podamos confirmarlo.
        </p>
        <label className={`flex items-center gap-2 justify-center w-full py-2.5 px-4 rounded-xl border border-dashed border-[#E85D3A] text-[#E85D3A] text-sm font-medium cursor-pointer hover:bg-[#FEF0EC] transition-colors ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-4 h-4" />
          {subiendo ? 'Subiendo...' : 'Subir comprobante (PDF, JPG, PNG)'}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={subirComprobante}
            disabled={subiendo}
          />
        </label>
      </div>
    </div>
  )
}
