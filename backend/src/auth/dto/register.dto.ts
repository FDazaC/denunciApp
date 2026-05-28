import {IsEmail,IsNotEmpty,MinLength,} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    nombre!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    rut!: string;

    @MinLength(6)
    password!: string;
}