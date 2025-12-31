import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Param,
    Patch,
    Inject,
    Logger,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { SkipThrottle} from '@nestjs/throttler';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { formatValidationErrors } from '../common/validation/validation-errors.js';
import { Public } from '../common/decorators/public.decorator';

@SkipThrottle({
    auth: true,
    public: true,
    user: true,
    heavy: true,
    admin: true,
})
@ApiTags('Users')
@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {
    constructor(@Inject(UsersService) usersService) {
        this.usersService = usersService;
        this.logger = new Logger(UsersController.name);
    }

    @Public()
    @SkipThrottle({public:false})
    @Post('register')
    @ApiOperation({ summary: 'Register a new user (practitioner or patient)' })
    @ApiBody({
        type: CreateUserDto,
        required: true,
        description: 'User registration payload',
    })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request body' })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async create(@Body() body) {
        const dto = plainToInstance(CreateUserDto, body);

        const errors = await validate(dto);

        if (errors.length > 0) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: formatValidationErrors(errors),
            });
        }

        return this.usersService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get logged-in user profile' })
    @ApiResponse({ status: 200, description: 'User profile returned' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getMe(@GetUser() user) {
        this.logger.debug(`Profile fetch: userId=${user._id}`);
        return this.usersService.findOneById(user._id.toString());
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @Roles('practitioner')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get user by ID (practitioner only)' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'User ID',
    })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 400, description: 'Invalid user ID' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@Param('id') id) {
        if (!id) {
            throw new BadRequestException('User ID is required');
        }
        this.logger.log(`Doctor accessing user: userId=${id}`);
        return this.usersService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update own user profile' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'User ID (must be your own)',
    })
    @ApiBody({
        type: UpdateUserDto,
        required: true,
        description: 'User update payload',
    })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async update(
      @Param('id') id,
      @Body() body,
      @GetUser() user,
    ) {
        if (!id) {
            throw new BadRequestException('User ID is required');
        }

        if (!body || Object.keys(body).length === 0) {
            throw new BadRequestException('Request body is required');
        }

        // Self-update check
        if (user._id.toString() !== id) {
            this.logger.warn(
              `Unauthorized update attempt: actor=${user._id}, target=${id}`,
            );
            throw new ForbiddenException('You can only update your own profile');
        }
        const dto = plainToInstance(UpdateUserDto, body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: formatValidationErrors(errors),
            });
        }

        return this.usersService.update(id, dto);
    }
}
