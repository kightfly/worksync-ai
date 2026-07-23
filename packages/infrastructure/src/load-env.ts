import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Load repo-root `.env.local` / `.env` when running migrate/seed from packages/infrastructure. */
export function loadRepoEnv() {
  const here = dirname(fileURLToPath(import.meta.url))
  const roots = [resolve(here, '../../..'), resolve(here, '../../../..'), process.cwd()]
  for (const root of roots) {
    for (const name of ['.env.local', '.env']) {
      const path = resolve(root, name)
      if (!existsSync(path)) continue
      for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eq = trimmed.indexOf('=')
        if (eq <= 0) continue
        const key = trimmed.slice(0, eq).trim()
        let value = trimmed.slice(eq + 1).trim()
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1)
        }
        if (process.env[key] === undefined) process.env[key] = value
      }
    }
  }
}
