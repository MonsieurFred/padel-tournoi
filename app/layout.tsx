import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tournoi Padel',
  description: 'Saisie des scores et classement en direct',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
