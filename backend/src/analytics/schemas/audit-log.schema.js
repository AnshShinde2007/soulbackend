import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'audit_log' })
export class AuditLog {
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
  action;

  @Prop({
    type: Object,
    default: {},
  })
  metadata;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
