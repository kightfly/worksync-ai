import type { FastifyInstance } from 'fastify'
import { diffMinutes, formatTokyoIso } from '@gienharness/domain'
import type { AttendanceRepository } from '@gienharness/infrastructure'
import { requireUserId, sendApiError } from '../auth/plugin.js'

export function registerAttendanceRoutes(app: FastifyInstance, attendance: AttendanceRepository) {
  app.get('/api/attendance', async (request, reply) => {
    try {
      const userId = requireUserId(request)
      const query = request.query as { startDate?: string; endDate?: string }
      const rows = await attendance.listByUser(userId, query.startDate, query.endDate)
      return reply.send({
        items: rows.map((r) => ({
          id: r.id,
          checkInTime: formatTokyoIso(r.checkInTime),
          checkOutTime: r.checkOutTime ? formatTokyoIso(r.checkOutTime) : null,
          workDate: r.workDate,
        })),
      })
    } catch (err) {
      return sendApiError(reply, err)
    }
  })

  app.get('/api/attendance/statistics', async (request, reply) => {
    try {
      const userId = requireUserId(request)
      const query = request.query as { startDate?: string; endDate?: string }
      const rows = await attendance.listByUser(userId, query.startDate, query.endDate)
      const byDate = new Map<string, { totalMinutes: number; checkInCount: number }>()
      for (const r of rows) {
        if (!r.checkOutTime) continue
        const minutes = diffMinutes(r.checkInTime, r.checkOutTime)
        const cur = byDate.get(r.workDate) ?? { totalMinutes: 0, checkInCount: 0 }
        cur.totalMinutes += minutes
        cur.checkInCount += 1
        byDate.set(r.workDate, cur)
      }
      const items = [...byDate.entries()]
        .sort(([a], [b]) => (a < b ? 1 : -1))
        .map(([workDate, v]) => ({ workDate, ...v }))
      return reply.send({ items })
    } catch (err) {
      return sendApiError(reply, err)
    }
  })
}
