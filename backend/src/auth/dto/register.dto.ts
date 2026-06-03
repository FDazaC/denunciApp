import {IsEmail,IsNotEmpty,MinLength,} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
            example: 'Eusebio'
    })
    @IsNotEmpty()
    nombre!: string;
    
    @ApiProperty({
        example: 'user@denunciapp.cl'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '12345678-9'
    })
    @IsNotEmpty()
    rut!: string;

    @ApiProperty({
        example: '123456'
    })
    @MinLength(6)
    password!: string;
}