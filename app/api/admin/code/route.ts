import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { adminUpdateTerrainCode } from '@/lib/actions'

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { terrain, code } = await request.json()
  await adminUpdateTerrainCode(terrain, code)
  return Response.json({ ok: true })
}
