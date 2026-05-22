import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1f3d 100%)' }}>

      {/* Branding */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <span className="text-4xl">🎾</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
          Tournoi Padel
        </h1>
        <p className="text-slate-400 text-base font-medium">22 mai 2025 · 18h30 → 20h00</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            12 terrains
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            3 groupes
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link
          href="/score"
          className="flex items-center justify-between px-6 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{ background: '#10b981', color: '#fff' }}
        >
          <span>Entrer un score</span>
          <span className="text-2xl">✏️</span>
        </Link>

        <Link
          href="/classement"
          className="flex items-center justify-between px-6 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <span>Classement en direct</span>
          <span className="text-2xl">🏆</span>
        </Link>
      </div>

      <div className="mt-16">
        <Link href="/admin" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
          Accès admin
        </Link>
      </div>
    </div>
  )
}
