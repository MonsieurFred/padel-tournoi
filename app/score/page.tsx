'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Match = {
  id: number
  rotation: number
  horaire: string
  groupe: string
  terrain: string
  equipe_a: string
  equipe_b: string
  score_a: number | null
  score_b: number | null
  points_a: number | null
  points_b: number | null
}

const GROUPE_COLOR: Record<string, string> = {
  'Compétiteurs': '#f59e0b',
  'Intermédiaires': '#10b981',
  'Débutants': '#6366f1',
}

function Header({ terrain, rotation, groupe }: { terrain: string; rotation?: number; groupe?: string }) {
  const color = groupe ? GROUPE_COLOR[groupe] ?? '#10b981' : '#10b981'
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-bold text-lg">{terrain}</span>
          {rotation && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>Round {rotation}</span>}
        </div>
        {groupe && <p className="text-xs font-medium" style={{ color }}>{groupe}</p>}
      </div>
    </div>
  )
}

function ScorePageInner() {
  const searchParams = useSearchParams()
  const terrain = searchParams.get('terrain')

  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [wrongTerrain, setWrongTerrain] = useState(false)
  const [jeuxA, setJeuxA] = useState('')
  const [jeuxB, setJeuxB] = useState('')
  const [ptsA, setPtsA] = useState('')
  const [ptsB, setPtsB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    if (terrain) loadCurrentMatch()
  }, [terrain])

  async function loadCurrentMatch() {
    setLoading(true)
    setConfirmed(false)
    setDone(false)
    setJeuxA(''); setJeuxB(''); setPtsA(''); setPtsB('')
    const res = await fetch(`/api/score?terrain=${encodeURIComponent(terrain!)}&_=${Date.now()}`, { cache: 'no-store' })
    const data = await res.json()
    if (data.match) { setMatch(data.match); setAllDone(false) }
    else { setMatch(null); setAllDone(true) }
    setLoading(false)
  }

  async function submit() {
    if (!match) return
    const jA = parseInt(jeuxA), jB = parseInt(jeuxB)
    const pA = parseInt(ptsA), pB = parseInt(ptsB)
    if (isNaN(jA) || isNaN(jB) || isNaN(pA) || isNaN(pB)) return
    setSubmitting(true)
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', matchId: match.id, scoreA: jA, scoreB: jB, pointsA: pA, pointsB: pB }),
    })
    const data = await res.json()
    if (data.ok) setDone(true)
    setSubmitting(false)
  }

  const cardStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
  const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.1)' }

  if (!terrain) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-6">📲</div>
        <h2 className="text-xl font-bold mb-2">Scanne le QR code</h2>
        <p className="text-slate-400 mb-8">Chaque terrain a son propre QR code affiché sur place.</p>
        <Link href="/" className="text-sm" style={{ color: '#10b981' }}>← Retour à l'accueil</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500 text-sm font-medium">Chargement…</div>
      </div>
    )
  }

  if (allDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-2">Terrain terminé !</h2>
        <p className="text-slate-400 mb-2">Tous les matchs de <strong className="text-white">{terrain}</strong> sont encodés.</p>
        <p className="text-slate-500 text-sm mb-8">Merci pour votre participation !</p>
        <Link href="/classement"
          className="px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={{ background: '#10b981', color: '#fff' }}>
          Voir le classement
        </Link>
      </div>
    )
  }

  if (done && match) {
    const jA = parseInt(jeuxA), jB = parseInt(jeuxB)
    const aWon = jA > jB
    const bWon = jB > jA
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold">Score enregistré</h2>
            <p className="text-slate-400 text-sm mt-1">{match.terrain} · {match.horaire}</p>
          </div>

          <div className="rounded-2xl p-5 mb-6" style={cardStyle}>
            <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm font-medium flex-1 pr-4">{match.equipe_a}</span>
              <div className="text-right">
                <span className="text-2xl font-black" style={{ color: aWon ? '#10b981' : bWon ? '#94a3b8' : '#f8fafc' }}>{jeuxA}</span>
                <span className="text-xs text-slate-500 block">{ptsA} pts</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium flex-1 pr-4">{match.equipe_b}</span>
              <div className="text-right">
                <span className="text-2xl font-black" style={{ color: bWon ? '#10b981' : aWon ? '#94a3b8' : '#f8fafc' }}>{jeuxB}</span>
                <span className="text-xs text-slate-500 block">{ptsB} pts</span>
              </div>
            </div>
          </div>

          <Link href="/classement"
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{ background: '#10b981', color: '#fff' }}>
            <span>Voir le classement</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!confirmed && match) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6">
        <div className="w-full max-w-sm mx-auto">
          <Header terrain={match.terrain} rotation={match.rotation} groupe={match.groupe} />

          <h2 className="text-2xl font-bold mb-6">C'est bien votre match ?</h2>

          <div className="rounded-2xl overflow-hidden mb-8" style={cardStyle}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Équipe A</p>
              <p className="font-semibold text-base">{match.equipe_a}</p>
            </div>
            <div className="px-5 py-2 text-center">
              <span className="text-xs font-bold text-slate-500 tracking-widest">VS</span>
            </div>
            <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Équipe B</p>
              <p className="font-semibold text-base">{match.equipe_b}</p>
            </div>
          </div>

          {wrongTerrain ? (
            <div className="rounded-2xl px-6 py-6 text-center" style={cardStyle}>
              <div className="text-3xl mb-3">📲</div>
              <p className="font-semibold mb-1">Scanne le QR code de ton terrain</p>
              <p className="text-slate-400 text-sm">Chaque terrain a son propre QR code affiché sur place.</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setConfirmed(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
                style={{ background: '#10b981', color: '#fff' }}>
                Oui, c'est nous
              </button>
              <button onClick={() => setWrongTerrain(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Non
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (confirmed && match) {
    const canSubmit = jeuxA !== '' && jeuxB !== '' && ptsA !== '' && ptsB !== ''
    return (
      <div className="min-h-screen flex flex-col justify-center px-6">
        <div className="w-full max-w-sm mx-auto">
          <Header terrain={match.terrain} rotation={match.rotation} groupe={match.groupe} />

          <h2 className="text-2xl font-bold mb-6">Entrez les scores</h2>

          {/* Équipe A */}
          <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">{match.equipe_a}</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <input type="number" inputMode="numeric" min={0} value={jeuxA}
                  onChange={e => setJeuxA(e.target.value)} placeholder="0" autoFocus
                  className="w-full rounded-xl py-4 text-3xl font-black text-center text-white focus:outline-none transition-all"
                  style={{ ...inputStyle, ...(jeuxA !== '' ? { borderColor: '#10b981' } : {}) }}
                />
                <p className="text-center text-slate-500 text-xs mt-2 font-medium uppercase tracking-wider">Jeux</p>
              </div>
              <div className="flex-1">
                <input type="number" inputMode="numeric" min={0} value={ptsA}
                  onChange={e => setPtsA(e.target.value)} placeholder="0"
                  className="w-full rounded-xl py-4 text-3xl font-black text-center text-white focus:outline-none transition-all"
                  style={{ ...inputStyle, ...(ptsA !== '' ? { borderColor: '#10b981' } : {}) }}
                />
                <p className="text-center text-slate-500 text-xs mt-2 font-medium uppercase tracking-wider">Points</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <span className="text-xs font-bold text-slate-600 tracking-widest">VS</span>
          </div>

          {/* Équipe B */}
          <div className="rounded-2xl p-4 mb-8" style={cardStyle}>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">{match.equipe_b}</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <input type="number" inputMode="numeric" min={0} value={jeuxB}
                  onChange={e => setJeuxB(e.target.value)} placeholder="0"
                  className="w-full rounded-xl py-4 text-3xl font-black text-center text-white focus:outline-none transition-all"
                  style={{ ...inputStyle, ...(jeuxB !== '' ? { borderColor: '#10b981' } : {}) }}
                />
                <p className="text-center text-slate-500 text-xs mt-2 font-medium uppercase tracking-wider">Jeux</p>
              </div>
              <div className="flex-1">
                <input type="number" inputMode="numeric" min={0} value={ptsB}
                  onChange={e => setPtsB(e.target.value)} placeholder="0"
                  className="w-full rounded-xl py-4 text-3xl font-black text-center text-white focus:outline-none transition-all"
                  style={{ ...inputStyle, ...(ptsB !== '' ? { borderColor: '#10b981' } : {}) }}
                />
                <p className="text-center text-slate-500 text-xs mt-2 font-medium uppercase tracking-wider">Points</p>
              </div>
            </div>
          </div>

          <button onClick={submit} disabled={submitting || !canSubmit}
            className="w-full py-5 rounded-2xl font-bold text-lg transition-all active:scale-95"
            style={{ background: canSubmit ? '#10b981' : 'rgba(255,255,255,0.07)', color: canSubmit ? '#fff' : '#475569', border: canSubmit ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
            {submitting ? 'Enregistrement…' : 'Valider le score'}
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function ScorePage() {
  return (
    <Suspense>
      <ScorePageInner />
    </Suspense>
  )
}
