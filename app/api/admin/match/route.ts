import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/actions'

export async function PUT(request: NextRequest) {
  if (!await isAdminAuthenticated()) return Response.json({ ok: false }, { status: 401 })
  const { matchId, rotation, horaire, terrain, equipeA, equipeB } = await request.json()
  await sql`
    UPDATE matches
    SET rotation = ${rotation}, horaire = ${horaire}, terrain = ${terrain},
        equipe_a = ${equipeA}, equipe_b = ${equipeB}, updated_at = NOW()
    WHERE id = ${matchId}
  `
  return Response.json({ ok: true })
}
