'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

type TerrainCode = { terrain: string; code: string }

const GROUPE_EMOJI: Record<string, string> = {
  'Compétiteurs': '🏆',
  'Intermédiaires': '😜',
  'Débutants': '🥉',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [codes, setCodes] = useState<TerrainCode[]>([])
  const [joueurVolant, setJoueurVolant] = useState('')
  const [newJoueurVolant, setNewJoueurVolant] = useState('')
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [editScoreA, setEditScoreA] = useState('')
  const [editScoreB, setEditScoreB] = useState('')
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [newCode, setNewCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'scores' | 'settings'>('scores')
  const [filterRotation, setFilterRotation] = useState<number | null>(null)

  async function load() {
    const res = await fetch('/api/admin/data')
    if (res.status === 401) { router.push('/admin'); return }
    const data = await res.json()
    setMatches(data.matches || [])
    setCodes(data.codes || [])
    setJoueurVolant(data.joueurVolant || '')
    setNewJoueurVolant(data.joueurVolant || '')
  }

  useEffect(() => { load() }, [])

  async function saveScore() {
    if (!editingMatch) return
    setSaving(true)
    const sA = editScoreA === '' ? null : parseInt(editScoreA)
    const sB = editScoreB === '' ? null : parseInt(editScoreB)
    await fetch('/api/admin/score', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: editingMatch.id, scoreA: sA, scoreB: sB }),
    })
    await load()
    setEditingMatch(null)
    setSaving(false)
  }

  async function saveCode() {
    if (!editingCode) return
    setSaving(true)
    await fetch('/api/admin/code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ terrain: editingCode, code: newCode }),
    })
    await load()
    setEditingCode(null)
    setSaving(false)
  }

  async function saveJoueurVolant() {
    setSaving(true)
    await fetch('/api/admin/joueur-volant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName: joueurVolant.startsWith('Joueur volant') ? joueurVolant : 'Joueur volant', newName: newJoueurVolant }),
    })
    await load()
    setSaving(false)
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/')
  }

  const filtered = filterRotation ? matches.filter(m => m.rotation === filterRotation) : matches
  const rotations = [...new Set(matches.map(m => m.rotation))].sort()

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <button onClick={logout} className="text-slate-400 hover:text-white text-sm">
          Déconnexion
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['scores', 'settings'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {t === 'scores' ? '📊 Scores' : '⚙️ Paramètres'}
          </button>
        ))}
      </div>

      {/* Onglet Scores */}
      {tab === 'scores' && (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilterRotation(null)}
              className={`px-3 py-1 rounded-lg text-sm ${!filterRotation ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700'}`}
            >
              Toutes
            </button>
            {rotations.map(r => (
              <button
                key={r}
                onClick={() => setFilterRotation(r)}
                className={`px-3 py-1 rounded-lg text-sm ${filterRotation === r ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700'}`}
              >
                R{r}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map(m => (
              <div key={m.id} className="bg-slate-800 rounded-xl px-4 py-3">
                {editingMatch?.id === m.id ? (
                  <div>
                    <p className="text-yellow-400 font-bold mb-2">{m.terrain} · R{m.rotation}</p>
                    <p className="text-sm mb-3">{m.equipe_a} vs {m.equipe_b}</p>
                    <div className="flex gap-3 items-center mb-3">
                      <input
                        type="number" min={0} value={editScoreA}
                        onChange={e => setEditScoreA(e.target.value)}
                        placeholder="Score A"
                        className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-center text-xl focus:outline-none"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="number" min={0} value={editScoreB}
                        onChange={e => setEditScoreB(e.target.value)}
                        placeholder="Score B"
                        className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-center text-xl focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveScore} disabled={saving} className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-lg">
                        {saving ? '…' : 'Sauvegarder'}
                      </button>
                      <button onClick={() => setEditingMatch(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 font-bold text-sm">{m.terrain}</span>
                        <span className="text-slate-500 text-xs">R{m.rotation} · {GROUPE_EMOJI[m.groupe]}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate max-w-[220px]">{m.equipe_a} vs {m.equipe_b}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${m.score_a !== null ? 'text-green-400' : 'text-slate-500'}`}>
                        {m.score_a !== null ? `${m.score_a} - ${m.score_b}` : '— - —'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingMatch(m)
                          setEditScoreA(m.score_a?.toString() ?? '')
                          setEditScoreB(m.score_b?.toString() ?? '')
                        }}
                        className="text-slate-400 hover:text-yellow-400 text-lg"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Onglet Paramètres */}
      {tab === 'settings' && (
        <div>
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <h3 className="font-bold mb-3">👤 Nom du joueur volant</h3>
            <p className="text-slate-400 text-sm mb-3">
              Remplace «Joueur volant» par le vrai nom du remplaçant d'Alexandra de Broux.
            </p>
            <input
              type="text" value={newJoueurVolant}
              onChange={e => setNewJoueurVolant(e.target.value)}
              placeholder="Prénom / Nom"
              className="w-full bg-slate-700 rounded-lg px-4 py-3 mb-3 focus:outline-none"
            />
            <button
              onClick={saveJoueurVolant} disabled={saving || newJoueurVolant === joueurVolant}
              className="w-full bg-yellow-400 disabled:opacity-50 hover:bg-yellow-300 text-slate-900 font-bold py-3 rounded-xl transition-colors"
            >
              {saving ? '…' : 'Mettre à jour le nom'}
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="font-bold mb-2">ℹ️ Anomalie détectée</h3>
            <p className="text-slate-400 text-sm">
              <strong className="text-white">Marianne / Patrice de Walque</strong> apparaît simultanément dans des matchs Intermédiaires (terrain CBC) et Débutants sur plusieurs rotations. Ils ne peuvent jouer qu'un seul match par rotation — laisse le score vide pour le match qu'ils ne jouent pas.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
