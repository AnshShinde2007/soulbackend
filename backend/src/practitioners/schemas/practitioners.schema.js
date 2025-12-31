import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Practitioner {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId;

  @Prop({
    type: [String],
    default: [],
  })
  specialization;

  @Prop({
    type: Number,
  })
  experienceYears;

  @Prop({
    type: Boolean,
    default: true,
  })
  verified;
}

export const PractitionerSchema = SchemaFactory.createForClass(Practitioner);
