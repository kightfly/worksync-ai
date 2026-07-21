# TASK-B205: AttendanceRepository

## 元信息

- 标题：AttendanceRepository（只读路径 + 统计）
- 状态：done
- 依赖：B201/B202
- 对应：US-020/021、V-020/V-021

## 实现

- `findByUserIdAndDate` / `findByUserIdAndDateRange`
- `create` / `update` / `delete`（seed / 测试用）
- `getStatistics`：按 `work_date` 日次工时聚合 + `totalHours`

## 证据

```bash
npm run test -w @ai-harness/infrastructure
# attendance.repository.integration.test.ts 1 passed
```
