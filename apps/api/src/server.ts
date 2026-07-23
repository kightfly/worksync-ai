import { buildAppFromEnv } from './app.js'

async function main() {
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3100)
  const host = process.env.API_HOST ?? '0.0.0.0'
  const app = await buildAppFromEnv()
  await app.listen({ port, host })
  console.log(`api listening on ${host}:${port}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
