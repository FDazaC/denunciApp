import { IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: 'Ignacio',
    })
    @IsOptional()
    nombre?: string;

    @ApiPropertyOptional({
        example: 'user@denunciapp.cl',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        example: '12345678-9',
    })
    @IsOptional()
    rut?: string;
}