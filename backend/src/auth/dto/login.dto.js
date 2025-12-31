import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email = undefined;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    password = undefined;
}
