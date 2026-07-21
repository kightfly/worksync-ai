import { test, expect } from '@playwright/test';

test.describe('E2E: 主路径', () => {
  test('未ログインで /tasks にアクセスするとログイン画面へ戻る', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
  });

  test('ログイン → タスク作成 → 状態更新 → 打刻一覧 → ログアウト', async ({
    page,
  }) => {
    const title = `E2Eタスク-${Date.now()}`;

    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await page.getByRole('complementary').getByRole('link', { name: 'タスク管理' }).click();
    await expect(page.getByRole('heading', { name: 'タスク管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: /テストユーザー/ })).toBeVisible();

    await page.getByRole('button', { name: '＋ 新規' }).click();
    await page.getByLabel('タイトル').fill(title);
    await page.getByLabel('説明').fill('E2E 説明');
    await page.getByRole('button', { name: 'タスクを追加' }).click();

    const createdRow = page.getByRole('row').filter({ hasText: title });
    await expect(createdRow).toBeVisible();
    await expect(createdRow.getByText('todo')).toBeVisible();

    await createdRow.getByRole('button', { name: '開始' }).click();
    await expect(createdRow.getByText('in_progress')).toBeVisible();

    await createdRow.getByRole('button', { name: '完了' }).click();
    await expect(createdRow.getByText('done')).toBeVisible();

    await createdRow.getByRole('button', { name: '詳細' }).click();
    await expect(page.getByRole('heading', { name: '詳細' })).toBeVisible();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await page.getByRole('button', { name: '×' }).click();

    await page.getByRole('complementary').getByRole('link', { name: '打刻' }).click();
    await expect(page.getByRole('heading', { name: '打刻一覧' })).toBeVisible();
    const dailyStats = page.getByRole('region', { name: '日次集計' });
    await expect(dailyStats.getByRole('heading', { name: '日次集計' })).toBeVisible();
    await expect(dailyStats.getByText('2025-01-15: 12 時間')).toBeVisible();

    await page.getByRole('button', { name: /テストユーザー/ }).click();
    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
    await expect(page.getByText('ログアウトしました')).toBeVisible();
  });
});
