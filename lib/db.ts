import { neon } from '@neondatabase/serverless'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sql(strings: TemplateStringsArray, ...values: any[]): Promise<Record<string, any>[]> {
  const db = neon(process.env.DATABASE_URL!)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db(strings as any, ...values) as Promise<Record<string, any>[]>
}
