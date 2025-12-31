import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { CmsArticle, CmsArticleSchema } from './schemas/cms-articles.schema';
import { CmsCourse, CmsCourseSchema } from './schemas/cms-courses.schema';
import { CmsLesson, CmsLessonSchema } from './schemas/cms-lessons.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CmsArticle.name, schema: CmsArticleSchema },
      { name: CmsCourse.name, schema: CmsCourseSchema },
      { name: CmsLesson.name, schema: CmsLessonSchema },
    ]),
  ],
  providers: [CmsService],
  controllers: [CmsController]
})
export class CmsModule {}
