import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * @description
 * Custom decorator to attach required roles to a route handler or controller.
 *
 * @example
 * @Roles(Role.PRACTITIONER)
 * @Roles(Role.PRACTITIONER, Role.PATIENT)
 */
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
