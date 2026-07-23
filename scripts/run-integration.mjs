import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return
  const text = readFileSync(filePath, 'utf8')
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
    if (process.env[key] === undefined) process.env[key] = value
  }
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'integration-test-jwt-secret-32chars!!'
}
if (!process.env.SALT_ROUNDS) process.env.SALT_ROUNDS = '4'
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

console.log('env ready: DATABASE_URL=%s JWT_SECRET=%s', !!process.env.DATABASE_URL, !!process.env.JWT_SECRET)

const cmds = [
  ['npm', 'run', 'build', '-w', '@gienharness/domain'],
  ['npm', 'run', 'build', '-w', '@gienharness/infrastructure'],
  ['npm', 'run', 'db:migrate'],
  ['npm', 'run', 'db:seed'],
  ['npm', 'run', 'test:integration', '-w', '@gienharness/api'],
]

for (const cmd of cmds) {
  console.log('>>', cmd.join(' '))
  const r = spawnSync(cmd[0], cmd.slice(1), {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    shell: true,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
console.log('ALL OK')
