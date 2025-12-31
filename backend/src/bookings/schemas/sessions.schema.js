import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'sessions' })
export class Session {
  @Prop({
    type: Types.ObjectId,
    ref: 'bookings',
    required: true,
    index: true,
  })
  bookingId;

  @Prop({
    type: Date,
    required: true,
  })
  startTime;

  @Prop({
    type: Date,
    required: true,
  })
  endTime;

  @Prop({
    type: String,
    enum: ['scheduled', 'completed', 'missed'],
    default: 'scheduled',
    index: true,
  })
  status;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
