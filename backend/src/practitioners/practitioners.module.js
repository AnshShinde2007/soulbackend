import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PractitionersService } from './practitioners.service';
import { PractitionersController } from './practitioners.controller';
import { Practitioner, PractitionerSchema } from './schemas/practitioners.schema';
import { PractitionerAvailability, PractitionerAvailabilitySchema } from './schemas/practitioner-availibility.schema';
import { Payout, PayoutSchema } from './schemas/payouts.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Practitioner.name, schema: PractitionerSchema },
      { name: PractitionerAvailability.name, schema: PractitionerAvailabilitySchema },
      { name: Payout.name, schema: PayoutSchema },
    ]),
  ],
  providers: [PractitionersService],
  controllers: [PractitionersController]
})
export class PractitionersModule {}
