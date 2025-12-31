import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
    constructor( @Inject(UsersService) usersService,
                 @Inject(JwtService) jwtService,) {
        this.usersService = usersService;
        this.jwtService = jwtService;
          this.logger = new Logger(AuthService.name);
    }

    /**
     * Used by LocalStrategy
     * Validates email + password
     */
    async validateUser(email, password) {
        this.logger.debug(`Login attempt for email=${email}`);
        const user = await this.usersService.findOneByEmailWithPassword(email);

        if (!user) {
            this.logger.warn(`Login failed (user not found): ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            this.logger.warn(`Login failed (bad password): ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`Login successful: ${email}`);
        const { password: _password, ...safeUser } = user.toObject();
        return safeUser;
    }

    /**
     * Used by AuthController
     * Issues JWT
     */
    login(user) {
        this.logger.log(`Issuing JWT for userId=${user._id}, role=${user.role}`);

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
