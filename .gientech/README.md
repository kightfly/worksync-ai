# `.gientech/` — GienCoder Harness 入口

本目录是 **GienCoder / Harness** 的统一工程入口（`WIKI_DIR` 及其配套 Skills、Rules）。

| 子目录 | 用途 |
|--------|------|
| `wiki/` | RepoWiki 知识库（导航、架构、API、流程） |
| `skills/` | 4p12s（12）+ GienSpec（5）+ Superpower（5）+ 横切技能 |
| `rules/` | 工程规则：`4p12s-gates`、`tdd`、`security`、`timezone`、`naming` |
| `spec/` | GienSpec 规格产物（按需） |

## 最低复用包（给同事）

若只想快速复用本案例方法，至少准备：

1. `AGENTS.md`（仓库根）
2. `.gientech/skills/` + `.gientech/rules/` + `.gientech/wiki/`
3. `designdoc/delivery/delivery-state.md`
4. `designdoc/delivery/4p12s-work-tasks.md`
5. `designdoc/delivery/harness-practice-case.md` + `designdoc/delivery/assets/e2e/`
6. CI：`.github/workflows/ci.yml`（`quality` → `deploy-test`）

**一句话总结：** 把 GienCoder 当「按 Skill 执行的交付助手」，而不是「一次性代码生成器」——**Wiki 定入口、文件定进度、测试定完成、部署定闭环**。

## Agent 开场必读

1. `AGENTS.md`
2. `designdoc/delivery/delivery-state.md`
3. 当前步骤对应 `.gientech/skills/4p12s-*.md`
4. `.gientech/rules/`（尤其 `4p12s-gates.mdc`、`tdd.mdc`）
5. 本目录 Wiki 相关章节

> 真相源优先级：代码 > designdoc > AGENTS / rules / skills > Wiki。
