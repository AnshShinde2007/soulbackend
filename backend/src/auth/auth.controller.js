import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    HttpStatus,
    HttpCode,
    Get,
    Inject,
    Logger,
    BadRequestException,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';

import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { UsersService } from '../users/users.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { GetUser } from './decorators/get-user.decorator.js';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../common/validation/validation-errors';
import { Public } from '../common/decorators/public.decorator';

@SkipThrottle({
    auth: true,
    public: true,
    user: true,
    heavy: true,
    admin: true,
})
@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
      @Inject(AuthService) authService,
      @Inject(UsersService) usersService,
    ) {
        this.authService = authService;
        this.usersService = usersService;
        this.logger = new Logger(AuthController.name);
    }

    /**
     * Login
     */
    @Public()
    @SkipThrottle({auth:false})
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login user and get JWT token' })
    @ApiBody({
        required: true,
        description: 'Login credentials (email + password)',
        schema: {
            example: {
                email: 'john.doe@example.com',
                password: 'password123',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Invalid request body' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Request() req, @Body() body) {
        const dto = plainToInstance(LoginDto, body);

        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: formatValidationErrors(errors),
            });
        }

        return this.authService.login(req.user);
    }

    /**
     * Logout
     */
    @UseGuards(JwtAuthGuard)
    @SkipThrottle({auth:false})
    @Post('logout')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'User logged out successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    logout(@GetUser() user) {
        this.logger.log(`Logout: ${user.email}`);
        return {
            message: 'User logged out successfully',
        };
    }

    /**
     * Get logged-in user profile
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get logged-in user profile' })
    @ApiResponse({ status: 200, description: 'User profile returned' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@GetUser() user) {
        this.logger.debug(`Profile requested: ${user.email}`);
        return user;
    }
}
