'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ROTATIONS = [
  { numero: 1, horaire: '18h30 - 18h45' },
  { numero: 2, horaire: '18h45 - 19h00' },
  { numero: 3, horaire: '19h00 - 19h15' },
  { numero: 4, horaire: '19h15 - 19h30' },
  { numero: 5, horaire: '19h30 - 19h45' },
  { numero: 6, horaire: '19h45 - 20h00' },
]

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

type Step = 'rotation' | 'terrain' | 'confirm' | 'score' | 'done'

function getCurrentRotation(): number {
  const now = new Date()
  const t = now.getHours() * 60 + now.getMinutes()
  if (t < 18 * 60 + 30) return 1
  if (t < 18 * 60 + 45) return 1
  if (t < 19 * 60 + 0) return 2
  if (t < 19 * 60 + 15) return 3
  if (t < 19 * 60 + 30) return 4
  if (t < 19 * 60 + 45) return 5
  return 6
}

const GROUPE_EMOJI: Record<string, string> = {
  'Compétiteurs': '🏆',
  'Intermédiaires': '😜',
  'Débutants': '🥉',
}

function ScorePageInner() {
  const searchParams = useSearchParams()
  const terrainParam = searchParams.get('terrain')

  const [step, setStep] = useState<Step>(terrainParam ? 'confirm' : 'rotation')
  const [rotation, setRotation] = useState<number>(getCurrentRotation())
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (terrainParam) {
      const rot = getCurrentRotation()
      setRotation(rot)
      loadMatchForTerrain(terrainParam, rot)
    }
  }, [terrainParam])

  async function loadMatchForTerrain(terrain: string, rot: number) {
    const res = await fetch(`/api/classement?rotation=${rot}`)
    const data = await res.json()
    const all: Match[] = data.matches || []
    const match = all.find(m => m.terrain === terrain)
    if (match) {
      setSelectedMatch(match)
      setMatches(all)
    }
  }

  async function loadMatches(rot: number) {
    const res = await fetch(`/api/classement?rotation=${rot}`)
    const data = await res.json()
    setMatches(data.matches || [])
    setRotation(rot)
    setStep('terrain')
  }

  async function submitScore() {
    if (!selectedMatch) return
    const sA = parseInt(scoreA)
    const sB = parseInt(scoreB)
    if (isNaN(sA) || isNaN(sB) || sA < 0 || sB < 0) {
      setError('Scores invalides')
      return
    }
    setSubmitting(true)
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', matchId: selectedMatch.id, scoreA: sA, scoreB: sB }),
    })
    const data = await res.json()
    if (data.ok) {
      setNextMatch(data.nextMatch || null)
      setStep('done')
    } else {
      setError(data.error || 'Erreur lors de la soumission')
    }
    setSubmitting(false)
  }

  function reset() {
    setStep(terrainParam ? 'confirm' : 'rotation')
    setScoreA(''); setScoreB(''); setNextMatch(null); setError('')
    if (terrainParam) {
      const rot = getCurrentRotation()
      loadMatchForTerrain(terrainParam, rot)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-slate-400 hover:text-white text-2xl">←</Link>
        <h1 className="text-2xl font-bold">
          {terrainParam ? `Terrain ${terrainParam}` : 'Entrer un score'}
        </h1>
      </div>

      {/* Étape 1 : Rotation (mode global) */}
      {step === 'rotation' && (
        <div>
          <p className="text-slate-400 mb-4">Sélectionne ta rotation :</p>
          <div className="flex flex-col gap-3">
            {ROTATIONS.map(r => (
              <button
                key={r.numero}
                onClick={() => loadMatches(r.numero)}
                className={`flex items-center justify-between px-5 py-4 rounded-xl font-semibold text-left transition-colors
                  ${r.numero === getCurrentRotation()
                    ? 'bg-yellow-400 text-slate-900'
                    : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                <span>Rotation {r.numero}</span>
                <span className="text-sm font-normal opacity-80">{r.horaire}</span>
                {r.numero === getCurrentRotation() && (
                  <span className="text-xs bg-slate-900/30 px-2 py-0.5 rounded-full ml-2">EN COURS</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape 2 : Terrain (mode global) */}
      {step === 'terrain' && (
        <div>
          <p className="text-slate-400 mb-4">Rotation {rotation} · {ROTATIONS[rotation - 1].horaire}</p>
          <div className="flex flex-col gap-3">
            {matches.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedMatch(m); setStep('confirm') }}
                disabled={m.score_a !== null}
                className={`flex flex-col px-5 py-4 rounded-xl text-left transition-colors
                  ${m.score_a !== null ? 'bg-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-yellow-400">{m.terrain}</span>
                  <span className="text-sm text-slate-400">{GROUPE_EMOJI[m.groupe]}</span>
                </div>
                <p className="text-sm">{m.equipe_a}</p>
                <p className="text-xs text-slate-400 my-0.5">vs</p>
                <p className="text-sm">{m.equipe_b}</p>
                {m.score_a !== null && (
                  <p className="text-xs text-green-400 mt-1">✓ {m.score_a} - {m.score_b}</p>
                )}
              </button>
            ))}
          </div>
          <button onClick={() => setStep('rotation')} className="mt-4 text-slate-400 hover:text-white text-sm">
            ← Changer de rotation
          </button>
        </div>
      )}

      {/* Étape 3 : Confirmation du match */}
      {step === 'confirm' && (
        <div>
          {selectedMatch ? (
            <>
              <p className="text-slate-400 mb-6 text-lg">C'est bien ton match ?</p>

              <div className="bg-slate-800 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400 font-bold text-xl">{selectedMatch.terrain}</span>
                  <span className="text-slate-500 text-sm">{selectedMatch.horaire}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-full bg-slate-700 rounded-xl px-4 py-3 text-center">
                    <p className="font-semibold text-white">{selectedMatch.equipe_a}</p>
                  </div>
                  <span className="text-slate-400 font-bold text-lg">VS</span>
                  <div className="w-full bg-slate-700 rounded-xl px-4 py-3 text-center">
                    <p className="font-semibold text-white">{selectedMatch.equipe_b}</p>
                  </div>
                </div>

                {selectedMatch.score_a !== null && (
                  <p className="text-green-400 text-sm text-center mt-4">
                    ✓ Score déjà enregistré : {selectedMatch.score_a} - {selectedMatch.score_b}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('score')}
                  disabled={selectedMatch.score_a !== null}
                  className="flex-1 bg-green-500 disabled:opacity-40 hover:bg-green-400 text-white font-bold py-5 rounded-2xl text-xl transition-colors"
                >
                  ✅ Oui
                </button>
                <button
                  onClick={() => terrainParam ? setStep('rotation') : setStep('terrain')}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-5 rounded-2xl text-xl transition-colors"
                >
                  ❌ Non
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-400">Chargement du match…</p>
          )}
        </div>
      )}

      {/* Étape 4 : Saisie des scores */}
      {step === 'score' && selectedMatch && (
        <div>
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 font-bold">{selectedMatch.terrain} · {selectedMatch.horaire}</p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-slate-300 text-sm mb-2 block font-medium">{selectedMatch.equipe_a}</label>
              <input
                type="number" inputMode="numeric" min={0}
                value={scoreA} onChange={e => setScoreA(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-4xl text-center font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div className="text-center text-slate-500 font-bold">VS</div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block font-medium">{selectedMatch.equipe_b}</label>
              <input
                type="number" inputMode="numeric" min={0}
                value={scoreB} onChange={e => setScoreB(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-4xl text-center font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={submitScore}
            disabled={submitting || scoreA === '' || scoreB === ''}
            className="w-full bg-green-500 disabled:opacity-50 hover:bg-green-400 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            {submitting ? 'Envoi...' : 'Confirmer le score'}
          </button>
          <button onClick={() => setStep('confirm')} className="mt-3 w-full text-slate-400 hover:text-white text-sm py-2">
            ← Retour
          </button>
        </div>
      )}

      {/* Étape 5 : Confirmation finale */}
      {step === 'done' && selectedMatch && (
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Score enregistré !</h2>
          <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
            <p className="text-yellow-400 font-bold mb-2">{selectedMatch.terrain}</p>
            <p className="text-sm">{selectedMatch.equipe_a} <span className="text-yellow-400 font-bold text-lg ml-2">{scoreA}</span></p>
            <p className="text-sm">{selectedMatch.equipe_b} <span className="text-yellow-400 font-bold text-lg ml-2">{scoreB}</span></p>
          </div>

          {nextMatch && (
            <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <p className="text-slate-400 text-sm mb-2">Prochain match sur ce terrain :</p>
              <p className="font-semibold">{nextMatch.equipe_a}</p>
              <p className="text-slate-400 text-xs">vs</p>
              <p className="font-semibold">{nextMatch.equipe_b}</p>
              <p className="text-xs text-slate-500 mt-1">{nextMatch.horaire}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={reset} className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-xl text-lg transition-colors">
              Entrer un autre score
            </button>
            <Link href="/classement" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl text-lg text-center transition-colors">
              Voir le classement
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ScorePage() {
  return (
    <Suspense>
      <ScorePageInner />
    </Suspense>
  )
}
