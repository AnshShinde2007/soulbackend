import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'invoices' })
export class Invoice {
  @Prop({
    type: Types.ObjectId,
    ref: 'payments',
    required: true,
    unique: true,
    index: true,
  })
  paymentId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  invoiceNumber;

  @Prop({
    type: Date,
    required: true,
  })
  issuedAt;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
