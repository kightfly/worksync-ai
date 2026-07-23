export { Task, TaskDomainError, type TaskProps, type TaskStatus } from './task.js'
export { formatTokyoIso, workDateFromCheckInUtc, diffMinutes } from './datetime.js'

/** Scaffold smoke export for TASK-S001 */
export const PING = 'gienharness-domain' as const
