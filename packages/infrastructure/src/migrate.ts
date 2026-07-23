import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import { requireDatabaseUrl } from './db.js'

async function main() {
  const url = requireDatabaseUrl()
  const sql = postgres(url, { max: 1, prepare: false })
  const dir = dirname(fileURLToPath(import.meta.url))
  const migrationPath = join(dir, '../drizzle/0000_init.sql')
  const ddl = readFileSync(migrationPath, 'utf8')
  await sql.unsafe('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
  await sql.unsafe(ddl)
  await sql.end()
  console.log('migrate ok')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
