import 'reflect-metadata';
import morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { swaggerAdminMiddleware } from './auth/middlewares/swagger-admin.middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(morgan('dev')); // REMOVE IN PRODUCTION

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger configuration
  //app.use('/api/docs', swaggerAdminMiddleware);
  app.use('/api/docs-json', swaggerAdminMiddleware);
  const config = new DocumentBuilder()
    .setTitle('Soul Yatri Backend API')
    .setDescription('API documentation for Soul Yatri Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

  console.log(`Application running at: ${await app.getUrl()}`);
  console.log(`Swagger available at: http://localhost:3000/api/docs`);
}

bootstrap();
