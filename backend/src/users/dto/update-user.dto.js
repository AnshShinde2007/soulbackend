import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '../schemas/users.schema.js';

/**
 * DTO for updating an existing user.
 * All fields are optional.
 * Password updates must be handled via a dedicated endpoint.
 */
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name;

    @IsOptional()
    @IsEmail()
    email;

    @IsOptional()
    @IsString()
    mobile;

    @IsOptional()
    @IsEnum(Role, {
        message: 'Role must be either practitioner or patient',
    })
    role;
}
