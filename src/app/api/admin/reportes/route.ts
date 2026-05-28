import { NextResponse } from 'next/server'
import { generarReporte } from '@/lib/reportes/generarReporte'
import Papa from 'papaparse'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mes    = parseInt(searchParams.get('mes')    ?? String(new Date().getMonth() + 1), 10)
  const anio   = parseInt(searchParams.get('anio')   ?? String(new Date().getFullYear()),  10)
  const formato = searchParams.get('formato') ?? 'json'

  const datos = await generarReporte(mes, anio)

  if (formato === 'csv') {
    const filas = Object.entries(datos).map(([key, val]) => ({ metrica: key, valor: val }))
    const csv = Papa.unparse(filas)
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="reporte-liva-${anio}-${String(mes).padStart(2,'0')}.csv"`,
      },
    })
  }

  return NextResponse.json(datos)
}
