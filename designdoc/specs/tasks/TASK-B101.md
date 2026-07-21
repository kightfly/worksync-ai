# TASK-B101: User 实体

## 元信息

- 标题：创建 User 实体（邮箱/密码校验）
- 状态：done
- 依赖：无（领域层）
- 契约版本：PRD 0.2.0 / design 0.2.0 / user-stories US-001
- 对应 US / V：US-001 / V-001～V-002

## 目标

在 `packages/domain` 实现 `User` 实体，校验邮箱格式与密码长度（≥6）。

## 边界（做 / 不做）

- **做**：`User.create`、邮箱 trim + 小写化、密码最少 6 字符
- **不做**：bcrypt 哈希（在 infrastructure seed / 后续 Auth 层）

## 涉及文件

- `packages/domain/src/entities/user.ts`
- `packages/domain/src/entities/user.test.ts`
- `packages/domain/src/index.ts`

## 验收标准

- [x] 邮箱格式无效 → `メールアドレスの形式が正しくありません`
- [x] 密码 < 6 → `パスワードは6文字以上で入力してください`
- [x] 合法输入创建 User；邮箱 normalize 为小写
- [x] `npm run test -w @ai-harness/domain` 全绿

## 证据（⑧ 回写）

```bash
npm run test -w @ai-harness/domain   # 13 passed（含 Task）
npm run test
npm run typecheck
```

- 红灯次数：0
- 升级给人：否

## 门禁

- [x] 可独立验证（纯单元测试）
- [x] 测试证据齐全
