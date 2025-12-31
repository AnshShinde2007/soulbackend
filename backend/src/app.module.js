import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { UserThrottlerGuard } from './common/guards/user-throttler.guard.js';
import Redis from 'ioredis';
import { PractitionersModule } from './practitioners/practitioners.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { CmsModule } from './cms/cms.module';
import { CompliancesModule } from './compliances/compliances.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config) => {
        const redis = new Redis({
          host: config.get('REDIS_HOST'),
          port: Number(config.get('REDIS_PORT')),
          maxRetriesPerRequest: null,
        });

        const ttl = seconds(
          Number(config.get('THROTTLE_TTL')),
        );

        return {
          storage: new ThrottlerStorageRedisService(redis),
          throttlers: [
            {
              name: 'auth',
              ttl,
              limit: Number(config.get('AUTH_RATE_LIMIT')),
              blockDuration: seconds(Number(config.get('BLOCK_RATE_LIMIT'))),
            },
            {
              name: 'public',
              ttl,
              limit: Number(config.get('PUBLIC_RATE_LIMIT')),
              blockDuration: seconds(Number(config.get('BLOCK_RATE_LIMIT'))),
            },
            {
              name: 'user',
              ttl,
              limit: Number(config.get('USER_RATE_LIMIT')),
              blockDuration: seconds(Number(config.get('BLOCK_RATE_LIMIT'))),
            },
            {
              name: 'heavy',
              ttl,
              limit: Number(config.get('HEAVY_RATE_LIMIT')),
              blockDuration: seconds(Number(config.get('BLOCK_RATE_LIMIT'))),
            },
            {
              name: 'admin',
              ttl,
              limit: Number(config.get('ADMIN_RATE_LIMIT')),
              blockDuration: seconds(Number(config.get('BLOCK_RATE_LIMIT'))),
            },
          ],
          errorMessage:'Too Many Requests, Please Try again after few minutes.',
        };
      },
    }),
  MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        uri: configService.get('MONGODB_URI'),
        // FIX: Retry connecting if MongoDB isn't ready yet (Docker Race Condition)
        retryAttempts: 20,
        retryDelay: 5000,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PractitionersModule,
    BookingsModule,
    PaymentsModule,
    CmsModule,
    CompliancesModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard ,
    },
    AppService],
})
export class AppModule {}
