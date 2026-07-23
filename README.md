# GienHarness · replay 分支

分支：`replay/4p12s-from-design`

## 当前状态

**4p12s ①～⑪ 完成；⑫ 测试环境部署 `blocked`。**  
原因：无 CI/CD、无公开 Web/API 测试 URL（详见 [`deploy-log.md`](designdoc/delivery/deploy-log.md)）。

| 路径 | 说明 |
|------|------|
| [`designdoc/整体设计.md`](designdoc/整体设计.md) | **唯一业务设计**（含固定技术栈） |
| [`designdoc/delivery/delivery-state.md`](designdoc/delivery/delivery-state.md) | **十二步交付状态**（真相源） |
| [`designdoc/delivery/deploy-log.md`](designdoc/delivery/deploy-log.md) | ⑫ 部署日志（当前：阻塞） |
| [`designdoc/verification/verification-result.md`](designdoc/verification/verification-result.md) | ⑨⑩ 验证结果 |
| [`apps/`](apps/) / [`packages/`](packages/) | 业务实现 |
| [`.gientech/wiki/部署与运维.md`](.gientech/wiki/部署与运维.md) | 测试环境解锁规程 |
| [`AGENTS.md`](AGENTS.md) | 精简开发规范 |

## 本地开发

```bash
cp .env.example .env.local   # 填入 DATABASE_URL / JWT_SECRET（勿提交）
npm install
npm run build -w @gienharness/domain -w @gienharness/infrastructure
npm run db:migrate && npm run db:seed
npm run dev:api              # 默认 :3000 或 API_PORT
npm run dev:web              # :5173（/api 代理到 API）
npm test
npm run test:integration     # 需 DATABASE_URL
npm run test:e2e             # 真 API+Web+DB
```

Seed：`test@example.com` / `password123`
