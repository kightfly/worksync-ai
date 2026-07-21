# Wiki 审查跟踪表（wiki-audit-status）

> **用途**：对照 `学习资料.md`、`.gientech/skills/`、`AGENTS.md` 与仓库真相，分步审查 `.gientech/wiki/`。  
> **维护者**：每完成一批 Step，更新本表对应行与「下一步计划」。  
> **相关**：`delivery-state.md`、`harness-alignment-status.md`

**最近更新**：2026-07-21  
**当前批次**：Step 8 ✅ → **Wiki 全量审查完成**

---

## 真相源优先级

审查与修订时，冲突以以下顺序为准（高 → 低）：

1. **仓库代码**（`apps/`、`packages/`、`.github/workflows/`）
2. **designdoc**（`specs/`、`verification/`、`delivery/`）
3. **AGENTS.md / `.gientech/rules/` / `.gientech/skills/`**
4. **Wiki**（本目录，须与上面对齐）

> 对应 `学习资料.md` §1：文件化约束、对接工具链，避免 Wiki 与代码脱节。

---

## 统一页头模板（Step 1 起逐篇应用）

后续修订的 Wiki 页建议在标题下增加：

```markdown
> **文档类型**：设计契约 | 实现说明 | 流程指引
> **实现状态**：✅ 已实现 | 🟡 护栏/占位 | 📋 设计契约 | 🔮 企业版规划
> **最后核对**：YYYY-MM-DD
> **真相源**：designdoc/specs/xxx.md | apps/xxx
```

### 状态图例

| 标记 | 含义 |
|------|------|
| ✅ | 代码中已存在且与文档一致 |
| 🟡 | 部分存在（占位、冒烟、/health 等护栏） |
| 📋 | 设计/契约文档，实现尚未落地 |
| 🔮 | 企业版 spec 规划，非本期范围 |

---

## 审查批次总览

| Step | 范围 | 篇数 | 状态 | 完成标准 |
|------|------|------|------|----------|
| **0** | 基线 + 本跟踪表 | — | ✅ | 本文件 + 页头模板 + 优先级 |
| **1** | 入口与导航 | 2 | ✅ | `AI Harness.md`、`项目概述.md` |
| **2** | 流程与质量 | 4 | ✅ | 架构/测试/编码/部署 |
| **3** | 环境与依赖 | 2 | ✅ | 快速开始、技术栈 |
| **4** | API 参考 | 4 | ✅ | 契约标注 + 规格一致 |
| **5** | 数据模型 | 6 | ✅ | ER/Schema 与 design 对齐 |
| **6** | 基础设施 | 5 | ✅ | 实现状态标注 |
| **7** | 业务与集成 | 2 | ✅ | Service/外部集成 |
| **8** | 新增缺失页 | 3 | ✅ | 交付流程与 Skills 等 |

---

## 全量 Wiki 清单（24 篇）

| # | 文件 | Step | 审查状态 | 已知问题摘要 |
|---|------|------|----------|--------------|
| 1 | `.gientech/wiki/AI Harness.md` | 1 | ✅ 已改 | Step1：补 Harness/交付导航、Agent 阅读路径 |
| 2 | `.gientech/wiki/项目概述.md` | 1 | ✅ 已改 | Step1：功能状态改为 🟡/📋；补实现现状表 |
| 3 | `.gientech/wiki/架构总览.md` | 2 | ✅ 已改 | 目标 vs 当前实现表；services 不存在 |
| 4 | `.gientech/wiki/测试策略.md` | 2 | ✅ 已改 | 实际测试文件；假完成；E2E 冒烟 |
| 5 | `.gientech/wiki/编码指引.md` | 2 | ✅ 已改 | 去 Axios；密码 6；当前目录结构 |
| 6 | `.gientech/wiki/部署与运维.md` | 2 | ✅ 已改 | deploy-test Artifact、summary、⑫ 证据 |
| 7 | `.gientech/wiki/快速开始.md` | 3 | ✅ 已改 | db 未就绪；lint+e2e；JWT 非必 |
| 8 | `.gientech/wiki/技术栈与依赖.md` | 3 | ✅ 已改 | Router 7；TL 16；jwt/bcrypt 📋 |
| 9 | `.gientech/wiki/API参考/API参考.md` | 4 | ✅ 已改 | 📋 横幅；仅 /health；PATCH 任务 |
| 10 | `.gientech/wiki/API参考/认证API.md` | 4 | ✅ 已改 | 密码 6；路由未实现 |
| 11 | `.gientech/wiki/API参考/任务API.md` | 4 | ✅ 已改 | PATCH；全 📋 |
| 12 | `.gientech/wiki/API参考/打卡API.md` | 4 | ✅ 已改 | 时区；design 键名差异注明 |
| 13 | `.gientech/wiki/数据模型/数据模型.md` | 5 | ✅ 已改 | 📋 横幅；schema 未落地 |
| 14 | `.gientech/wiki/数据模型/User.md` | 5 | ✅ 已改 | name 可空；bcrypt 10 |
| 15 | `.gientech/wiki/数据模型/Task.md` | 5 | ✅ 已改 | title 255；due DATE；PATCH |
| 16 | `.gientech/wiki/数据模型/AttendanceRecord.md` | 5 | ✅ 已改 | check_in NOT NULL |
| 17 | `.gientech/wiki/数据模型/数据库Schema与迁移.md` | 5 | ✅ 已改 | packages 路径；索引对齐 |
| 18 | `.gientech/wiki/基础设施与中间件/基础设施与中间件.md` | 6 | ✅ 已改 | 状态总表 |
| 19 | `.gientech/wiki/基础设施与中间件/数据库层.md` | 6 | ✅ 已改 | `pg` 驱动；无连接代码 |
| 20 | `.gientech/wiki/基础设施与中间件/DrizzleORM.md` | 6 | ✅ 已改 | packages 路径；push:pg |
| 21 | `.gientech/wiki/基础设施与中间件/Repository层.md` | 6 | ✅ 已改 | 规划接口；无实现 |
| 22 | `.gientech/wiki/基础设施与中间件/中间件.md` | 6 | ✅ 已改 | 仅 /health；CORS 未注册 |
| 23 | `.gientech/wiki/业务逻辑层/业务逻辑层.md` | 7 | ✅ 已改 | packages/application；无实现 |
| 24 | `.gientech/wiki/外部系统集成/外部系统集成.md` | 7 | ✅ 已改 | PG/JWT 非「已集成」 |

### Step 8 计划新增（已创建）

| 文件 | 状态 | 说明 |
|------|------|------|
| `.gientech/wiki/交付流程与Skills.md` | ✅ 已建 | 4p12s + GienSpec + Superpower 映射 |
| `.gientech/wiki/designdoc交付物指南.md` | ✅ 已建 | 交付物路径与模板 |
| `.gientech/wiki/Wiki维护约定.md` | ✅ 已建 | 真相源与状态标注 |
| `.gientech/wiki/Wiki结构性改动说明.md` | ✅ 已建 | 审查为何大幅重写；保持精简版决议 |

---

## Step 8 变更清单（2026-07-21）

### 新增

- `交付流程与Skills.md` — 十二步与 skills 映射、Agent 开场顺序
- `designdoc交付物指南.md` — designdoc 目录、模板、TASK 约定
- `Wiki维护约定.md` — 真相源、页头、更新时机

### 修改

- `AI Harness.md` — 链接三篇新页；审查进度标完成

### 新增（结构性改动说明）

- `Wiki结构性改动说明.md` — 审查策略、旧新 Wiki 对比、团队决议（保持精简版）

---

## Step 7 变更清单（2026-07-21）

### 修改

- `业务逻辑层/业务逻辑层.md` — 📋 横幅；`packages/application`；bcrypt 10；密码 6
- `外部系统集成/外部系统集成.md` — 区分依赖 vs 运行时；`pg`；JWT/bcrypt 未装

---

## Step 6 变更清单（2026-07-21）

### 修改

- `基础设施与中间件/基础设施与中间件.md` — 实现状态总表；当前仅 /health
- `基础设施与中间件/数据库层.md` — `pg` + `node-postgres`；无连接代码
- `基础设施与中间件/DrizzleORM.md` — `packages/infrastructure`；`push:pg`
- `基础设施与中间件/Repository层.md` — 规划接口；标明无实现
- `基础设施与中间件/中间件.md` — CORS 已装未注册；JWT/helmet 📋

---

## Step 5 变更清单（2026-07-21）

### 修改

- `数据模型/数据模型.md` — 📋 横幅；schema 未落地；`packages/infrastructure` 路径
- `数据模型/User.md` — `name` 可空；bcrypt `SALT_ROUNDS=10`；密码 6 字符
- `数据模型/Task.md` — `title` 255；`due_date` DATE；PATCH；索引块
- `数据模型/AttendanceRecord.md` — `check_in_time` NOT NULL；POST 与 design 差异注明
- `数据模型/数据库Schema与迁移.md` — SQL 对齐 design；索引名；drizzle 配置未创建

---

## Step 4 变更清单（2026-07-21）

### 修改

- `API参考/API参考.md` — 设计契约说明；端点实现列；PATCH
- `API参考/认证API.md` — 密码 6；JWT/bcrypt 未装
- `API参考/任务API.md` — PATCH 对齐 design；检查清单
- `API参考/打卡API.md` — 时区/workDate；与 design 响应键差异

---

## Step 3 变更清单（2026-07-21）

### 修改

- `.gientech/wiki/快速开始.md` — 护栏 vs DB；CI 对齐验证；JWT 非必
- `.gientech/wiki/技术栈与依赖.md` — package.json 真相表；Router 7 / TL 16

---

## Step 2 变更清单（2026-07-21）

### 修改

- `.gientech/wiki/架构总览.md` — 目标/当前双架构；模块 📋 标注
- `.gientech/wiki/测试策略.md` — 真实测试路径；覆盖矩阵现状列
- `.gientech/wiki/编码指引.md` — 当前 vs 目标结构；fetch 待引入；密码 6
- `.gientech/wiki/部署与运维.md` — CI 顺序、Artifact、deploy-log 证据链

---

## Step 0 + Step 1 变更清单

### 新增

- `designdoc/delivery/wiki-audit-status.md`（本文件）

### 修改

- `.gientech/wiki/AI Harness.md` — Harness/交付分区、Agent 路径、仓库外链接
- `.gientech/wiki/项目概述.md` — 实现现状、状态图例、GienSpec/Superpower、delivery 链接

---

## 下一步计划

**Wiki 审查**：✅ 全量完成（24 篇基础 + 3 篇新增）。

后续维护：代码/规格变更时按 [Wiki维护约定.md](../../.gientech/wiki/Wiki维护约定.md) 增量更新；产品交付按 `delivery-state.md` 推进 ⑥⑦⑧。

---

## 下一步计划（Step 8）— 已完成

<details>
<summary>Step 8 要点（归档）</summary>

新增交付流程、designdoc 指南、Wiki 维护约定三页；`AI Harness.md` 已链入。

</details>

---

## 历史：Step 7 计划 — 已完成

<details>
<summary>Step 7 要点（归档）</summary>

业务逻辑层为 📋 设计契约；外部集成区分「依赖已声明」与「运行时已集成」。

</details>

<details>
<summary>Step 6 要点（归档）</summary>

基础设施 5 篇：依赖已装；Schema/Repository/DB 连接均为 📋；`server.ts` 仅 `GET /health`；驱动以 `pg` 为准。

</details>

<details>
<summary>Step 5 要点（归档）</summary>

数据模型 6 篇均为 📋 设计契约；字段与 `design.md` 对齐；Schema 目标路径 `packages/infrastructure/db/schema.ts`。

</details>

<details>
<summary>Step 4 要点（归档）</summary>

API 四层均为 📋 设计契约；仅 GET /health 已实现；认证密码 6 字符。

</details>

---

## 每批审查检查表（复制使用）

- [ ] 实现状态标注正确（✅/🟡/📋/🔮）
- [ ] 与 `designdoc/specs/design.md` 无未标注冲突
- [ ] 4p12s / 门禁 / 假完成（若适用）表述正确
- [ ] 交叉链接有效
- [ ] 页头模板已加（或本批统一约定）

---

## 如何更新本文件

1. 完成某 Step 后：该 Step 行标 ✅，各篇「审查状态」改为 ✅ 已改。
2. 「当前批次」改为下一 Step，并更新「下一步计划」节。
3. 可选：在 `delivery-state.md` → 下一步建议加 Wiki 审查进度一句。
