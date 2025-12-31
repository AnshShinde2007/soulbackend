import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'cms_lessons' })
export class CmsLesson {
  @Prop({
    type: Types.ObjectId,
    ref: 'cms_courses',
    required: true,
    index: true,
  })
  courseId;

  @Prop({
    type: String,
    required: true,
  })
  title;

  @Prop({
    type: String,
    required: true,
  })
  content;
}

export const CmsLessonSchema = SchemaFactory.createForClass(CmsLesson);
