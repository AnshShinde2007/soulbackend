import {
    Injectable,
    ConflictException,
    NotFoundException,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schemas/users.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) userModel,
    ) {
        this.userModel = userModel;
        this.logger = new Logger(UsersService.name);
    }

    /**
     * Public signup (practitioner or patient)
     */
    async create(createUserDto) {
        if (!createUserDto || typeof createUserDto !== 'object') {
            throw new BadRequestException('Request body is required');
        }

        if (!createUserDto.email) {
            throw new BadRequestException('Email is required');
        }

        this.logger.log(`Register user attempt: ${createUserDto.email}`);
        const existingUser = await this.userModel.findOne({
            email: createUserDto.email,
        });

        if (existingUser) {
            this.logger.warn(
              `Registration blocked (email exists): ${createUserDto.email}`,
            );
            throw new ConflictException('Email already registered');
        }

        const user = new this.userModel(createUserDto);
        const savedUser = await user.save();

        this.logger.log(`User created successfully: userId=${savedUser._id}`);
        return savedUser;
    }

    /**
     * Get user by ID
     */
    async findOneById(userId) {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            this.logger.warn(`User not found: userId=${userId}`);
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * Self-update profile
     */
    async update(userId, updateUserDto) {
        this.logger.log(`Update user attempt: userId=${userId}`);
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            this.logger.warn(`Update failed (not found): userId=${userId}`);
            throw new NotFoundException('User not found');
        }

        Object.assign(user, updateUserDto);
        const updatedUser = await user.save();

        this.logger.log(`User updated successfully: userId=${userId}`);
        return updatedUser;
    }

    /**
     * Used by AuthService (login)
     * Password must be selected explicitly
     */
    async findOneByEmailWithPassword(email) {
        this.logger.debug(`Fetch user with password for login: ${email}`);
        return this.userModel
            .findOne({ email })
            .select('+password')
            .exec();
    }
}
