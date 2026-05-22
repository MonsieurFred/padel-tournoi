'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Standing = {
  equipe: string
  groupe: string
  joue: number
  victoires: number
  nuls: number
  defaites: number
  points: number
  jeuxPlus: number
  jeuxMoins: number
}

type Standings = {
  competiteurs: Standing[]
  intermediaires: Standing[]
  debutants: Standing[]
}


const GROUPES = [
  { key: 'competiteurs', label: 'Compétiteurs', color: '#f59e0b' },
  { key: 'intermediaires', label: 'Intermédiaires', color: '#10b981' },
  { key: 'debutants', label: 'Débutants', color: '#6366f1' },
] as const


function StandingsTable({ data, color }: { data: Standing[]; color: string }) {
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
  const medals = ['🥇', '🥈', '🥉']

  if (data.length === 0) {
    return <div className="text-center py-8 text-slate-600 text-sm">Aucun score enregistré pour l'instant</div>
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={cardStyle}>
      {/* Header */}
      <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
        style={{ gridTemplateColumns: '1fr 28px 28px 28px 36px' }}>
        <span>Équipe</span>
        <span className="text-center">J</span>
        <span className="text-center">V</span>
        <span className="text-center">D</span>
        <span className="text-center">Pts</span>
      </div>

      {data.map((s, i) => (
        <div key={s.equipe}
          className="grid px-4 py-3 items-center"
          style={{
            gridTemplateColumns: '1fr 28px 28px 28px 36px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: i === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
          }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base w-5 flex-shrink-0">{medals[i] ?? `${i + 1}.`}</span>
            <span className="text-sm font-medium truncate" style={{ color: i === 0 ? color : '#e2e8f0' }}>
              {s.equipe}
            </span>
          </div>
          <span className="text-center text-sm text-slate-400">{s.joue}</span>
          <span className="text-center text-sm font-medium" style={{ color: '#10b981' }}>{s.victoires}</span>
          <span className="text-center text-sm font-medium" style={{ color: '#f87171' }}>{s.defaites}</span>
          <span className="text-center text-sm font-black" style={{ color: i === 0 ? color : '#f8fafc' }}>{s.points}</span>
        </div>
      ))}
    </div>
  )
}

export default function ClassementPage() {
  const [standings, setStandings] = useState<Standings | null>(null)
  const [lastUpdate, setLastUpdate] = useState('')
  const [activeTab, setActiveTab] = useState<'competiteurs' | 'intermediaires' | 'debutants'>('competiteurs')

  async function refresh() {
    const res = await fetch('/api/classement')
    const data = await res.json()
    setStandings(data.standings)
    setLastUpdate(new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }))
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 20000)
    return () => clearInterval(interval)
  }, [])

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
  const activeGroup = GROUPES.find(g => g.key === activeTab)!
  const activeData = standings ? standings[activeTab] : []

  return (
    <div className="min-h-screen px-4 pb-12" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1f3d 100%)' }}>
      {/* Header */}
      <div className="pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold leading-tight">Classement</h1>
            {lastUpdate && <p className="text-xs text-slate-500">Màj {lastUpdate} · auto 20s</p>}
          </div>
        </div>
        <button onClick={refresh}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.07)' }}>
          ↻ Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {GROUPES.map(g => (
          <button key={g.key} onClick={() => setActiveTab(g.key)}
            className="py-2.5 rounded-xl text-xs font-bold transition-all text-center leading-tight"
            style={activeTab === g.key
              ? { background: g.color, color: '#fff' }
              : { background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>
            {g.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {standings ? (
        <StandingsTable data={activeData} color={activeGroup.color} />
      ) : (
        <div className="text-center py-12 text-slate-600 text-sm">Chargement…</div>
      )}
    </div>
  )
}
