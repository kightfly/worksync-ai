# TASK-B206: 种子数据

## 元信息

- 标题：创建 DB seed（用户 / 任务 / 打刻）
- 状态：done
- 依赖：B201/B202（Schema + migrate）
- 契约版本：verification-plan §种子数据 / design BR-010
- 对应 US / V：US-020/021 / V-020～V-021

## 目标

`npm run db:seed` 向 Supabase 插入演示数据，供登录与打刻只读验收。

## 种子内容

| 类型 | 内容 |
|------|------|
| 用户 | `test@example.com` / `password123` / `テストユーザー`（bcrypt） |
| 任务 | todo / in_progress / done 各 1 条 |
| 打刻 | 3 条；含跨日边界样例（`work_date` 按出勤日） |

## 涉及文件

- `packages/infrastructure/src/db/seed.ts`
- `packages/infrastructure/package.json`（`db:seed` 脚本）
- 根 `package.json` → `apps/api` → `@ai-harness/infrastructure`

## 验收标准

- [x] 幂等：已存在测试用户时跳过
- [x] `npm run db:seed` 成功
- [x] 含 tasks 三状态与 attendance_records

## 证据（⑧ 回写）

```bash
npm run db:seed
# シードデータを投入しました。
#   ユーザー: test@example.com / password123
```

- 红灯次数：0
- 升级给人：否

## 门禁

- [x] 手动验证通过（Supabase）
- [x] 与 verification-plan 种子要求一致
