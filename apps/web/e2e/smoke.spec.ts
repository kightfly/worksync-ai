import { test, expect } from '@playwright/test';

/**
 * Phase 3 冒烟：登录页可打开且关键日文文案可见。
 * 完整登录→一覧链路在业务实现后于 4p12s ⑩ 扩展。
 */
test.describe('冒烟：ログイン画面', () => {
  test('ログイン画面が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '勤怠・タスク管理' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
  });
});
