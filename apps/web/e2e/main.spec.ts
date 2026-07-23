import { test, expect } from '@playwright/test'
import { DEMO_EMAIL, DEMO_PASSWORD, loginAsDemo, uniqueTitle } from './helpers'

test('E2E-001 login success navigates to dashboard', async ({ page }) => {
  await loginAsDemo(page)
})

test('E2E-002 login failure shows unified Japanese error', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9').fill(DEMO_EMAIL)
  await page.getByLabel('\u30d1\u30b9\u30ef\u30fc\u30c9').fill('wrong-password')
  await page.getByRole('button', { name: '\u30ed\u30b0\u30a4\u30f3' }).click()
  await expect(page.getByRole('alert')).toContainText(
    '\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u307e\u305f\u306f\u30d1\u30b9\u30ef\u30fc\u30c9\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093',
  )
  await expect(page).toHaveURL(/\/login/)
})

test('E2E-003 unauthenticated /tasks redirects to login', async ({ page }) => {
  await page.goto('/tasks')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: '\u30ed\u30b0\u30a4\u30f3' })).toBeVisible()
})

test('E2E-004 create task appears as todo in list', async ({ page }) => {
  const title = uniqueTitle('E2E-create')
  await loginAsDemo(page)
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: '\u30bf\u30b9\u30af\u7ba1\u7406' })).toBeVisible()
  await page.getByRole('button', { name: '\u65b0\u898f\u4f5c\u6210' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('\u30bf\u30a4\u30c8\u30eb').fill(title)
  await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/tasks') && r.request().method() === 'POST' && r.ok(),
    ),
    dialog.getByRole('button', { name: '\u4f5c\u6210', exact: true }).click(),
  ])
  await expect(dialog).toHaveCount(0)
  const row = page.locator('tr', { hasText: title })
  await expect(row).toBeVisible()
  await expect(row).toContainText('todo')
})

test('E2E-005 task status todo -> in_progress -> done', async ({ page }) => {
  const title = uniqueTitle('E2E-status')
  await loginAsDemo(page)
  await page.goto('/tasks')
  await page.getByRole('button', { name: '\u65b0\u898f\u4f5c\u6210' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('\u30bf\u30a4\u30c8\u30eb').fill(title)
  await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/tasks') && r.request().method() === 'POST' && r.ok(),
    ),
    dialog.getByRole('button', { name: '\u4f5c\u6210', exact: true }).click(),
  ])
  const row = page.locator('tr', { hasText: title })
  await expect(row).toContainText('todo')
  await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/tasks/') && r.request().method() === 'PATCH' && r.ok(),
    ),
    row.getByRole('button', { name: '\u7740\u624b' }).click(),
  ])
  await expect(row).toContainText('in_progress')
  await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/tasks/') && r.request().method() === 'PATCH' && r.ok(),
    ),
    row.getByRole('button', { name: '\u5b8c\u4e86' }).click(),
  ])
  await expect(row).toContainText('done')
})

test('E2E-006 delete confirms removal; cancel keeps task', async ({ page }) => {
  const keepTitle = uniqueTitle('E2E-keep')
  const deleteTitle = uniqueTitle('E2E-delete')
  await loginAsDemo(page)
  await page.goto('/tasks')

  for (const title of [keepTitle, deleteTitle]) {
    await page.getByRole('button', { name: '\u65b0\u898f\u4f5c\u6210' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('\u30bf\u30a4\u30c8\u30eb').fill(title)
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/tasks') && r.request().method() === 'POST' && r.ok(),
      ),
      dialog.getByRole('button', { name: '\u4f5c\u6210', exact: true }).click(),
    ])
    await expect(page.locator('tr', { hasText: title })).toBeVisible()
  }

  await page.locator('tr', { hasText: keepTitle }).getByRole('button', { name: '\u524a\u9664' }).click()
  await expect(page.getByText('\u3053\u306e\u30bf\u30b9\u30af\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f')).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: '\u30ad\u30e3\u30f3\u30bb\u30eb' }).click()
  await expect(page.locator('tr', { hasText: keepTitle })).toBeVisible()

  const delRow = page.locator('tr', { hasText: deleteTitle })
  await delRow.getByRole('button', { name: '\u524a\u9664' }).click()
  await expect(page.getByText('\u3053\u306e\u30bf\u30b9\u30af\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f')).toBeVisible()
  await Promise.all([
    page.waitForResponse(
      (r) =>
        r.url().includes('/api/tasks/') &&
        r.request().method() === 'DELETE' &&
        r.ok(),
    ),
    page.getByRole('dialog').getByRole('button', { name: '\u524a\u9664' }).click(),
  ])
  await expect(page.locator('tr', { hasText: deleteTitle })).toHaveCount(0)
  await expect(page.locator('tr', { hasText: keepTitle })).toBeVisible()
})

test('E2E-007 logout then protected page requires login', async ({ page }) => {
  await loginAsDemo(page)
  await page.getByRole('button', { name: '\u30ed\u30b0\u30a2\u30a6\u30c8' }).click()
  await expect(page).toHaveURL(/\/login/)
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('E2E-008 attendance list shows Tokyo +09:00 or empty copy', async ({ page }) => {
  await loginAsDemo(page)
  await page.goto('/attendance')
  await expect(page.getByRole('heading', { name: '\u6253\u523b', exact: true })).toBeVisible()
  const empty = page.getByText('\u6253\u523b\u8a18\u9332\u306f\u3042\u308a\u307e\u305b\u3093')
  const withOffset = page.locator('td', { hasText: '+09:00' })
  await expect(empty.or(withOffset.first())).toBeVisible()
})

test('E2E-009 daily statistics visible and match seed minutes', async ({ page }) => {
  await loginAsDemo(page)
  await page.goto('/attendance')
  const stats = page.locator('section').filter({
    has: page.getByRole('heading', { name: '\u65e5\u6b21\u96c6\u8a08' }),
  })
  await expect(stats.getByRole('heading', { name: '\u65e5\u6b21\u96c6\u8a08' })).toBeVisible()
  await expect(stats.locator('tr', { hasText: '2026-07-20' })).toContainText('540')
  await expect(stats.locator('tr', { hasText: '2026-07-21' })).toContainText('180')
})
