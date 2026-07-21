# Wiki 维护约定

> **文档类型**：流程指引  
> **实现状态**：✅ 约定文档  
> **最后核对**：2026-07-21  
> **真相源**：[`wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md) | [`AGENTS.md`](../../AGENTS.md)  
> **审查跟踪**：[`wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md)

## 目的

避免 `.gientech/wiki/` 与代码、designdoc 脱节；支持分步审查与 Agent 可靠交付。

## 真相源优先级

冲突时按以下顺序为准（高 → 低）：

1. **仓库代码**（`apps/`、`packages/`、`.github/workflows/`）
2. **designdoc**（`specs/`、`verification/`、`delivery/`）
3. **AGENTS.md / `.cursor/rules/` / `skills/`**
4. **Wiki**

## 状态标注（强制）

| 标记 | 含义 | 使用场景 |
|------|------|----------|
| ✅ | 已实现且与代码一致 | `GET /health`、CI、已装依赖等 |
| 🟡 | 部分存在 | 登录 UI 占位、CORS 已装未注册 |
| 📋 | 设计契约，未落地 | API、Schema、Service |
| 🔮 | 企业版规划 | `.gientech/spec/` 扩展 |

**禁止**将 📋 设计契约写成「已集成」「已实现」。

## 页头模板

修订 Wiki 时，标题下建议增加：

```markdown
> **文档类型**：设计契约 | 实现说明 | 流程指引
> **实现状态**：✅ | 🟡 | 📋 | 🔮（组合说明）
> **最后核对**：YYYY-MM-DD
> **真相源**：designdoc/... | apps/...
> **审查跟踪**：designdoc/delivery/wiki-audit-status.md
```

## 何时更新 Wiki

| 触发 | 应更新 |
|------|--------|
| 新增/修改 API 路由 | `API参考/*`、`API参考.md` 实现状态列 |
| Schema / 迁移落地 | `数据模型/*`、`DrizzleORM.md`、`数据库Schema与迁移.md` |
| 新增 Service / Repository | `业务逻辑层.md`、`Repository层.md` |
| 依赖变更 | `技术栈与依赖.md` |
| CI / 部署变更 | `部署与运维.md`、`快速开始.md` |
| Harness / 十二步变更 | `交付流程与Skills.md`、`AI Harness.md` |
| 完成一批 Wiki 审查 | `wiki-audit-status.md` |

## 语言约定

| 范围 | 语言 |
|------|------|
| 代码、UI、种子数据、API 错误消息 | **日文** |
| Wiki、`designdoc/delivery/`、与 Agent 流程文档 | **中文** |

## 链接约定

- Wiki 内互链：相对路径（同目录或 `../`）
- 指向仓库根：`../../AGENTS.md`、`../../designdoc/...`
- 优先链接到 **文件路径**，便于 IDE 跳转

## 审查流程

大规模对齐时采用 **分步审查**（见 `wiki-audit-status.md`）：

1. 按 Step 批次修订
2. 更新跟踪表「审查状态」与变更清单
3. 同步 `delivery-state.md` 的 Wiki 进度一句（可选）

全量 24 篇基础 Wiki 已于 2026-07-21 审查完成；新增页在 Step 8 单独登记。

## Wiki 定位与 2026-07-21 结构性改动

审查采用 **契约化精简重写**（非在旧 GienTech 长文模板上逐段修订），原因是旧 Wiki 多处与代码事实冲突（如 Service 已存在、TestRedis、postgres.js 等），易引发 Agent **假完成**。

| 层级 | 用途 |
|------|------|
| `designdoc/specs/` | 长篇 PRD、设计、用户故事（主规格真相源） |
| `.gientech/wiki/` | 导航、现状快照、`✅/🟡/📋` 标注、链向 designdoc |
| 代码 | 最高优先级真相源 |

**为何 diff 很大、Mermaid 变少？** 见专门说明：[Wiki结构性改动说明.md](Wiki结构性改动说明.md)。

**当前决议**：保持精简版 Wiki；不恢复旧版百科全书目录/性能/排障章节。

## 相关文档

- [AI Harness](AI%20Harness.md) — Wiki 总索引
- [designdoc 交付物指南](designdoc交付物指南.md) — 交付物路径
- [项目概述](项目概述.md) — 实现现状表
