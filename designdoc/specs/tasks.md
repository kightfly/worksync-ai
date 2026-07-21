# 任务清单

> **4p12s ⑦ 约定（Phase 3）**  
> - 本文件作为 **任务索引**（过渡期继续维护 Phase 勾选）。  
> - 新拆任务请复制 `designdoc/templates/TASK.template.md` → `designdoc/specs/tasks/TASK-xxx.md`。  
> - Skill：`skills/4p12s-implementation-tasks.md` / `4p12s-implementation-execution.md`。  
> - 规格真相源：`requirements-register.md` / `prd.md` / `user-stories.md`（`requirements.md` 仅为索引）。

## Phase A - Harness 骨架 ✅

- [x] TASK-A001: 创建项目目录结构
  - 测试文件：无
  - 验收：目录结构符合设计文档

- [x] TASK-A002: 创建 AGENTS.md 开发规范
  - 测试文件：无
  - 验收：包含技术栈、流程、规范

- [x] TASK-A003: 创建技能文件
  - 测试文件：无
  - 验收：5 个技能文件完整

- [x] TASK-A004: 配置 package.json 和 NPM Scripts
  - 测试文件：无
  - 验收：test/lint/typecheck/doctor 脚本可用

- [x] TASK-A005: 创建需求规格文档
  - 测试文件：无
  - 验收：requirements.md 包含用户故事和验收标准

- [x] TASK-A006: 创建设计文档
  - 测试文件：无
  - 验收：design.md 包含架构图、API 设计、时区策略

## Phase B - 领域与数据层

### B1: 领域层

- [x] TASK-B101: 创建 User 实体
  - 文件：`packages/domain/src/entities/user.ts`
  - 测试：`packages/domain/src/entities/user.test.ts`
  - 验收：
    - 邮箱格式验证
    - 密码长度验证（最少 6 位）
    - 创建成功返回 User 对象

- [x] TASK-B102: 创建 Task 实体
  - 文件：`packages/domain/src/entities/task.ts`
  - 测试：`packages/domain/src/entities/task.test.ts`
  - 验收：
    - 标题必填
    - 状态转换逻辑（todo → in_progress → done）
    - 创建成功返回 Task 对象

- [ ] TASK-B103: 创建 AttendanceRecord 实体
  - 文件：`packages/domain/entities/attendance-record.ts`
  - 测试：`packages/domain/entities/attendance-record.test.ts`
  - 验收：
    - 打卡时间必填
    - 工作日期必填
    - 工时计算逻辑

### B2: 数据层

- [x] TASK-B201: 配置 Drizzle ORM 和 PostgreSQL
  - 文件：`packages/infrastructure/src/db/schema.ts`
  - 测试：`packages/infrastructure/src/db/schema.test.ts`
  - 验收：
    - Schema 定义完整
    - 类型导出正确
    - 索引设计合理

- [x] TASK-B202: 创建数据库迁移
  - 文件：`packages/infrastructure/drizzle/`（`drizzle-kit push:pg` 已推送到 Supabase）
  - 测试：手动验证迁移可执行
  - 验收：
    - 迁移文件生成成功
    - 迁移可重复执行

- [x] TASK-B203: 创建 UserRepository
  - 文件：`packages/infrastructure/src/repositories/user.repository.ts`
  - 测试：`packages/infrastructure/src/repositories/user.repository.integration.test.ts`
  - 验收：
    - CRUD 操作完整
    - 按邮箱查询
    - 事务支持

- [x] TASK-B204: 创建 TaskRepository
  - 文件：`packages/infrastructure/src/repositories/task.repository.ts`
  - 测试：`packages/infrastructure/src/repositories/task.repository.integration.test.ts`
  - 验收：
    - CRUD 操作完整
    - 按用户 ID 查询
    - 按状态筛选

- [x] TASK-B205: 创建 AttendanceRepository
  - 文件：`packages/infrastructure/src/repositories/attendance.repository.ts`
  - 测试：`packages/infrastructure/src/repositories/attendance.repository.integration.test.ts`
  - 验收：
    - CRUD 操作完整
    - 日期范围查询
    - 按日聚合统计

- [x] TASK-B206: 创建种子数据
  - 文件：`packages/infrastructure/src/db/seed.ts`
  - 测试：手动验证数据插入（`npm run db:seed` 成功）
  - 验收：
    - 测试用户创建
    - 测试任务创建
    - 测试打卡记录创建

## Phase C - API 层

### C1: 基础设置

- [ ] TASK-C101: 配置 Fastify 服务器
  - 文件：`apps/api/src/index.ts`
  - 测试：`apps/api/src/index.test.ts`
  - 验收：
    - 服务器启动成功
    - Health check 端点可用
    - 错误处理配置

- [ ] TASK-C102: 配置 CORS 和日志
  - 文件：`apps/api/src/plugins/cors.ts`, `apps/api/src/plugins/logger.ts`
  - 测试：`apps/api/src/plugins/cors.test.ts`
  - 验收：
    - CORS 配置正确
    - 请求日志记录

### C2: 认证 API

- [x] TASK-C201: 登录 API
  - 文件：`apps/api/src/routes/auth.ts`
  - 测试：`apps/api/src/routes/auth.test.ts`
  - 验收：
    - 邮箱/密码验证
    - 登录成功返回 token
    - 登录失败返回错误

- [x] TASK-C202: 登出 API
  - 文件：`apps/api/src/routes/auth.ts`
  - 测试：`apps/api/src/routes/auth.test.ts`
  - 验收：
    - 清除会话
    - 返回成功响应

### C3: 任务 API

- [x] TASK-C301: 创建任务 API
  - 文件：`apps/api/src/routes/tasks.ts`
  - 测试：`apps/api/src/routes/tasks.test.ts`
  - 验收：
    - 标题必填校验
    - 创建成功返回 201
    - 数据持久化

- [x] TASK-C302: 获取任务列表 API
  - 文件：`apps/api/src/routes/tasks.ts`
  - 测试：`apps/api/src/routes/tasks.test.ts`
  - 验收：
    - 返回用户任务列表
    - 按创建时间倒序

- [x] TASK-C303: 更新任务 API
  - 文件：`apps/api/src/routes/tasks.ts`
  - 测试：`apps/api/src/routes/tasks.test.ts`
  - 验收：
    - 状态更新
    - 信息更新
    - 返回更新后数据

- [x] TASK-C304: 删除任务 API
  - 文件：`apps/api/src/routes/tasks.ts`
  - 测试：`apps/api/src/routes/tasks.test.ts`
  - 验收：
    - 删除成功返回 204
    - 数据确实删除

### C4: 打卡 API

- [x] TASK-C401: 获取打卡记录 API
  - 文件：`apps/api/src/routes/attendance.ts`
  - 测试：`apps/api/src/routes/attendance.test.ts`
  - 验收：
    - 日期范围查询
    - 时区转换正确

- [x] TASK-C402: 打卡统计 API
  - 文件：`apps/api/src/routes/attendance.ts`
  - 测试：`apps/api/src/routes/attendance.test.ts`
  - 验收：
    - 按日聚合
    - 总工时计算

## Phase D - 页面层

### D1: 基础设置

- [ ] TASK-D101: 配置 Vite 和 React
  - 文件：`apps/web/vite.config.ts`
  - 测试：`apps/web/vite.config.test.ts`
  - 验收：
    - Vite 配置正确
    - React 插件配置
    - Vitest 配置

- [x] TASK-D102: 配置 React Router
  - 文件：`apps/web/src/App.tsx`
  - 测试：`apps/web/src/App.test.tsx`
  - 验收：
    - 路由配置正确
    - 页面切换正常

### D2: 登录页面

- [x] TASK-D201: LoginForm 组件
  - 文件：`apps/web/src/components/LoginForm.tsx`
  - 测试：`apps/web/src/components/LoginForm.test.tsx`
  - 验收：
    - 邮箱必填校验
    - 密码必填校验
    - 邮箱格式校验
    - 密码长度校验
    - 提交按钮禁用状态

- [x] TASK-D202: LoginPage 页面
  - 文件：`apps/web/src/pages/LoginPage.tsx`
  - 测试：`apps/web/src/pages/LoginPage.test.tsx`
  - 验收：
    - 表单展示
    - 错误提示显示
    - 登录成功跳转

### D3: 任务页面

- [x] TASK-D301: TaskForm 组件
  - 文件：`apps/web/src/components/TaskForm.tsx`
  - 测试：`apps/web/src/components/TaskForm.test.tsx`
  - 验收：
    - 标题必填校验
    - 日期选择
    - 提交禁用状态

- [x] TASK-D302: TaskList 组件
  - 文件：`apps/web/src/components/TaskList.tsx`
  - 测试：`apps/web/src/components/TaskList.test.tsx`
  - 验收：
    - 任务列表展示
    - 状态显示
    - 删除确认

- [x] TASK-D303: TasksPage 页面
  - 文件：`apps/web/src/pages/TasksPage.tsx`
  - 测试：`apps/web/src/pages/TasksPage.test.tsx`
  - 验收：
    - 创建任务
    - 列表展示
    - 状态更新
    - 删除任务

### D4: 打卡页面

- [x] TASK-D401: AttendanceList 组件
  - 文件：`apps/web/src/components/AttendanceList.tsx`
  - 测试：`apps/web/src/components/AttendanceList.test.tsx`
  - 验收：
    - 打卡记录展示
    - 时区转换显示（Asia/Tokyo）
    - 日期格式化

- [x] TASK-D402: AttendancePage 页面
  - 文件：`apps/web/src/pages/AttendancePage.tsx`
  - 测试：`apps/web/src/pages/AttendancePage.test.tsx`
  - 验收：
    - 列表展示
    - 日期范围选择
    - 统计信息显示

### D5: 统计页面

- [ ] TASK-D501: DashboardPage 页面
  - 文件：`apps/web/src/pages/DashboardPage.tsx`
  - 测试：`apps/web/src/pages/DashboardPage.test.tsx`
  - 验收：
    - 任务统计
    - 打卡统计
    - 图表展示（可选）

## Phase E - 回归与文档

- [ ] TASK-E001: 运行全量测试
  - 验收：所有测试通过
  - 命令：`npm run test`

- [ ] TASK-E002: 运行 React Doctor
  - 验收：无错误，警告可接受
  - 命令：`npm run doctor`

- [ ] TASK-E003: 运行类型检查
  - 验收：无类型错误
  - 命令：`npm run typecheck`

- [ ] TASK-E004: 运行 ESLint
  - 验收：无错误
  - 命令：`npm run lint`

- [ ] TASK-E005: 更新 README
  - 文件：`README.md`
  - 验收：安装、测试、运行说明完整

- [ ] TASK-E006: Harness 有效性复盘
  - 文件：`designdoc/specs/retrospective.md`
  - 验收：
    - 哪些 rule/skill 最有效
    - 改进建议
    - 经验教训

## 任务状态汇总

| Phase | 总任务数 | 完成数 | 完成率 |
|-------|---------|--------|--------|
| Phase A | 6 | 6 | 100% |
| Phase B | 11 | 0 | 0% |
| Phase C | 10 | 0 | 0% |
| Phase D | 11 | 0 | 0% |
| Phase E | 6 | 0 | 0% |
| **总计** | **44** | **6** | **14%** |

## 测试覆盖要求

- 领域层：100%（纯业务逻辑）
- 数据层：90%+（Repository 操作）
- API 层：85%+（成功路径 + 错误路径）
- 页面层：80%+（主要交互 + 校验）

## 优先级说明

- **高优先级**: Phase B → Phase C → Phase D（核心功能）
- **中优先级**: Phase E（文档和复盘）
- **低优先级**: 高级功能（图表、E2E 测试等）
