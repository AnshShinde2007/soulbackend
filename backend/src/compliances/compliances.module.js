import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompliancesService } from './compliances.service';
import { CompliancesController } from './compliances.controller';
import { ConsentLog, ConsentLogSchema } from './schemas/consent-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConsentLog.name, schema: ConsentLogSchema },
    ]),
  ],
  providers: [CompliancesService],
  controllers: [CompliancesController]
})
export class CompliancesModule {}
