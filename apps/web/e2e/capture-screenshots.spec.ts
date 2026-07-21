import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..');
const screenshotDir = path.join(repoRoot, 'designdoc/delivery/assets/e2e');

test.describe('E2E: 案例截图采集', () => {
  test.beforeAll(async () => {
    await mkdir(screenshotDir, { recursive: true });
  });

  test('主路径关键画面截图', async ({ page }) => {
    const title = `E2E截图-${Date.now()}`;

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '01-login.png'), fullPage: true });

    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page.getByRole('button', { name: /テストユーザー/ })).toBeVisible();
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '02-dashboard.png'), fullPage: true });

    await page.getByRole('complementary').getByRole('link', { name: 'タスク管理' }).click();
    await expect(page.getByRole('heading', { name: 'タスク管理' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '03-tasks-list.png'), fullPage: true });

    await page.getByRole('button', { name: '＋ 新規' }).click();
    await page.getByLabel('タイトル').fill(title);
    await page.getByLabel('説明').fill('E2E スクリーンショット用');
    await page.getByRole('button', { name: 'タスクを追加' }).click();

    const createdRow = page.getByRole('row').filter({ hasText: title });
    await expect(createdRow).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '04-task-created.png'), fullPage: true });

    await createdRow.getByRole('button', { name: '開始' }).click();
    await expect(createdRow.getByText('in_progress')).toBeVisible();
    await createdRow.getByRole('button', { name: '完了' }).click();
    await expect(createdRow.getByText('done')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '05-task-done.png'), fullPage: true });

    await page.getByRole('complementary').getByRole('link', { name: '打刻' }).click();
    await expect(page.getByRole('heading', { name: '打刻一覧' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '06-attendance.png'), fullPage: true });

    await page.getByRole('button', { name: /テストユーザー/ }).click();
    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, '07-logout.png'), fullPage: true });
  });
});
