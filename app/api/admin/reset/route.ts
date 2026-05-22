import { cookies } from 'next/headers'
import { sql } from '@/lib/db'

export async function POST() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await sql`UPDATE matches SET score_a = NULL, score_b = NULL, updated_at = NOW()`
  return Response.json({ ok: true })
}
