import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'cms_articles' })
export class CmsArticle {
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

  @Prop({
    type: Boolean,
    default: true,
  })
  published;
}

export const CmsArticleSchema = SchemaFactory.createForClass(CmsArticle);
