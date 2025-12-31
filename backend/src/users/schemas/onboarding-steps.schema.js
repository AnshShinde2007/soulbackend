import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'onboarding_steps' })
export class OnboardingStep {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId;

  @Prop({ type: String, required: true })
  step;

  @Prop({ type: Boolean, default: false })
  completed;
}

export const OnboardingStepSchema = SchemaFactory.createForClass(OnboardingStep);
