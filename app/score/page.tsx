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
    const res = await fetch(`/api/score?terrain=${encodeURIComponent(terrain!)}`)
    const data = await res.json()
    if (data.match) {
      setMatch(data.match)
      setAllDone(false)
    } else {
      setMatch(null)
      setAllDone(true)
    }
    setLoading(false)
  }

  async function submit() {
    if (!match) return
    const jA = parseInt(jeuxA)
    const jB = parseInt(jeuxB)
    const pA = parseInt(ptsA)
    const pB = parseInt(ptsB)
    if (isNaN(jA) || isNaN(jB) || isNaN(pA) || isNaN(pB)) return
    setSubmitting(true)
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', matchId: match.id, scoreA: jA, scoreB: jB, pointsA: pA, pointsB: pB }),
    })
    const data = await res.json()
    if (data.ok) {
      setDone(true)
    }
    setSubmitting(false)
  }

  if (!terrain) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-400 text-lg mb-6">Scanne le QR code de ton terrain pour commencer.</p>
        <Link href="/" className="text-yellow-400 underline">Retour à l'accueil</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 text-xl">Chargement…</p>
      </div>
    )
  }

  if (allDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-2">Tous les matchs terminés !</h2>
        <p className="text-slate-400 mb-8">Terrain {terrain} — tous les scores sont enregistrés.</p>
        <Link href="/classement" className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-8 py-4 rounded-2xl text-lg">
          Voir le classement
        </Link>
      </div>
    )
  }

  if (done && match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-6">Score enregistré !</h2>

        <div className="w-full max-w-xs bg-slate-800 rounded-2xl p-6 mb-8">
          <p className="text-slate-400 text-sm mb-4">{match.terrain} · {match.horaire}</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-left text-sm flex-1">{match.equipe_a}</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-3xl font-bold text-yellow-400">{jeuxA}</span>
              <span className="text-slate-500 text-sm">({ptsA} pts)</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-left text-sm flex-1">{match.equipe_b}</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-3xl font-bold text-yellow-400">{jeuxB}</span>
              <span className="text-slate-500 text-sm">({ptsB} pts)</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs">
          <Link href="/classement" className="block w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-2xl text-lg text-center transition-colors">
            Voir le classement
          </Link>
        </div>
      </div>
    )
  }

  if (!confirmed && match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs">
          <p className="text-slate-400 text-center mb-2 text-sm">{match.terrain} · {match.horaire}</p>
          <h2 className="text-2xl font-bold text-center mb-8">C'est bien ton match ?</h2>

          <div className="bg-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full bg-slate-700 rounded-xl px-4 py-4 text-center">
                <p className="font-semibold text-lg">{match.equipe_a}</p>
              </div>
              <p className="text-slate-500 font-bold">VS</p>
              <div className="w-full bg-slate-700 rounded-xl px-4 py-4 text-center">
                <p className="font-semibold text-lg">{match.equipe_b}</p>
              </div>
            </div>
          </div>

          {wrongTerrain ? (
            <div className="text-center bg-slate-800 rounded-2xl p-6">
              <p className="text-2xl mb-3">📲</p>
              <p className="text-white font-semibold mb-1">Scanne le QR code de ton terrain</p>
              <p className="text-slate-400 text-sm">Chaque terrain a son propre QR code affiché sur place.</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmed(true)}
                className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-5 rounded-2xl text-2xl transition-colors"
              >
                ✅
              </button>
              <button
                onClick={() => setWrongTerrain(true)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-5 rounded-2xl text-2xl transition-colors"
              >
                ❌
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (confirmed && match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs">
          <p className="text-slate-400 text-center text-sm mb-6">{match.terrain} · {match.horaire}</p>

          {/* Équipe A */}
          <p className="text-slate-300 text-sm mb-2 text-center">{match.equipe_a}</p>
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <input
                type="number" inputMode="numeric" min={0}
                value={jeuxA} onChange={e => setJeuxA(e.target.value)}
                placeholder="0" autoFocus
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-yellow-400 rounded-2xl py-5 text-4xl font-bold text-center text-white focus:outline-none transition-colors"
              />
              <p className="text-center text-slate-500 text-xs mt-1">jeux</p>
            </div>
            <div className="flex-1">
              <input
                type="number" inputMode="numeric" min={0}
                value={ptsA} onChange={e => setPtsA(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-yellow-400 rounded-2xl py-5 text-4xl font-bold text-center text-white focus:outline-none transition-colors"
              />
              <p className="text-center text-slate-500 text-xs mt-1">points</p>
            </div>
          </div>

          <div className="text-center text-slate-500 font-bold text-lg mb-6">VS</div>

          {/* Équipe B */}
          <p className="text-slate-300 text-sm mb-2 text-center">{match.equipe_b}</p>
          <div className="flex gap-3 mb-8">
            <div className="flex-1">
              <input
                type="number" inputMode="numeric" min={0}
                value={jeuxB} onChange={e => setJeuxB(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-yellow-400 rounded-2xl py-5 text-4xl font-bold text-center text-white focus:outline-none transition-colors"
              />
              <p className="text-center text-slate-500 text-xs mt-1">jeux</p>
            </div>
            <div className="flex-1">
              <input
                type="number" inputMode="numeric" min={0}
                value={ptsB} onChange={e => setPtsB(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-yellow-400 rounded-2xl py-5 text-4xl font-bold text-center text-white focus:outline-none transition-colors"
              />
              <p className="text-center text-slate-500 text-xs mt-1">points</p>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={submitting || jeuxA === '' || jeuxB === '' || ptsA === '' || ptsB === ''}
            className="w-full bg-yellow-400 disabled:opacity-40 hover:bg-yellow-300 text-slate-900 font-bold py-5 rounded-2xl text-xl transition-colors"
          >
            {submitting ? '…' : 'Valider'}
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
