import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payout {
  @Prop({
    type: Types.ObjectId,
    ref: 'Practitioner',
    required: true,
    index: true,
  })
  practitionerId;

  @Prop({
    type: Number,
    required: true,
  })
  amount;

  @Prop({
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  })
  status;
}

export const PayoutSchema = SchemaFactory.createForClass(Payout);
