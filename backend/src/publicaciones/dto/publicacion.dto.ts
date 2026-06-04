import {IsNotEmpty,IsOptional,IsString,IsNumber,MaxLength} from 'class-validator';
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


    @ApiProperty({
        example: -33.4489,
        description: 'Latitud del problema',
    })
    @IsNumber()
    latitud!: number;

    @ApiProperty({
        example: -70.6693,
        description: 'Longitud del problema',
    })
    @IsNumber()
    longitud!: number;
}