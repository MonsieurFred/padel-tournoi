'use server'

import { sql } from './db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ── Score entry ────────────────────────────────────────────────────────────

export async function submitScore(matchId: number, scoreA: number, scoreB: number, pointsA: number, pointsB: number) {
  await sql`
    UPDATE matches
    SET score_a = ${scoreA}, score_b = ${scoreB}, points_a = ${pointsA}, points_b = ${pointsB}, updated_at = NOW()
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

export async function adminUpdateScore(matchId: number, scoreA: number | null, scoreB: number | null, pointsA: number | null, pointsB: number | null) {
  await sql`
    UPDATE matches
    SET score_a = ${scoreA}, score_b = ${scoreB}, points_a = ${pointsA}, points_b = ${pointsB}, updated_at = NOW()
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

export async function getAllMatches() {
  return sql`SELECT * FROM matches ORDER BY rotation, groupe, terrain`
}

export async function getStandings() {
  const matches = await sql`
    SELECT equipe_a, equipe_b, score_a, score_b, points_a, points_b, groupe
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
    const resolvedGroupe = groupeMap[equipe] || groupe
    if (!map.has(equipe)) {
      map.set(equipe, { equipe, groupe: resolvedGroupe, joue: 0, victoires: 0, nuls: 0, defaites: 0, points: 0, jeuxPlus: 0, jeuxMoins: 0 })
    }
    return map.get(equipe)!
  }

  for (const m of matches) {
    const jA = Number(m.score_a)
    const jB = Number(m.score_b)
    const pA = m.points_a !== null ? Number(m.points_a) : 0
    const pB = m.points_b !== null ? Number(m.points_b) : 0
    const groupe = m.groupe as string

    const a = ensure(m.equipe_a as string, groupe)
    const b = ensure(m.equipe_b as string, groupe)

    a.joue++; b.joue++
    a.jeuxPlus += jA; a.jeuxMoins += jB
    b.jeuxPlus += jB; b.jeuxMoins += jA

    // Jeux décident ; si égalité jeux → points départagent ; sinon nul
    let aWins = false, bWins = false
    if (jA > jB) aWins = true
    else if (jB > jA) bWins = true
    else if (pA > pB) aWins = true
    else if (pB > pA) bWins = true

    if (aWins) {
      a.victoires++; a.points++; b.defaites++
    } else if (bWins) {
      b.victoires++; b.points++; a.defaites++
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
