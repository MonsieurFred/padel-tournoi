'use server'

import { sql } from './db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ── Score entry ────────────────────────────────────────────────────────────

export async function verifyTerrainCode(terrain: string, code: string): Promise<boolean> {
  const rows = await sql`
    SELECT code FROM terrain_codes WHERE terrain = ${terrain}
  `
  return rows.length > 0 && rows[0].code === code
}

export async function submitScore(matchId: number, scoreA: number, scoreB: number) {
  await sql`
    UPDATE matches
    SET score_a = ${scoreA}, score_b = ${scoreB}, updated_at = NOW()
    WHERE id = ${matchId}
  `
}

// ── Admin auth ─────────────────────────────────────────────────────────────

export async function adminLogin(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: 'Mot de passe incorrect' }
  }
  const cookieStore = await cookies()
  cookieStore.set('admin_token', process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8h
    path: '/',
  })
  return { success: true }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/')
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  return token?.value === process.env.ADMIN_PASSWORD
}

// ── Admin actions ──────────────────────────────────────────────────────────

export async function adminUpdateScore(matchId: number, scoreA: number | null, scoreB: number | null) {
  await sql`
    UPDATE matches
    SET score_a = ${scoreA}, score_b = ${scoreB}, updated_at = NOW()
    WHERE id = ${matchId}
  `
}

export async function adminUpdateTeamName(oldName: string, newName: string) {
  await sql`UPDATE matches SET equipe_a = ${newName} WHERE equipe_a = ${oldName}`
  await sql`UPDATE matches SET equipe_b = ${newName} WHERE equipe_b = ${oldName}`
  await sql`UPDATE matches SET repos = REPLACE(repos, ${oldName}, ${newName}) WHERE repos LIKE ${'%' + oldName + '%'}`
  await sql`INSERT INTO settings (key, value) VALUES ('joueur_volant', ${newName}) ON CONFLICT (key) DO UPDATE SET value = ${newName}`
}

export async function adminUpdateTerrainCode(terrain: string, newCode: string) {
  await sql`
    INSERT INTO terrain_codes (terrain, code) VALUES (${terrain}, ${newCode})
    ON CONFLICT (terrain) DO UPDATE SET code = ${newCode}
  `
}

// ── Data queries ───────────────────────────────────────────────────────────

export async function getMatchesByRotation(rotation: number) {
  return sql`
    SELECT * FROM matches WHERE rotation = ${rotation} ORDER BY groupe, terrain
  `
}

export async function getMatchById(id: number) {
  const rows = await sql`SELECT * FROM matches WHERE id = ${id}`
  return rows[0] || null
}

export async function getNextMatch(terrain: string, rotation: number) {
  const rows = await sql`
    SELECT * FROM matches WHERE terrain = ${terrain} AND rotation = ${rotation}
  `
  return rows[0] || null
}

export async function getAllMatches() {
  return sql`SELECT * FROM matches ORDER BY rotation, groupe, terrain`
}

export async function getStandings() {
  const matches = await sql`
    SELECT equipe_a, equipe_b, score_a, score_b, groupe
    FROM matches
    WHERE score_a IS NOT NULL AND score_b IS NOT NULL
  `

  type Standing = {
    equipe: string
    groupe: string
    joue: number
    victoires: number
    nuls: number
    defaites: number
    points: number
    jeuxPlus: number
    jeuxMoins: number
  }

  const map = new Map<string, Standing>()

  // Équipes classées par groupe (pour éviter que Marianne/Patrice compte double)
  const groupeMap: Record<string, string> = {
    'Poulain / Sandrina Graceffa': 'Compétiteurs',
    'Collin Mathieu / Didier Baele': 'Compétiteurs',
    'Jeanfi Pahaut / Sébastien Witmeur': 'Compétiteurs',
    'Dorsan du Bois / Daout Delphine': 'Compétiteurs',
    'Fernando / Vincent Cardyn': 'Compétiteurs',
    'Benja Dessy / Christophe Goisse': 'Compétiteurs',
    'Thierry Verdoodt / Wendy': 'Intermédiaires',
    'Xavier Carton / Magali Veronnez-Florent': 'Intermédiaires',
    'Thierry Van Eeckhout / Sophie van der Dussen': 'Intermédiaires',
    'Didier Devreese / Anne de Patoul': 'Intermédiaires',
    'Geoffroy Lemaigre / Nathalie Pirotte': 'Intermédiaires',
    'Hervé de Broux / Valeriane Delahaye': 'Intermédiaires',
    'Thomas Le Berre / Floriane Vreuls': 'Débutants',
    'Oliver Aretz / Caroline Nieuwenhuys': 'Débutants',
    'Dick Joelle / Quentin Orban': 'Débutants',
    'Kathleen Bouvy / Gégé Vierin': 'Débutants',
    'Olfa / Gaëlle Van Caster': 'Débutants',
    'Catherine Henry de Frahan / Xavier De Buijl': 'Débutants',
    'Marianne / Patrice de Walque': 'Débutants',
  }

  const ensure = (equipe: string, groupe: string) => {
    // Normalise le nom du joueur volant
    const key = equipe.startsWith('Joueur volant') ? equipe : equipe
    const resolvedGroupe = groupeMap[equipe] || groupe
    if (!map.has(key)) {
      map.set(key, { equipe: key, groupe: resolvedGroupe, joue: 0, victoires: 0, nuls: 0, defaites: 0, points: 0, jeuxPlus: 0, jeuxMoins: 0 })
    }
    return map.get(key)!
  }

  for (const m of matches) {
    const sA = Number(m.score_a)
    const sB = Number(m.score_b)
    const groupe = m.groupe as string

    const a = ensure(m.equipe_a as string, groupe)
    const b = ensure(m.equipe_b as string, groupe)

    a.joue++; b.joue++
    a.jeuxPlus += sA; a.jeuxMoins += sB
    b.jeuxPlus += sB; b.jeuxMoins += sA

    if (sA > sB) {
      a.victoires++; a.points++
      b.defaites++
    } else if (sB > sA) {
      b.victoires++; b.points++
      a.defaites++
    } else {
      a.nuls++; a.points += 0.5
      b.nuls++; b.points += 0.5
    }
  }

  const all = Array.from(map.values())
  const sort = (arr: Standing[]) =>
    arr.sort((x, y) => {
      if (y.points !== x.points) return y.points - x.points
      const diffX = x.jeuxPlus - x.jeuxMoins
      const diffY = y.jeuxPlus - y.jeuxMoins
      if (diffY !== diffX) return diffY - diffX
      return y.jeuxPlus - x.jeuxPlus
    })

  return {
    competiteurs: sort(all.filter(e => e.groupe === 'Compétiteurs')),
    intermediaires: sort(all.filter(e => e.groupe === 'Intermédiaires')),
    debutants: sort(all.filter(e => e.groupe === 'Débutants')),
  }
}

export async function getJoueurVolant(): Promise<string> {
  const rows = await sql`SELECT value FROM settings WHERE key = 'joueur_volant'`
  return rows[0]?.value || 'Joueur volant'
}

export async function getTerrainCodes() {
  return sql`SELECT terrain, code FROM terrain_codes ORDER BY terrain`
}
