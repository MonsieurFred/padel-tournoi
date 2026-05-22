import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🎾</div>
        <h1 className="text-4xl font-bold mb-2">Tournoi Padel</h1>
        <p className="text-slate-400 text-lg">Beau temps · 12 terrains · 18h30 → 20h00</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/score"
          className="flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xl py-5 rounded-2xl transition-colors shadow-lg"
        >
          <span className="text-2xl">✏️</span>
          Entrer un score
        </Link>

        <Link
          href="/classement"
          className="flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl py-5 rounded-2xl transition-colors shadow-lg"
        >
          <span className="text-2xl">🏆</span>
          Voir le classement
        </Link>
      </div>

      <div className="mt-16 text-slate-500 text-sm">
        <Link href="/admin" className="hover:text-slate-400 underline underline-offset-2">
          Accès admin
        </Link>
      </div>
    </div>
  )
}
