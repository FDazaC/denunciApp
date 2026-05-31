import {IsNotEmpty,IsOptional,IsString,MaxLength,} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PublicacionDto {

    @ApiProperty({
        example: 'Luminaria dañada',
        description: 'Título del reporte',
        maxLength: 150,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    titulo!: string;

    @ApiProperty({
        example: 'La luminaria ubicada en el patio central no funciona desde hace varios días.',
        description: 'Descripción detallada del problema',
    })
    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @ApiProperty({
        example: 'https://proyecto-ejemplo.supabase.co/storage/v1/object/public/denuncias-imagenes/foto.jpg',
        description: 'URL pública de la imagen almacenada en Supabase',
        required: false,
    })
    @IsOptional()
    @IsString()
    imagenUrl?: string;
}