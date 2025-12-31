import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'analytics_events' })
export class AnalyticsEvent {
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
  event;

  @Prop({
    type: Object,
    default: {},
  })
  payload;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);
