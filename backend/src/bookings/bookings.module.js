import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './schemas/bookings.schema';
import { Session, SessionSchema } from './schemas/sessions.schema';
import { Review, ReviewSchema } from './schemas/reviews.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
