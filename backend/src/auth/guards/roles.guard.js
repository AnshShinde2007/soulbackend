import { Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard {
    constructor(@Inject(Reflector) reflector) {
        this.reflector = reflector;
    }

    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // No roles required -> allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If user or role is missing -> deny access
        if (!user || !user.role) {
            return false;
        }

        // Single-role check (practitioner / patient)
        return requiredRoles.includes(user.role);
    }
}
