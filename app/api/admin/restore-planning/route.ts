import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/actions'

export async function POST(request: NextRequest) {
  if (!await isAdminAuthenticated()) return Response.json({ ok: false }, { status: 401 })
  await sql`
    UPDATE matches
    SET rotation = original_rotation,
        horaire = original_horaire,
        terrain = original_terrain,
        updated_at = NOW()
    WHERE original_rotation IS NOT NULL
  `
  return Response.json({ ok: true })
}
