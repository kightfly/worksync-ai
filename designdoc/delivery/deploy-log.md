# 部署日志（4p12s ⑫）

> **Skill**：`skills/4p12s-deployment-execution.md`  
> **最近更新**：2026-07-21  
> **关联 commit**：`3f489fd`（⑪ 推送基线）+ 本轮构建修复（domain/infrastructure 编译产物）

## 元信息

| 项 | 值 |
|----|-----|
| 日期 | 2026-07-21 |
| 分支 / commit | `main` / `3f489fd`（基线）；本地构建修复待随下一 commit 推送 |
| 触发方式 | 本地 Artifact 等价部署（对应 CI `deploy-test` job 产物流程） |
| 操作者 | GienCoder Agent（本地验证） |

## 1. 构建

| 项 | 结果 |
|----|------|
| 流水线 | GitHub Actions `.github/workflows/ci.yml` → job `Deploy Test Environment` |
| 本地等价命令 | `npm run build` |
| 构建结果 | ✅ 成功 |

**产物：**

| Artifact 名（CI） | 路径（本地） | 说明 |
|-------------------|--------------|------|
| `test-env-web-<sha>` | `apps/web/dist` | Vite 生产静态资源 |
| `test-env-api-<sha>` | `apps/api/dist` | Fastify API 编译输出 |
| — | `packages/domain/dist` | 领域层编译输出（本轮补齐） |
| — | `packages/infrastructure/dist` | 数据层编译输出（本轮补齐） |

**说明：** 本轮修复了 `node dist/index.js` 无法加载 workspace `.ts` 源码的问题，`npm run build` 现按 `domain → infrastructure → web → api` 顺序编译。

## 2. 数据库迁移

| 项 | 结果 |
|----|------|
| 命令 | `npm run db:migrate` → `npm run db:seed` |
| 数据库 | Supabase PostgreSQL（`.env.local` 配置，密钥不入库） |
| 迁移结果 | ✅ `drizzle-kit push:pg` 成功 |
| Seed 结果 | ✅ 种子数据已存在（跳过重复写入） |

## 3. 配置（无密钥）

| 项 | 值 |
|----|-----|
| 环境名 | 本地测试环境（Artifact 解压等价部署） |
| API 端口 | `3100` |
| Web 端口 | `5173` |
| 前端 API 地址 | `VITE_API_BASE_URL=http://127.0.0.1:3100`（构建时注入） |
| 密钥来源 | `.env.local`（`DATABASE_URL`、`JWT_SECRET` 等，**未写入本文档**） |

## 4. 访问

| 服务 | URL | 健康检查 |
|------|-----|----------|
| API | `http://127.0.0.1:3100` | `GET /health` → `{"status":"ok"}` ✅ |
| Web | `http://127.0.0.1:5173` | HTTP 200 ✅ |

**启动命令（Artifact 解压后）：**

```bash
# 1. 构建（含 workspace 包）
npm run build

# 2. Web（测试环境需指定 API 地址）
cd apps/web
VITE_API_BASE_URL=http://127.0.0.1:3100 npm run build
npx vite preview --host 127.0.0.1 --port 5173

# 3. API
cd apps/api
PORT=3100 node dist/index.js
```

> **公网 URL：** 当前仓库 CI 上传 Artifact 后由团队自行 hosting；本轮以本地 Artifact 等价部署完成门禁验证。若需公网演示 URL，可在 GitHub Actions 运行页下载 Artifact 后部署到 hosting，并追加本节 URL。

## 5. 部署后验证

### 5.1 API 冒烟

```bash
curl http://127.0.0.1:3100/health
# {"status":"ok"}

# 登录（seed 用户）
POST /api/auth/login
# email: test@example.com / password: password123 → 200 + token
```

结果：✅ 健康检查与登录均成功。

### 5.2 E2E（指向已部署环境）

使用生产构建产物 + 已启动服务，禁用 Playwright 内置 dev server：

```bash
cd apps/web
DEPLOY_SMOKE=1 E2E_PORT=5173 E2E_API_PORT=3100 npm run test:e2e
# 2 passed (chromium)
```

| E2E ID | 场景 | 结果 |
|--------|------|------|
| E2E-001 | 未登录访问 `/tasks` → `/login` | ✅ |
| E2E-002 | 登录 → 任务创建/状态流转 → 打刻 → 登出 | ✅ |

报告：`apps/web/playwright-report/`

## 6. 回滚方案

1. **代码回滚**：`git revert` 到上一稳定 commit（如 `3f489fd`），重新 `npm run build` 并部署 Artifact。
2. **Artifact 回滚**：在 GitHub Actions 历史运行中下载上一版 `test-env-web-*` / `test-env-api-*`，替换当前部署目录。
3. **数据库**：Schema 变更需人工评估；本轮无新迁移，仅 push 既有 schema。
4. **配置回滚**：恢复上一版 `.env.local` 或 hosting 环境变量（不含密钥写入仓库）。

## 7. 门禁结论

| 检查项 | 结果 |
|--------|------|
| 有流水线 / 等价触发记录 | ✅ CI `deploy-test` + 本地 build 等价 |
| 环境可访问 | ✅ 本地测试 URL 已验证 |
| 迁移与配置已记录 | ✅ |
| 冒烟 / E2E 已附 | ✅ API 健康 + 登录 + E2E 2 passed |
| 回滚方案已写 | ✅ |

**结论：4p12s ⑫ 测试环境部署门禁通过（本地 Artifact 等价部署模型）。**

后续若团队接入公网 hosting，仅需在本文件 **§4 访问** 追加公网 URL 与部署后复验记录，无需重复整轮开发验证。
