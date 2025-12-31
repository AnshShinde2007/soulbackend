import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({
    type: Types.ObjectId,
    ref: 'sessions',
    required: true,
    unique: true,
    index: true,
  })
  sessionId;

  @Prop({
    type: Number,
    min: 1,
    max: 5,
    required: true,
  })
  rating;

  @Prop({
    type: String,
  })
  comment;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
