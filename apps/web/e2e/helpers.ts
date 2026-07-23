import { expect, type Page } from '@playwright/test'

export const DEMO_EMAIL = 'test@example.com'
export const DEMO_PASSWORD = 'password123'

export async function loginAsDemo(page: Page) {
  await page.goto('/login')
  await page.getByLabel('\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9').fill(DEMO_EMAIL)
  await page.getByLabel('\u30d1\u30b9\u30ef\u30fc\u30c9').fill(DEMO_PASSWORD)
  await page.getByRole('button', { name: '\u30ed\u30b0\u30a4\u30f3' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole('heading', { name: '\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9' })).toBeVisible()
}

export function uniqueTitle(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}
