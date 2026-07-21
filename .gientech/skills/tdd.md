# TDD (Test-Driven Development) 技能

## 核心理念

**测试驱动开发**是一种软件开发方法，要求：
1. **先写测试**（在功能实现之前）
2. **只写足够的代码使测试通过**
3. **重构优化**（保持测试通过）

## TDD 循环（Red-Green-Refactor）

### 1. Red - 写一个失败的测试
```
- 理解需求
- 编写测试用例
- 运行测试，确认失败
```

### 2. Green - 使测试通过
```
- 编写最简单的实现
- 不做过度设计
- 运行测试，确认通过
```

### 3. Refactor - 重构优化
```
- 改进代码结构
- 消除重复
- 保持测试通过
```

## 测试类型

### 单元测试 (Unit Test)
- 测试最小可测试单元（函数、类、模块）
- 隔离外部依赖（使用 Mock/Stub）
- 快速执行（毫秒级）
- **本项目重点**

### 集成测试 (Integration Test)
- 测试模块间协作
- 使用真实依赖（数据库、API）
- 执行较慢
- 选择性编写

### 端到端测试 (E2E Test)
- 测试完整用户流程（Playwright）
- 前端真实调后端、后端真实落库时，**Mock 全链路退出**
- 执行慢、维护成本高于单测
- **交付门禁必过**：可薄（主流程冒烟），但不可缺（见 4p12s ⑩ 与 `4p12s-e2e-test.md`）

## 测试优先级

```
        成本低
          ↑
          |   单元测试 (70%)     — 日常 TDD 主力
          |   集成测试 (20%)     — 真实依赖，禁 Mock 节点见验证计划
          |   E2E 测试 (10%)     — 交付前必过，非「可选项」
          |
        覆盖广
```

> **假完成**：只跑单测、或 E2E 全 Mock，不得宣称 4p12s 交付完成。

## 本项目的 TDD 实践

### 领域层 TDD

```typescript
// 1. 先写测试
// packages/domain/user.test.ts
import { describe, it, expect } from 'vitest';
import { User } from './user';

describe('User', () => {
  it('创建用户时邮箱格式必须有效', () => {
    expect(() => User.create({ email: 'invalid', password: 'pass123' }))
      .toThrow('邮箱格式无效');
  });

  it('创建用户时密码长度至少 6 位', () => {
    expect(() => User.create({ email: 'test@example.com', password: '12345' }))
      .toThrow('密码长度至少 6 位');
  });

  it('成功创建用户', () => {
    const user = User.create({ email: 'test@example.com', password: 'pass123' });
    expect(user.email).toBe('test@example.com');
    expect(user.id).toBeDefined();
  });
});

// 2. 运行测试，确认失败
// npm run test -- user.test.ts

// 3. 实现功能
// packages/domain/user.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
  ) {}

  static create(input: { email: string; password: string }): User {
    if (!isValidEmail(input.email)) {
      throw new Error('邮箱格式无效');
    }
    if (input.password.length < 6) {
      throw new Error('密码长度至少 6 位');
    }
    return new User(generateId(), input.email, hashPassword(input.password));
  }
}

// 4. 运行测试，确认通过
// 5. 重构优化（如有需要）
```

### API 层 TDD

```typescript
// 1. 先写测试
// apps/api/routes/tasks.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { buildServer } from '../test-utils';

describe('POST /api/tasks', () => {
  let server: Awaited<ReturnType<typeof buildServer>>;

  beforeEach(async () => {
    server = await buildServer();
  });

  it('创建任务成功', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: '测试任务', dueDate: '2025-01-15' },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.title).toBe('测试任务');
  });

  it('标题为必填项', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });
});

// 2-5. 重复 Red-Green-Refactor 循环
```

### 前端组件 TDD

```typescript
// 1. 先写测试
// apps/web/components/LoginForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('显示必填校验错误', async () => {
    render(<LoginForm onSubmit={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/邮箱为必填项/i)).toBeInTheDocument();
    expect(await screen.findByText(/密码为必填项/i)).toBeInTheDocument();
  });

  it('邮箱格式校验错误', async () => {
    render(<LoginForm onSubmit={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/邮箱/i), {
      target: { value: 'invalid' },
    });
    fireEvent.change(screen.getByLabelText(/密码/i), {
      target: { value: 'pass123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /登录/i }));
    
    expect(await screen.findByText(/邮箱格式无效/i)).toBeInTheDocument();
  });

  it('提交成功调用 onSubmit', async () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/邮箱/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/密码/i), {
      target: { value: 'pass123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /登录/i }));
    
    await vi.waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'pass123',
      });
    });
  });
});

// 2-5. 重复 Red-Green-Refactor 循环
```

## 测试最佳实践

### 1. 测试命名
```typescript
// ❌ 不好的命名
it('test1', () => {});
it('should work', () => {});

// ✅ 好的命名
it('邮箱格式无效时抛出错误', () => {});
it('用户创建成功返回用户对象', () => {});
it('提交表单时必填项为空显示错误提示', () => {});
```

### 2. AAA 模式
```typescript
it('计算订单总价', () => {
  // Arrange - 准备数据
  const order = new Order();
  order.addItem({ price: 100, quantity: 2 });
  order.addItem({ price: 50, quantity: 3 });

  // Act - 执行操作
  const total = order.calculateTotal();

  // Assert - 断言结果
  expect(total).toBe(350);
});
```

### 3. 测试隔离
```typescript
// ❌ 测试间有依赖
let user: User;
beforeEach(() => {
  user = User.create({...}); // 前一个测试影响后一个
});

// ✅ 每个测试独立
it('测试场景 A', () => {
  const user = User.create({...});
  // ...
});

it('测试场景 B', () => {
  const user = User.create({...});
  // ...
});
```

### 4. 测试边界条件
```typescript
describe('密码校验', () => {
  it('密码长度为 5 时报错', () => {
    expect(() => User.create({ email: 'test@example.com', password: '12345' }))
      .toThrow();
  });

  it('密码长度为 6 时通过', () => {
    expect(() => User.create({ email: 'test@example.com', password: '123456' }))
      .not.toThrow();
  });

  it('密码长度为 100 时通过', () => {
    expect(() => User.create({ email: 'test@example.com', password: 'a'.repeat(100) }))
      .not.toThrow();
  });
});
```

### 5. Mock 外部依赖
```typescript
// Mock 数据库
vi.mock('../infrastructure/database', () => ({
  db: {
    insert: vi.fn().mockResolvedValue({ id: '123' }),
    select: vi.fn().mockResolvedValue([]),
  },
}));

// Mock API 调用
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ data: [] }),
});
```

## 测试覆盖率

### 覆盖率目标
- 语句覆盖率：80%+
- 分支覆盖率：80%+
- 函数覆盖率：80%+
- 行覆盖率：80%+

### 覆盖率报告
```bash
# 生成覆盖率报告
npm run test -- --coverage

# 查看 HTML 报告
open coverage/index.html
```

### 覆盖率不是银弹
- 100% 覆盖率 ≠ 没有 bug
- 关注重要业务逻辑的覆盖
- 不要为了覆盖率写无意义的测试

## 常见陷阱

### 1. 测试过度 Mock
```typescript
// ❌ Mock 了太多
vi.mock('./user', () => ({
  User: {
    create: vi.fn(),
    validate: vi.fn(),
    // ... 所有方法都 mock 了
  },
}));

// ✅ 只 Mock 外部依赖
vi.mock('./database', () => ({
  db: { /* ... */ },
}));
// User 类使用真实实现
```

### 2. 测试过于复杂
```typescript
// ❌ 测试逻辑比业务逻辑复杂
it('复杂场景', () => {
  const data = setupComplexData();
  const config = createComplexConfig();
  const mock1 = createComplexMock();
  const mock2 = createComplexMock();
  // ... 100 行测试代码
});

// ✅ 测试简单明了
it('用户创建成功', () => {
  const user = User.create({ email: 'test@example.com', password: 'pass123' });
  expect(user.email).toBe('test@example.com');
});
```

### 3. 测试依赖执行顺序
```typescript
// ❌ 依赖执行顺序
it('第一步', () => { /* ... */ });
it('第二步', () => { /* 依赖第一步的结果 */ });

// ✅ 每个测试独立
it('完整流程', () => {
  // 在一个测试中完成所有步骤
});
```

## 调试测试

### 运行单个测试
```bash
# 运行指定文件
npm run test -- user.test.ts

# 运行匹配名称的测试
npm run test -- -t "邮箱格式"

# 监视模式
npm run test:watch
```

### 调试技巧
```typescript
it('调试测试', () => {
  console.log('调试信息:', value);
  expect(value).toBe(expected);
});
```

## 持续集成

### CI 配置检查清单
- [ ] 安装依赖
- [ ] 类型检查
- [ ] 运行测试
- [ ] 生成覆盖率报告
- [ ] 运行 React Doctor
- [ ] 运行 ESLint

### GitHub Actions 示例
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run doctor
      - run: npm run lint
```
