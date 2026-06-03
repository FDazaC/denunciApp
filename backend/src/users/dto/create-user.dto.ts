import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^\d{7,8}-[0-9Kk]$/, { message: 'RUT inválido. Ej: 12345678-9' })
  @IsNotEmpty()
  rut: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty()
  password: string;
}