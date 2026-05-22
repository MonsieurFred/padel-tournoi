import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { adminUpdateTeamName } from '@/lib/actions'

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { oldName, newName } = await request.json()
  // Met à jour toutes les équipes qui commencent par "Joueur volant"
  await adminUpdateTeamName(oldName, newName)
  return Response.json({ ok: true })
}
