import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'

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
  process.env.JWT_SECRET = 'e2e-jwt-secret-change-me-32chars!!'
}
if (!process.env.SALT_ROUNDS) process.env.SALT_ROUNDS = '4'
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required for E2E')
  process.exit(1)
}

if (!process.env.API_PORT && process.env.PORT) {
  process.env.API_PORT = process.env.PORT
}
if (!process.env.API_PORT) process.env.API_PORT = '3000'
// Same-origin via Vite proxy (avoids browser CORS flakiness in E2E)
process.env.VITE_API_BASE_URL = ''
process.env.VITE_API_PROXY_TARGET =
  process.env.VITE_API_PROXY_TARGET ?? `http://127.0.0.1:${process.env.API_PORT}`
process.env.E2E_BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173'

console.log(
  'e2e env: API_PORT=%s proxy=%s E2E_BASE_URL=%s',
  process.env.API_PORT,
  process.env.VITE_API_PROXY_TARGET,
  process.env.E2E_BASE_URL,
)

function run(cmd, args, opts = {}) {
  console.log('>>', cmd, args.join(' '))
  const r = spawnSync(cmd, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    shell: true,
    ...opts,
  })
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1)
}

async function waitFor(url, timeoutMs = 90_000) {
  const start = Date.now()
  let lastErr = ''
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.status > 0) return
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e)
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`timeout waiting for ${url} (${lastErr})`)
}

run('npm', ['run', 'build', '-w', '@gienharness/domain'])
run('npm', ['run', 'build', '-w', '@gienharness/infrastructure'])
run('npm', ['run', 'db:migrate'])
run('npm', ['run', 'db:seed'])

const children = []

function start(cmd, args, name) {
  console.log('start', name, '->', cmd, args.join(' '))
  const child = spawn(cmd, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    shell: true,
  })
  child.on('exit', (code) => {
    console.log(name, 'exited', code)
  })
  children.push(child)
  return child
}

function shutdown() {
  for (const child of children) {
    try {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
      } else {
        child.kill('SIGTERM')
      }
    } catch {
      // ignore
    }
  }
}

process.on('exit', shutdown)
process.on('SIGINT', () => {
  shutdown()
  process.exit(130)
})

try {
  start('npm', ['run', 'dev', '-w', '@gienharness/api'], 'api')
  start('npm', ['run', 'dev', '-w', '@gienharness/web'], 'web')

  const apiHealth = `http://127.0.0.1:${process.env.API_PORT}/health`
  await waitFor(apiHealth)
  await waitFor(process.env.E2E_BASE_URL)

  run('npx', ['playwright', 'test', '-c', 'apps/web/playwright.config.ts'], {
    cwd: root,
  })
  console.log('E2E ALL OK')
} catch (err) {
  console.error(err)
  shutdown()
  process.exit(1)
} finally {
  shutdown()
}
