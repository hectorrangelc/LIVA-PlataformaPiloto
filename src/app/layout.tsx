// app/layout.tsx
// Root layout — fuentes, metadata global y providers
import type { Metadata } from 'next'
import { Fraunces, Jost } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LIVA — Rescate y Adopción Animal en México',
    template: '%s | LIVA',
  },
  description:
    'Somos una ONG de rescate y adopción animal en México. Encuentra tu compañero ideal, dona o hazte voluntario.',
  keywords: ['adopción animal', 'rescate animal', 'perros en adopción', 'gatos en adopción', 'México', 'ONG'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'LIVA — Rescate y Adopción Animal',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-MX" className={`${fraunces.variable} ${jost.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
