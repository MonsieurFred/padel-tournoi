import { cookies } from 'next/headers'
import { getAllMatches, getTerrainCodes, getJoueurVolant } from '@/lib/actions'

export async function GET() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [matches, codes, joueurVolant] = await Promise.all([
    getAllMatches(),
    getTerrainCodes(),
    getJoueurVolant(),
  ])
  return Response.json({ matches, codes, joueurVolant })
}
