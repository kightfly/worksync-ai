import { loadEnv as loadEnvFiles } from '../load-env.js'

/** Test helper: load repo env + soft defaults for JWT/SALT. */
export function loadEnv(cwd = process.cwd()) {
  loadEnvFiles(cwd)
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'integration-test-jwt-secret-32chars!!'
  }
  if (!process.env.SALT_ROUNDS) {
    process.env.SALT_ROUNDS = '4'
  }
}
