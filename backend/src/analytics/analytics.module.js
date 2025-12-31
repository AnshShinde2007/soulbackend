import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AnalyticsEvent, AnalyticsEventSchema } from './schemas/analytics-events.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: AnalyticsEvent.name, schema: AnalyticsEventSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {}
