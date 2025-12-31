import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'user_profiles' })
export class UserProfile {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId;

  @Prop({ type: String, required: true })
  fullName;

  @Prop({ type: Date })
  dob;

  @Prop({ type: String })
  gender;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
