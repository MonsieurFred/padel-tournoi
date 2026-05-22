import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { adminUpdateScore } from '@/lib/actions'

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { matchId, scoreA, scoreB, pointsA, pointsB } = await request.json()
  await adminUpdateScore(matchId, scoreA, scoreB, pointsA, pointsB)
  return Response.json({ ok: true })
}
