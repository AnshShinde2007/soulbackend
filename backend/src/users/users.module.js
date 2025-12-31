import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './schemas/users.schema.js';
import { UserProfile, UserProfileSchema } from './schemas/user-profiles.schema';
import { OnboardingStep, OnboardingStepSchema } from './schemas/onboarding-steps.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: OnboardingStep.name, schema: OnboardingStepSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
