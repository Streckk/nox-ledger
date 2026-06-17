import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(80, { message: 'El nombre es demasiado largo' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @Field()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
