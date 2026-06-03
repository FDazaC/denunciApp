import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateEstadoDto {
    @ApiProperty({
        example: 'en_revision',
        enum: ['pendiente', 'en_revision', 'resuelto'],
    })
    @IsString()
    estado!: string;
}