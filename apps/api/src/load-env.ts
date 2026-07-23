import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/** Load KEY=VALUE from repo `.env.local` / `.env` (does not override existing env). */
export function loadEnv(cwd = process.cwd()) {
  const roots = [
    resolve(cwd, '../..'), // apps/api -> repo root
    resolve(cwd, '../../..'),
    cwd,
  ]
  const files = ['.env.local', '.env']
  for (const root of roots) {
    for (const name of files) {
      const path = resolve(root, name)
      if (!existsSync(path)) continue
      const text = readFileSync(path, 'utf8')
      for (const line of text.split(/\r?\n/)) {
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
        if (process.env[key] === undefined) {
          process.env[key] = value
        }
      }
    }
  }
}
