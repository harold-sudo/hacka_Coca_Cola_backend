import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginRequestDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}

export class StaffLoginRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El código público del evento es obligatorio' })
  eventCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'El PIN de 6 dígitos es obligatorio' })
  pin!: string;
}
