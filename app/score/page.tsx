'use client'

import { useState } from 'react'
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
  repos: string | null
}

type Step = 'rotation' | 'terrain' | 'pin' | 'score' | 'done'

function getCurrentRotation(): number {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const total = h * 60 + m
  if (total < 18 * 60 + 30) return 1
  if (total < 18 * 60 + 45) return 1
  if (total < 19 * 60 + 0) return 2
  if (total < 19 * 60 + 15) return 3
  if (total < 19 * 60 + 30) return 4
  if (total < 19 * 60 + 45) return 5
  if (total <= 20 * 60) return 6
  return 6
}

const GROUPE_EMOJI: Record<string, string> = {
  'Compétiteurs': '🏆',
  'Intermédiaires': '😜',
  'Débutants': '🥉',
}

export default function ScorePage() {
  const [step, setStep] = useState<Step>('rotation')
  const [rotation, setRotation] = useState<number>(getCurrentRotation())
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [error, setError] = useState('')

  async function loadMatches(rot: number) {
    const res = await fetch(`/api/classement?rotation=${rot}`)
    const data = await res.json()
    setMatches(data.matches || [])
    setRotation(rot)
    setStep('terrain')
  }

  async function verifyPin() {
    if (!selectedMatch) return
    setPinError('')
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', terrain: selectedMatch.terrain, code: pin }),
    })
    const data = await res.json()
    if (data.ok) {
      setStep('score')
    } else {
      setPinError('Code incorrect. Vérifie le code affiché sur le terrain.')
    }
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

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-slate-400 hover:text-white text-2xl">←</Link>
        <h1 className="text-2xl font-bold">Entrer un score</h1>
      </div>

      {/* Étape 1 : Rotation */}
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
                    : 'bg-slate-700 hover:bg-slate-600'
                  }`}
              >
                <span>Rotation {r.numero}</span>
                <span className="text-sm font-normal opacity-80">{r.horaire}</span>
                {r.numero === getCurrentRotation() && (
                  <span className="text-xs bg-slate-900/30 px-2 py-0.5 rounded-full">EN COURS</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape 2 : Terrain */}
      {step === 'terrain' && (
        <div>
          <p className="text-slate-400 mb-1">Rotation {rotation} · {ROTATIONS[rotation - 1].horaire}</p>
          <p className="text-slate-400 mb-4">Sélectionne ton terrain :</p>
          <div className="flex flex-col gap-3">
            {matches.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedMatch(m); setStep('pin') }}
                disabled={m.score_a !== null}
                className={`flex flex-col px-5 py-4 rounded-xl text-left transition-colors
                  ${m.score_a !== null
                    ? 'bg-slate-800 opacity-50 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-yellow-400">{m.terrain}</span>
                  <span className="text-sm text-slate-400">{GROUPE_EMOJI[m.groupe]} {m.groupe}</span>
                </div>
                <p className="text-sm">{m.equipe_a}</p>
                <p className="text-xs text-slate-400 my-0.5">vs</p>
                <p className="text-sm">{m.equipe_b}</p>
                {m.score_a !== null && (
                  <p className="text-xs text-green-400 mt-1">✓ Score enregistré : {m.score_a} - {m.score_b}</p>
                )}
              </button>
            ))}
          </div>
          <button onClick={() => setStep('rotation')} className="mt-4 text-slate-400 hover:text-white text-sm">
            ← Changer de rotation
          </button>
        </div>
      )}

      {/* Étape 3 : PIN */}
      {step === 'pin' && selectedMatch && (
        <div>
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 font-bold text-lg mb-1">{selectedMatch.terrain}</p>
            <p className="text-sm">{selectedMatch.equipe_a}</p>
            <p className="text-xs text-slate-400 my-0.5">vs</p>
            <p className="text-sm">{selectedMatch.equipe_b}</p>
          </div>

          <p className="text-slate-300 mb-3">Entre le code du terrain :</p>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError('') }}
            placeholder="Code à 4 chiffres"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-2xl text-center tracking-widest focus:outline-none focus:border-yellow-400 mb-3"
            maxLength={6}
          />
          {pinError && <p className="text-red-400 text-sm mb-3">{pinError}</p>}
          <button
            onClick={verifyPin}
            disabled={pin.length < 4}
            className="w-full bg-yellow-400 disabled:opacity-50 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-xl text-lg transition-colors"
          >
            Valider
          </button>
          <button onClick={() => { setStep('terrain'); setPin(''); setPinError('') }} className="mt-3 w-full text-slate-400 hover:text-white text-sm py-2">
            ← Retour
          </button>
        </div>
      )}

      {/* Étape 4 : Score */}
      {step === 'score' && selectedMatch && (
        <div>
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 font-bold text-lg mb-1">{selectedMatch.terrain}</p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">{selectedMatch.equipe_a}</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={scoreA}
                onChange={e => setScoreA(e.target.value)}
                placeholder="Score"
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-3xl text-center focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div className="text-center text-slate-500 text-sm font-bold">VS</div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">{selectedMatch.equipe_b}</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={scoreB}
                onChange={e => setScoreB(e.target.value)}
                placeholder="Score"
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-3xl text-center focus:outline-none focus:border-yellow-400"
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
          <button onClick={() => { setStep('terrain'); setScoreA(''); setScoreB(''); setError('') }} className="mt-3 w-full text-slate-400 hover:text-white text-sm py-2">
            ← Retour
          </button>
        </div>
      )}

      {/* Étape 5 : Confirmation */}
      {step === 'done' && selectedMatch && (
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Score enregistré !</h2>
          <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
            <p className="text-yellow-400 font-bold mb-2">{selectedMatch.terrain}</p>
            <p className="text-sm">{selectedMatch.equipe_a} <span className="text-yellow-400 font-bold">{scoreA}</span></p>
            <p className="text-sm">{selectedMatch.equipe_b} <span className="text-yellow-400 font-bold">{scoreB}</span></p>
          </div>

          {nextMatch && (
            <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <p className="text-slate-400 text-sm mb-1">Prochain match sur {nextMatch.terrain} :</p>
              <p className="font-semibold">{nextMatch.equipe_a}</p>
              <p className="text-slate-400 text-xs">vs</p>
              <p className="font-semibold">{nextMatch.equipe_b}</p>
              <p className="text-xs text-slate-500 mt-1">{nextMatch.horaire}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setStep('rotation')
                setSelectedMatch(null)
                setPin('')
                setScoreA('')
                setScoreB('')
                setNextMatch(null)
                setError('')
              }}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-xl text-lg transition-colors"
            >
              Entrer un autre score
            </button>
            <Link href="/classement" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl text-lg transition-colors text-center">
              Voir le classement
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
