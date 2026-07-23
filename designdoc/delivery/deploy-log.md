# 部署日志（deploy-log）

> Skill：`.gientech/skills/4p12s-deployment-execution.md`  
> 模板：`designdoc/templates/deploy-log.template.md`

## 元信息

- 日期：2026-07-23
- 分支 / commit：`replay/4p12s-from-design` @ `c9037c5`
- 触发方式：**手动核查**（无 CI/CD 可触发）
- 操作者：Agent（⑫）+ 人确认

---

## 1. 构建 / 流水线

| 项 | 结果 |
|----|------|
| `.github/workflows/*` | **不存在** |
| 流水线 URL / 构建号 | 无 |
| 托管平台发布 | **未执行**（无已配置的测试环境应用托管） |
| 结论 | 无法形成「触发 CI/CD 到测试环境」的流水线证据 |

---

## 2. 数据库迁移

| 项 | 结果 |
|----|------|
| 目标 | 测试用 PostgreSQL（Supabase pooler；连接串仅在本地 `.env.local`，**未写入本文件**） |
| 命令 | `npm run db:migrate` / `npm run db:seed`（经 `scripts/run-integration.mjs` 链路复核） |
| 迁移 | `packages/infrastructure/drizzle/0000_init.sql` + `pgcrypto`；幂等 NOTICE（表已存在） |
| 种子 | demo 用户 + 已知 Tokyo 出勤场景重置 |
| 结果 | **成功**（DB 层可达） |

> 说明：DB 可用 ≠ 测试环境应用已部署。Skill 禁止仅用「本机可跑」代替可访问测试环境 URL。

---

## 3. 配置（无密钥）

| 项 | 值 |
|----|-----|
| 环境名 | 计划中的「测试环境」——**应用层未开通** |
| `DATABASE_URL` | 已用于 ⑨⑩（托管侧 Secret 待配） |
| `JWT_SECRET` | 本地开发用；托管须单独注入 |
| `VITE_API_BASE_URL` | 须指向**公开 API**；当前示例仍为本地 |

规程见：`.gientech/wiki/部署与运维.md`

---

## 4. 访问

| 服务 | URL | 状态 |
|------|-----|------|
| Web（测试） | （未分配） | **不可访问** |
| API（测试） | （未分配） | **不可访问** |
| 健康检查 | 无公开 `GET /health` | **未执行于托管环境** |
| 本地对照（非门禁证据） | `http://127.0.0.1:5173` / `:3000` | ⑨⑩ 曾验证；**不得单独作为 ⑫ 通过依据** |

---

## 5. 部署后验证

| 项 | 结果 |
|----|------|
| 指向测试环境的冒烟 / E2E | **未执行**（无公开 baseURL） |
| ⑨ 集成 / ⑩ E2E | 已在「真 DB + 本地进程」通过；**不等于**测试环境部署验收 |

---

## 6. 回滚方案

- 应用：待有镜像/发布产物后，回退上一版本构建
- DB：当前迁移为幂等建表；破坏性变更前先备份 Supabase
- 分支：保留 `origin/develop`；不 force-push `main`/`develop`

---

## 7. 阻塞归因与解锁清单

| 阻塞 | 解除条件 |
|------|----------|
| 无 CI/CD | 补 `.github/workflows` 或等价流水线（Harness Phase 3） |
| 无 Web/API 托管 | 开通测试环境并给出 HTTPS（或内网可达）URL |
| 无部署后冒烟 | 对上述 URL 跑 `/health` + 至少登录冒烟（或 E2E `E2E_BASE_URL=`） |

---

## 8. 门禁结论

- [ ] 有流水线或等价触发记录 → **否**
- [ ] 环境可访问 → **否**
- [x] 迁移与配置已记录（DB 层）
- [ ] 冒烟/验证指向托管环境 → **否**
- [x] 回滚思路已写
- [x] **交付未完成（⑫ = blocked）**

**禁止宣称**：测试环境部署通过 / 本迭代已在测试环境验收闭环。  
**已完成**：阻塞原因与解锁路径文件化；DB 侧可追溯。
