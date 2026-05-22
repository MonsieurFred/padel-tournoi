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

type CurrentMatch = {
  terrain: string
  equipe_a: string
  equipe_b: string
  score_a: number | null
  score_b: number | null
  groupe: string
}

const GROUPE_EMOJI: Record<string, string> = {
  'Compétiteurs': '🏆',
  'Intermédiaires': '😜',
  'Débutants': '🥉',
}

function StandingsTable({ titre, emoji, data }: { titre: string; emoji: string; data: Standing[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
        <span>{emoji}</span> {titre}
      </h2>
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 text-xs text-slate-400 px-4 py-2 border-b border-slate-700">
          <span>Équipe</span>
          <span className="text-center w-8">J</span>
          <span className="text-center w-8">Pts</span>
          <span className="text-center w-8">+</span>
          <span className="text-center w-8">−</span>
        </div>
        {data.length === 0 && (
          <div className="px-4 py-4 text-slate-500 text-sm">Aucun score enregistré</div>
        )}
        {data.map((s, i) => (
          <div
            key={s.equipe}
            className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 px-4 py-3 items-center
              ${i === 0 ? 'text-yellow-400' : ''}
              ${i < data.length - 1 ? 'border-b border-slate-700/50' : ''}
            `}
          >
            <span className="text-sm font-medium truncate">
              {i === 0 && '🥇 '}
              {i === 1 && '🥈 '}
              {i === 2 && '🥉 '}
              {i > 2 && `${i + 1}. `}
              {s.equipe}
            </span>
            <span className="text-center w-8 text-slate-400">{s.joue}</span>
            <span className="text-center w-8 font-bold">{s.points}</span>
            <span className="text-center w-8 text-green-400">{s.jeuxPlus}</span>
            <span className="text-center w-8 text-red-400">{s.jeuxMoins}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

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

export default function ClassementPage() {
  const [standings, setStandings] = useState<Standings | null>(null)
  const [currentMatches, setCurrentMatches] = useState<CurrentMatch[]>([])
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [rotation, setRotation] = useState(getCurrentRotation())

  async function refresh() {
    const rot = getCurrentRotation()
    setRotation(rot)
    const [sRes, mRes] = await Promise.all([
      fetch('/api/classement'),
      fetch(`/api/classement?rotation=${rot}`),
    ])
    const sData = await sRes.json()
    const mData = await mRes.json()
    setStandings(sData.standings)
    setCurrentMatches(mData.matches || [])
    setLastUpdate(new Date().toLocaleTimeString('fr-BE'))
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 20000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Classement</h1>
        </div>
        <button onClick={refresh} className="text-slate-400 hover:text-white text-sm">↻ Actualiser</button>
      </div>
      {lastUpdate && <p className="text-xs text-slate-500 mb-6 ml-9">Mis à jour à {lastUpdate} · auto toutes 20s</p>}

      {/* Matchs en cours */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Rotation {rotation} en cours
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {currentMatches.map(m => (
            <div key={m.terrain} className="bg-slate-800 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-yellow-400 font-bold text-sm">{m.terrain}</span>
                <span className="text-slate-500 text-xs ml-2">{GROUPE_EMOJI[m.groupe]}</span>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                  {m.equipe_a} vs {m.equipe_b}
                </p>
              </div>
              <div className="text-right">
                {m.score_a !== null
                  ? <span className="text-green-400 font-bold">{m.score_a} - {m.score_b}</span>
                  : <span className="text-slate-500 text-xs">En cours…</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classements */}
      {standings ? (
        <>
          <StandingsTable titre="Compétiteurs" emoji="🏆" data={standings.competiteurs} />
          <StandingsTable titre="Intermédiaires" emoji="😜" data={standings.intermediaires} />
          <StandingsTable titre="Débutants" emoji="🥉" data={standings.debutants} />
        </>
      ) : (
        <div className="text-slate-500 text-center py-8">Chargement…</div>
      )}

      <div className="mt-4 text-center">
        <Link href="/score" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors">
          ✏️ Entrer un score
        </Link>
      </div>
    </div>
  )
}
