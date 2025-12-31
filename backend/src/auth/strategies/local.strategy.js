import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AuthService) authService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });

        this.authService = authService;
    }

    /**
     * Validates user credentials for local authentication.
     * Called automatically by Passport when LocalAuthGuard is used.
     */
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
