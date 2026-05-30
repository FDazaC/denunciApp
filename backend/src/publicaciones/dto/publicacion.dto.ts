import {IsNotEmpty,IsOptional,IsString,MaxLength,} from 'class-validator';

export class PublicacionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @IsOptional()
    @IsString()
    imagenUrl?: string;
}