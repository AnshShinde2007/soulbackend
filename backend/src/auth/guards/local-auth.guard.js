import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description This guard is responsible for triggering the LocalStrategy.
 * It will automatically run the logic in `local.strategies.ts` to validate
 * the user's email and password from the request body.
 *
 * It should be applied specifically to the login route.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    // You can override methods here if you need custom behavior
}
