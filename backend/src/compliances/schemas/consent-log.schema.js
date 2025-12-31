import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'consent_log' })
export class ConsentLog {
  @Prop({
    type: Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  })
  userId;

  @Prop({
    type: String,
    required: true,
  })
  consentType;

  @Prop({
    type: Date,
    required: true,
  })
  acceptedAt;
}

export const ConsentLogSchema = SchemaFactory.createForClass(ConsentLog);
