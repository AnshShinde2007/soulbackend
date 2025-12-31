import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'cms_courses' })
export class CmsCourse {
  @Prop({
    type: String,
    required: true,
  })
  title;

  @Prop({
    type: String,
  })
  description;
}

export const CmsCourseSchema = SchemaFactory.createForClass(CmsCourse);
