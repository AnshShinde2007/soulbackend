import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsEnum,
} from 'class-validator';
import { Role } from '../schemas/users.schema.js';

/**
 * DTO for creating an user.
 */
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name= undefined;

    @IsEmail()
    @IsNotEmpty()
    email= undefined;

    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    password= undefined;

    @IsString()
    @IsNotEmpty()
    mobile= undefined;

    @IsEnum(Role, {
        message: 'Role must be either practitioner or patient',
    })
    role= undefined;
}
