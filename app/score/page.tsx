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
}

function ScorePageInner() {
  const searchParams = useSearchParams()
  const terrain = searchParams.get('terrain')

  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    if (terrain) loadCurrentMatch()
  }, [terrain])

  async function loadCurrentMatch() {
    setLoading(true)
    setConfirmed(false)
    setDone(false)
    setScoreA('')
    setScoreB('')
    // Cherche le premier match sans score pour ce terrain
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
    const sA = parseInt(scoreA)
    const sB = parseInt(scoreB)
    if (isNaN(sA) || isNaN(sB)) return
    setSubmitting(true)
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', matchId: match.id, scoreA: sA, scoreB: sB }),
    })
    const data = await res.json()
    if (data.ok) {
      setNextMatch(data.nextMatch || null)
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

  // Écran de confirmation du score enregistré
  if (done && match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-6">Score enregistré !</h2>

        <div className="w-full max-w-xs bg-slate-800 rounded-2xl p-6 mb-8">
          <p className="text-slate-400 text-sm mb-4">{match.terrain} · {match.horaire}</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-left text-sm flex-1">{match.equipe_a}</span>
            <span className="text-3xl font-bold text-yellow-400 w-10 text-center">{scoreA}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-left text-sm flex-1">{match.equipe_b}</span>
            <span className="text-3xl font-bold text-yellow-400 w-10 text-center">{scoreB}</span>
          </div>
        </div>

        {nextMatch ? (
          <div className="w-full max-w-xs">
            <p className="text-slate-400 mb-4">Prochain match sur ce terrain :</p>
            <div className="bg-slate-800 rounded-2xl p-5 mb-6 text-left">
              <p className="text-slate-400 text-xs mb-3">{nextMatch.horaire}</p>
              <p className="font-semibold mb-1">{nextMatch.equipe_a}</p>
              <p className="text-slate-500 text-sm mb-1">vs</p>
              <p className="font-semibold">{nextMatch.equipe_b}</p>
            </div>
            <button
              onClick={loadCurrentMatch}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-2xl text-lg transition-colors"
            >
              Entrer le score suivant
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs">
            <p className="text-slate-400 mb-6">Plus de matchs sur ce terrain.</p>
            <Link href="/classement" className="block w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-2xl text-lg text-center transition-colors">
              Voir le classement
            </Link>
          </div>
        )}
      </div>
    )
  }

  // Écran de confirmation du match
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

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmed(true)}
              className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-5 rounded-2xl text-2xl transition-colors"
            >
              ✅
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-5 rounded-2xl text-2xl transition-colors"
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Écran de saisie des scores
  if (confirmed && match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs">
          <p className="text-slate-400 text-center text-sm mb-8">{match.terrain} · {match.horaire}</p>

          <div className="flex flex-col gap-5 mb-8">
            <div>
              <p className="text-slate-300 text-sm mb-2 text-center">{match.equipe_a}</p>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={scoreA}
                onChange={e => setScoreA(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-yellow-400 rounded-2xl py-5 text-5xl font-bold text-center text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="text-center text-slate-500 font-bold text-lg">VS</div>

            <div>
              <p className="text-slate-300 text-sm mb-2 text-center">{match.equipe_b}</p>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={scoreB}
                onChange={e => setScoreB(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-yellow-400 rounded-2xl py-5 text-5xl font-bold text-center text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={submitting || scoreA === '' || scoreB === ''}
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
