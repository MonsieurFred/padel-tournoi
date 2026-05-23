'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion, réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#0a0f1e' }}>
      <div className="w-full max-w-xs">
        <div className="flex items-center gap-3 mb-10">
          <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}>←</Link>
          <h1 className="text-xl font-bold">Accès admin</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
            className="w-full rounded-xl px-4 py-4 text-base focus:outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-40"
            style={{ background: '#10b981', color: '#fff' }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
