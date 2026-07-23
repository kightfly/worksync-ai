# TASK-S001

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Monorepo 脚手架与质量脚本 |
| **状态** | done |
| **依赖** | — |
| **契约版本** | design.md `0.1.0-replay` |
| **对应 US / V** | 环境前提（verification-plan §4.2） |

## 目标

按固定技术栈创建 workspace：`apps/web`、`apps/api`、`packages/domain`、`packages/infrastructure`；配置 TypeScript strict、ESLint、Prettier、Vitest 根脚本与 `.env.example`。

## 边界（做 / 不做）

- **做**：目录骨架、package 引用、`npm run lint|typecheck|test` 可运行（可为空套件）、README 本地启动要点
- **不做**：业务实体、API 路由、UI 页面、真 DB 连接逻辑（留给后续 TASK）

## 涉及文件

- 根 `package.json` / npm workspaces
- `apps/web/*`、`apps/api/*`、`packages/domain/*`、`packages/infrastructure/*`
- `.env.example`（`DATABASE_URL`、`JWT_SECRET`、`SALT_ROUNDS`）
- ESLint / tsconfig 基座

## 失败测试（红灯意图）

- 骨架类：先加「workspace 包可被 resolve」的最小 smoke（例：domain 导出 `PING` 常量的单测）→ 红 → 建包使绿
- 注明：本 TASK 以脚手架为主，业务 TDD 从 B101 起严格执行

## 验收标准

- [x] 四包目录存在且可 `npm install`
- [x] `lint` / `typecheck` / `test` 脚本可执行且通过（最小）
- [x] `.env.example` 含约定变量名；无密钥入库
- [x] 技术栈未偏离 AGENTS / design §2

## 证据（⑧ 回写）

```bash
npm install
npm test
```

- 红灯次数：0
- 升级给人：否

## 门禁

- [x] 可独立验证
- [x] 测试证据齐全 → 可进入 B101/B102/I101
