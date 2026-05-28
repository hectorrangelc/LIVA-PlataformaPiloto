// src/app/(dashboard)/layout.tsx
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7]">
        {children}
      </main>
      <Footer />
    </>
  )
}
