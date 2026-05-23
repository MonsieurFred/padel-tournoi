import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { submitScore } from '@/lib/actions'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const terrain = searchParams.get('terrain')
  if (!terrain) return Response.json({ match: null })

  // Premier match sans score pour ce terrain, dans l'ordre des rotations
  const rows = await sql`
    SELECT * FROM matches
    WHERE terrain = ${terrain} AND score_a IS NULL
    ORDER BY rotation ASC
    LIMIT 1
  `
  return Response.json({ match: rows[0] || null }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.action === 'submit') {
    const { matchId, scoreA, scoreB, pointsA, pointsB } = body
    await submitScore(matchId, scoreA, scoreB, pointsA, pointsB)
    return Response.json({ ok: true })
  }

  return Response.json({ ok: false, error: 'Action inconnue' }, { status: 400 })
}
