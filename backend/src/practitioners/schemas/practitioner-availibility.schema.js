import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'practitioner_availability' })
export class PractitionerAvailability {
  @Prop({
    type: Types.ObjectId,
    ref: 'Practitioner',
    required: true,
    index: true,
  })
  practitionerId;

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
    type: Boolean,
    default: true,
  })
  isAvailable;
}

export const PractitionerAvailabilitySchema = SchemaFactory.createForClass(PractitionerAvailability);
