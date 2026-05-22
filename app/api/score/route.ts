import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { verifyTerrainCode, submitScore, getNextMatch } from '@/lib/actions'

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.action === 'verify') {
    const ok = await verifyTerrainCode(body.terrain, body.code)
    return Response.json({ ok })
  }

  if (body.action === 'submit') {
    const { matchId, scoreA, scoreB } = body
    await submitScore(matchId, scoreA, scoreB)

    // Cherche le match courant pour obtenir terrain + rotation
    const rows = await sql`SELECT terrain, rotation FROM matches WHERE id = ${matchId}`
    const match = rows[0]
    let nextMatch = null
    if (match) {
      nextMatch = await getNextMatch(match.terrain, match.rotation + 1)
    }

    return Response.json({ ok: true, nextMatch })
  }

  return Response.json({ ok: false, error: 'Action inconnue' }, { status: 400 })
}
