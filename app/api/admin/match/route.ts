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

export async function POST(request: NextRequest) {
  if (!await isAdminAuthenticated()) return Response.json({ ok: false }, { status: 401 })
  const { matchIdA, matchIdB } = await request.json()
  const rows = await sql`SELECT id, rotation, horaire, terrain FROM matches WHERE id IN (${matchIdA}, ${matchIdB})`
  if (rows.length !== 2) return Response.json({ ok: false }, { status: 400 })
  const a = rows.find((r: any) => r.id === matchIdA)!
  const b = rows.find((r: any) => r.id === matchIdB)!
  await sql`UPDATE matches SET rotation = ${b.rotation}, horaire = ${b.horaire}, terrain = ${b.terrain}, updated_at = NOW() WHERE id = ${matchIdA}`
  await sql`UPDATE matches SET rotation = ${a.rotation}, horaire = ${a.horaire}, terrain = ${a.terrain}, updated_at = NOW() WHERE id = ${matchIdB}`
  return Response.json({ ok: true })
}
