import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { getStandings } from '@/lib/actions'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rotation = searchParams.get('rotation')

  if (rotation) {
    const matches = await sql`
      SELECT id, rotation, horaire, groupe, terrain, equipe_a, equipe_b, score_a, score_b
      FROM matches
      WHERE rotation = ${parseInt(rotation)}
      ORDER BY groupe, terrain
    `
    return Response.json({ matches })
  }

  const standings = await getStandings()
  return Response.json({ standings })
}
