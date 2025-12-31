import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({
    type: Types.ObjectId,
    ref: 'bookings',
    required: true,
    unique: true,
    index: true,
  })
  bookingId;

  @Prop({
    type: Number,
    required: true,
  })
  amount;

  @Prop({
    type: String,
    required: true,
  })
  gateway;

  @Prop({
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
    index: true,
  })
  status;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
