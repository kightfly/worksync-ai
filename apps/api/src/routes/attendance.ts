import type { FastifyPluginAsync } from 'fastify';
import { toAttendanceRecordResponse, toAttendanceStatisticsResponse } from '../lib/attendance-mapper.js';
import type { AuthenticateHook } from '../plugins/authenticate.js';
import { attendanceQuerySchema } from '../schemas/attendance.schema.js';
import type { AttendanceService } from '../services/attendance.service.js';

export interface AttendanceRouteOptions {
  attendanceService: AttendanceService;
  authenticate: AuthenticateHook;
}

const attendanceRoutes: FastifyPluginAsync<AttendanceRouteOptions> = async (
  app,
  opts,
) => {
  app.get(
    '/api/attendance',
    { preHandler: [opts.authenticate] },
    async (request, reply) => {
      const parsed = attendanceQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: parsed.error.errors[0]?.message ?? '入力内容が正しくありません',
        });
      }

      const records = await opts.attendanceService.listAttendance(
        request.user.userId,
        parsed.data.startDate,
        parsed.data.endDate,
      );

      return reply.send({
        records: records.map(toAttendanceRecordResponse),
      });
    },
  );

  app.get(
    '/api/attendance/statistics',
    { preHandler: [opts.authenticate] },
    async (request, reply) => {
      const parsed = attendanceQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: parsed.error.errors[0]?.message ?? '入力内容が正しくありません',
        });
      }

      const statistics = await opts.attendanceService.getStatistics(
        request.user.userId,
        parsed.data.startDate,
        parsed.data.endDate,
      );

      return reply.send(toAttendanceStatisticsResponse(statistics));
    },
  );
};

export default attendanceRoutes;
