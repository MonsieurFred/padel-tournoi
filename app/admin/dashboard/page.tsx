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
  points_a: number | null
  points_b: number | null
}

type TerrainCode = { terrain: string; code: string }

const GROUPES = ['Compétiteurs', 'Intermédiaires', 'Débutants'] as const
type Groupe = typeof GROUPES[number]

const GROUPE_COLOR: Record<Groupe, string> = {
  'Compétiteurs': '#f59e0b',
  'Intermédiaires': '#10b981',
  'Débutants': '#6366f1',
}

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
const inputCls = 'w-full rounded-lg px-3 py-2 text-center text-lg focus:outline-none bg-transparent border border-white/10 focus:border-white/30 text-white'

export default function AdminDashboard() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [editingTeam, setEditingTeam] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [editingMatchPlan, setEditingMatchPlan] = useState<Match | null>(null)
  const [planRotation, setPlanRotation] = useState('')
  const [planHoraire, setPlanHoraire] = useState('')
  const [planTerrain, setPlanTerrain] = useState('')
  const [planEquipeA, setPlanEquipeA] = useState('')
  const [planEquipeB, setPlanEquipeB] = useState('')
  const [planFilterRound, setPlanFilterRound] = useState<number | null>(null)
  const [editScoreA, setEditScoreA] = useState('')
  const [editScoreB, setEditScoreB] = useState('')
  const [editPtsA, setEditPtsA] = useState('')
  const [editPtsB, setEditPtsB] = useState('')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'scores' | 'settings'>('scores')
  const [filterGroupe, setFilterGroupe] = useState<Groupe | null>(null)
  const [filterRound, setFilterRound] = useState<number | null>(null)

  async function load() {
    const res = await fetch('/api/admin/data')
    if (res.status === 401) { router.push('/admin'); return }
    const data = await res.json()
    setMatches(data.matches || [])
  }

  useEffect(() => { load() }, [])

  async function saveScore() {
    if (!editingMatch) return
    setSaving(true)
    const sA = editScoreA === '' ? null : parseInt(editScoreA)
    const sB = editScoreB === '' ? null : parseInt(editScoreB)
    const pA = editPtsA === '' ? null : parseInt(editPtsA)
    const pB = editPtsB === '' ? null : parseInt(editPtsB)
    await fetch('/api/admin/score', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: editingMatch.id, scoreA: sA, scoreB: sB, pointsA: pA, pointsB: pB }),
    })
    await load()
    setEditingMatch(null)
    setSaving(false)
  }

  async function saveMatchPlan() {
    if (!editingMatchPlan) return
    setSaving(true)
    await fetch('/api/admin/match', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: editingMatchPlan.id,
        rotation: parseInt(planRotation),
        horaire: planHoraire,
        terrain: planTerrain,
        equipeA: planEquipeA,
        equipeB: planEquipeB,
      }),
    })
    await load()
    setEditingMatchPlan(null)
    setSaving(false)
  }

  async function saveTeamName() {
    if (!editingTeam || !newTeamName || newTeamName === editingTeam) return
    setSaving(true)
    await fetch('/api/admin/joueur-volant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName: editingTeam, newName: newTeamName }),
    })
    await load()
    setEditingTeam(null)
    setNewTeamName('')
    setSaving(false)
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/')
  }

  const rounds = [...new Set(matches.map(m => m.rotation))].sort()
  const filtered = matches.filter(m => {
    if (filterGroupe && m.groupe !== filterGroupe) return false
    if (filterRound && m.rotation !== filterRound) return false
    return true
  })
  const scored = filtered.filter(m => m.score_a !== null).length

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto" style={{ background: '#0a0f1e' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}>←</Link>
          <h1 className="text-xl font-bold">Admin</h1>
        </div>
        <button onClick={logout} className="text-sm text-slate-500 hover:text-white transition-colors">Déconnexion</button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {(['scores', 'settings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="py-3 rounded-xl text-sm font-bold transition-all"
            style={tab === t
              ? { background: '#10b981', color: '#fff' }
              : { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
            {t === 'scores' ? '📊 Scores' : '⚙️ Paramètres'}
          </button>
        ))}
      </div>

      {/* ── SCORES ── */}
      {tab === 'scores' && (
        <div>
          {/* Filtres groupe */}
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Niveau</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {GROUPES.map(g => (
              <button key={g} onClick={() => { setFilterGroupe(filterGroupe === g ? null : g); setFilterRound(null) }}
                className="py-2.5 rounded-xl text-xs font-bold transition-all"
                style={filterGroupe === g
                  ? { background: GROUPE_COLOR[g], color: '#fff' }
                  : { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                {g}
              </button>
            ))}
          </div>

          {/* Filtres round */}
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Round</p>
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setFilterRound(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={!filterRound
                ? { background: 'rgba(255,255,255,0.15)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
              Tous
            </button>
            {rounds.map(r => (
              <button key={r} onClick={() => setFilterRound(filterRound === r ? null : r)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={filterRound === r
                  ? { background: 'rgba(255,255,255,0.15)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                Round {r}
              </button>
            ))}
          </div>

          {/* Compteur */}
          <p className="text-xs text-slate-600 mb-3">{scored}/{filtered.length} matchs encodés</p>

          {/* Liste */}
          <div className="flex flex-col gap-2">
            {filtered.map(m => {
              const color = GROUPE_COLOR[m.groupe as Groupe] ?? '#94a3b8'
              const isEditing = editingMatch?.id === m.id
              return (
                <div key={m.id} className="rounded-xl p-4" style={card}>
                  {isEditing ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>{m.groupe}</span>
                        <span className="text-xs text-slate-500">{m.terrain} · Round {m.rotation}</span>
                      </div>
                      <p className="text-sm font-medium mb-4">{m.equipe_a} <span className="text-slate-500">vs</span> {m.equipe_b}</p>

                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <p className="text-xs text-slate-500 mb-1 text-center">{m.equipe_a.split('/')[0].trim()}</p>
                          <input type="number" min={0} value={editScoreA} onChange={e => setEditScoreA(e.target.value)}
                            placeholder="Jeux" className={inputCls} />
                          <p className="text-xs text-slate-600 text-center mt-1">jeux</p>
                          <input type="number" min={0} value={editPtsA} onChange={e => setEditPtsA(e.target.value)}
                            placeholder="0/15/30/40" className={`${inputCls} mt-1`} />
                          <p className="text-xs text-slate-600 text-center mt-1">points</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1 text-center">{m.equipe_b.split('/')[0].trim()}</p>
                          <input type="number" min={0} value={editScoreB} onChange={e => setEditScoreB(e.target.value)}
                            placeholder="Jeux" className={inputCls} />
                          <p className="text-xs text-slate-600 text-center mt-1">jeux</p>
                          <input type="number" min={0} value={editPtsB} onChange={e => setEditPtsB(e.target.value)}
                            placeholder="0/15/30/40" className={`${inputCls} mt-1`} />
                          <p className="text-xs text-slate-600 text-center mt-1">points</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button onClick={saveScore} disabled={saving}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                          style={{ background: '#10b981', color: '#fff' }}>
                          {saving ? '…' : 'Sauvegarder'}
                        </button>
                        <button onClick={() => setEditingMatch(null)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${color}22`, color }}>{m.groupe}</span>
                          <span className="text-xs text-slate-500 flex-shrink-0">R{m.rotation} · {m.terrain}</span>
                        </div>
                        <p className="text-sm text-slate-300 truncate">{m.equipe_a} <span className="text-slate-600">vs</span> {m.equipe_b}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {m.score_a !== null ? (
                          <div className="text-right">
                            <p className="text-sm font-black" style={{ color: '#10b981' }}>{m.score_a} – {m.score_b}</p>
                            <p className="text-xs text-slate-500">{m.points_a} – {m.points_b} pts</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                        <button onClick={() => {
                          setEditingMatch(m)
                          setEditScoreA(m.score_a?.toString() ?? '')
                          setEditScoreB(m.score_b?.toString() ?? '')
                          setEditPtsA(m.points_a?.toString() ?? '')
                          setEditPtsB(m.points_b?.toString() ?? '')
                        }} className="text-slate-500 hover:text-white transition-colors text-base">✏️</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-center text-slate-600 py-8 text-sm">Aucun match pour ces filtres</p>
            )}
          </div>
        </div>
      )}

      {/* ── PARAMÈTRES ── */}
      {tab === 'settings' && (() => {
        const teams = [...new Set(matches.flatMap(m => [m.equipe_a, m.equipe_b]))].sort()
        return (
          <div className="flex flex-col gap-4">
            {/* Renommer une équipe */}
            <div className="rounded-xl p-5" style={card}>
              <h3 className="font-bold mb-1">✏️ Renommer une équipe</h3>
              <p className="text-slate-500 text-sm mb-4">Utile si une équipe change de composition ou en cas d'erreur.</p>

              {editingTeam ? (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Ancien nom</p>
                  <p className="text-sm font-semibold mb-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>{editingTeam}</p>
                  <p className="text-xs text-slate-500 mb-1">Nouveau nom</p>
                  <input type="text" value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
                    placeholder="Nouveau nom…" autoFocus
                    className="w-full rounded-xl px-4 py-3 mb-3 focus:outline-none text-white"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }} />
                  <div className="flex gap-2">
                    <button onClick={saveTeamName} disabled={saving || !newTeamName || newTeamName === editingTeam}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                      style={{ background: '#10b981', color: '#fff' }}>
                      {saving ? '…' : 'Sauvegarder'}
                    </button>
                    <button onClick={() => { setEditingTeam(null); setNewTeamName('') }}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                  {teams.map(team => (
                    <button key={team} onClick={() => { setEditingTeam(team); setNewTeamName(team) }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-sm truncate pr-2">{team}</span>
                      <span className="text-slate-500 text-xs flex-shrink-0">✏️</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modifier le planning */}
            <div className="rounded-xl p-5" style={card}>
              <h3 className="font-bold mb-1">📅 Modifier le planning</h3>
              <p className="text-slate-500 text-sm mb-4">Changer les équipes, l'horaire ou le terrain d'un match.</p>

              {editingMatchPlan ? (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Round</p>
                      <input type="number" min={1} value={planRotation} onChange={e => setPlanRotation(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none text-white"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Horaire</p>
                      <input type="text" value={planHoraire} onChange={e => setPlanHoraire(e.target.value)}
                        placeholder="18:30"
                        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none text-white"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Terrain</p>
                    <input type="text" value={planTerrain} onChange={e => setPlanTerrain(e.target.value)}
                      placeholder="T1"
                      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none text-white"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }} />
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Équipe A</p>
                    <input type="text" value={planEquipeA} onChange={e => setPlanEquipeA(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none text-white"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }} />
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">Équipe B</p>
                    <input type="text" value={planEquipeB} onChange={e => setPlanEquipeB(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none text-white"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveMatchPlan} disabled={saving}
                      className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-40"
                      style={{ background: '#10b981', color: '#fff' }}>
                      {saving ? '…' : 'Sauvegarder'}
                    </button>
                    <button onClick={() => setEditingMatchPlan(null)}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Filtre round */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <button onClick={() => setPlanFilterRound(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={!planFilterRound
                        ? { background: 'rgba(255,255,255,0.15)', color: '#fff' }
                        : { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Tous
                    </button>
                    {rounds.map(r => (
                      <button key={r} onClick={() => setPlanFilterRound(planFilterRound === r ? null : r)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={planFilterRound === r
                          ? { background: 'rgba(255,255,255,0.15)', color: '#fff' }
                          : { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                        Round {r}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                    {matches
                      .filter(m => !planFilterRound || m.rotation === planFilterRound)
                      .map(m => {
                        const color = GROUPE_COLOR[m.groupe as Groupe] ?? '#94a3b8'
                        return (
                          <button key={m.id}
                            onClick={() => {
                              setEditingMatchPlan(m)
                              setPlanRotation(m.rotation.toString())
                              setPlanHoraire(m.horaire)
                              setPlanTerrain(m.terrain)
                              setPlanEquipeA(m.equipe_a)
                              setPlanEquipeB(m.equipe_b)
                            }}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                                  style={{ background: `${color}22`, color, fontSize: '10px' }}>{m.groupe.slice(0,3)}</span>
                                <span className="text-xs text-slate-500">R{m.rotation} · {m.terrain} · {m.horaire}</span>
                              </div>
                              <p className="text-xs text-slate-300 truncate">{m.equipe_a} vs {m.equipe_b}</p>
                            </div>
                            <span className="text-slate-500 text-xs flex-shrink-0 ml-2">✏️</span>
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Reset scores */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-bold mb-1 text-red-400">🗑️ Réinitialiser tous les scores</h3>
              <p className="text-slate-500 text-sm mb-4">Remet tous les scores à zéro. Irréversible.</p>
              <button
                onClick={async () => {
                  if (!confirm('Remettre TOUS les scores à zéro ?')) return
                  setSaving(true)
                  await fetch('/api/admin/reset', { method: 'POST' })
                  await load()
                  setSaving(false)
                }}
                disabled={saving}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                style={{ background: '#dc2626', color: '#fff' }}>
                {saving ? '…' : 'Tout réinitialiser'}
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
