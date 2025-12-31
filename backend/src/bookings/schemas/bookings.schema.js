import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({
    type: Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  })
  patientId;

  @Prop({
    type: Types.ObjectId,
    ref: 'practitioners',
    required: true,
    index: true,
  })
  practitionerId;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
    index: true,
  })
  status;

  @Prop({
    type: Date,
    required: true,
  })
  scheduledAt;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
