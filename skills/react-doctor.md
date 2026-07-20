# React Doctor 技能

## 什么是 React Doctor

React Doctor 是一个 React 代码质量检查工具，用于确保：
1. React 最佳实践的遵循
2. 性能优化建议
3. 常见错误的检测和修复
4. 代码可维护性提升

## 安装和配置

### 安装
```bash
npx react-doctor@latest install --yes
```

### 运行
```bash
# 检查整个项目
npm run doctor

# 检查指定目录
npx react-doctor check apps/web/src

# 修复可自动修复的问题
npx react-doctor fix apps/web/src
```

## 检查规则

### 1. Hooks 使用规则

#### Rules of Hooks
```typescript
// ❌ 错误：条件调用 Hook
function MyComponent({ show }) {
  if (show) {
    const [state, setState] = useState(false);
  }
}

// ✅ 正确：顶层调用 Hook
function MyComponent({ show }) {
  const [state, setState] = useState(false);
}
```

#### Hook 依赖
```typescript
// ❌ 错误：缺少依赖
function MyComponent({ userId }) {
  useEffect(() => {
    fetchUser(userId);
  }, []); // userId 变化时不会重新执行
}

// ✅ 正确：完整依赖
function MyComponent({ userId }) {
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
}

// ✅ 使用 eslint-disable 明确忽略
function MyComponent({ userId }) {
  useEffect(() => {
    fetchUser(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 明确只执行一次
}
```

### 2. 组件命名规范

```typescript
// ❌ 错误：小写开头
function myComponent() {
  return <div />;
}

// ✅ 正确：大写开头
function MyComponent() {
  return <div />;
}

// ✅ 导出命名
export default function MyComponent() {
  return <div />;
}
```

### 3. JSX 规范

#### key 属性
```typescript
// ❌ 错误：缺少 key
function MyList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ 正确：使用唯一 key
function MyList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ❌ 错误：使用索引作为 key（列表可变时）
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// ✅ 正确：使用稳定唯一标识
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

#### 自闭合标签
```typescript
// ❌ 错误：未自闭合
function MyComponent() {
  return <img src="image.jpg"></img>;
}

// ✅ 正确：自闭合
function MyComponent() {
  return <img src="image.jpg" />;
}
```

### 4. Props 和 State

#### Props 不可变
```typescript
// ❌ 错误：修改 props
function MyComponent({ user }) {
  user.name = 'New Name'; // 不允许
  return <div>{user.name}</div>;
}

// ✅ 正确：使用 state
function MyComponent({ user }) {
  const [name, setName] = useState(user.name);
  return <div>{name}</div>;
}
```

#### State 更新
```typescript
// ❌ 错误：直接修改 state
function MyComponent() {
  const [items, setItems] = useState([]);
  
  const addItem = (item) => {
    items.push(item); // 直接修改
    setItems(items);
  };
}

// ✅ 正确：不可变更新
function MyComponent() {
  const [items, setItems] = useState([]);
  
  const addItem = (item) => {
    setItems([...items, item]); // 创建新数组
  };
}
```

### 5. 性能优化

#### 避免不必要的重渲染
```typescript
// ❌ 错误：每次渲染创建新对象
function MyComponent() {
  return <Child props={{ style: { color: 'red' } }} />;
}

// ✅ 正确：使用 useMemo
function MyComponent() {
  const style = useMemo(() => ({ color: 'red' }), []);
  return <Child props={{ style }} />;
}
```

#### 使用 React.memo
```typescript
// 纯组件，props 不变时不重渲染
const MyComponent = React.memo(function MyComponent({ value }) {
  return <div>{value}</div>;
});
```

#### 使用 useCallback
```typescript
// ❌ 错误：每次渲染创建新函数
function Parent() {
  const handleClick = () => {
    console.log('clicked');
  };
  return <Child onClick={handleClick} />;
}

// ✅ 正确：使用 useCallback
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <Child onClick={handleClick} />;
}
```

### 6. 错误处理

#### Error Boundary
```typescript
// ✅ 推荐：错误边界组件
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### 7. 类型安全 (TypeScript)

#### Props 类型定义
```typescript
// ✅ 使用 interface 或 type
interface MyComponentProps {
  title: string;
  count?: number;
  onClick: () => void;
}

function MyComponent({ title, count = 0, onClick }: MyComponentProps) {
  return (
    <div onClick={onClick}>
      {title}: {count}
    </div>
  );
}
```

#### 事件类型
```typescript
// ✅ 明确事件类型
function MyComponent() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
}
```

### 8. 表单处理

#### 受控组件
```typescript
// ✅ 推荐：受控组件
function Form() {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

#### react-hook-form 集成
```typescript
// ✅ 使用 react-hook-form
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('邮箱格式无效'),
  password: z.string().min(6, '密码长度至少 6 位'),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">登录</button>
    </form>
  );
}
```

## CI/CD 集成

### GitHub Actions
```yaml
name: React Doctor
on: [push, pull_request]
jobs:
  doctor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run doctor
```

### Pre-commit Hook
```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "precommit": "npm run doctor"
  }
}
```

## 常见问题修复

### 1. useEffect 依赖问题
```typescript
// 问题：缺少依赖
useEffect(() => {
  fetchData(userId);
}, []);

// 修复 1：添加依赖
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 修复 2：使用函数更新
useEffect(() => {
  const controller = new AbortController();
  fetchData(userId, { signal: controller.signal });
  return () => controller.abort();
}, [userId]);
```

### 2. 数组索引作为 key
```typescript
// 问题：使用索引作为 key
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// 修复：使用唯一 ID
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// 如果确实没有唯一 ID，且列表不变
{items.map((item, index) => (
  // eslint-disable-next-line react/no-array-index-key
  <div key={index}>{item.name}</div>
))}
```

### 3. 直接修改 state
```typescript
// 问题：直接修改
state.items.push(newItem);
setState(state);

// 修复：不可变更新
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));
```

## 检查清单

在提交代码前，确认：

### 代码质量
- [ ] 无 TypeScript 类型错误
- [ ] 无 ESLint 错误
- [ ] 通过 React Doctor 检查
- [ ] 代码已格式化（Prettier）

### Hooks
- [ ] Hooks 在顶层调用
- [ ] useEffect 依赖完整
- [ ] 自定义 Hooks 命名正确（useXxx）

### 组件
- [ ] 组件名大写开头
- [ ] key 属性使用正确
- [ ] Props 类型定义完整

### 性能
- [ ] 避免不必要的重渲染
- [ ] 使用 React.memo / useMemo / useCallback 适当
- [ ] 列表渲染使用稳定 key

### 测试
- [ ] 组件测试通过
- [ ] 覆盖主要交互场景
- [ ] 覆盖错误场景

## 输出示例

```bash
$ npm run doctor

React Doctor Results
====================

✓ No critical issues found

Warnings:
- src/components/UserList.tsx:15:7
  Warning: Array index used as key
  Consider using a unique identifier instead
  
- src/pages/Dashboard.tsx:42:12
  Warning: Missing useEffect dependency: userId
  Add userId to dependency array or disable lint rule

Suggestions:
- Consider using React.memo for pure components
- Consider using useCallback for stable function references

Total: 0 errors, 2 warnings, 2 suggestions
```
