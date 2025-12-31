import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context) {
        const handler = context.getHandler();
        const controller = context.getClass();

        // Read metadata directly (JS-safe)
        const isPublic =
          Reflect.getMetadata(IS_PUBLIC_KEY, handler) ??
          Reflect.getMetadata(IS_PUBLIC_KEY, controller);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err ?? new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}
