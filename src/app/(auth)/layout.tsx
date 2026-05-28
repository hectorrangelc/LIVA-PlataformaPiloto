// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center py-12 px-4">
      {children}
    </div>
  )
}
