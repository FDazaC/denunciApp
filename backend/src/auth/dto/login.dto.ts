import {IsEmail,MinLength,} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'user@denunciapp.cl'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '123456'
    })
    @MinLength(6)
    password!: string;
}