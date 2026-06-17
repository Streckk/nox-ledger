import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { MaxBase64Size } from '../../../common/validators/max-base64-size.validator';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

/** Campos editables del perfil del usuario. Todos opcionales. */
@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'El correo no es válido' })
  email?: string;

  /** Imagen del usuario en base64 (o data URL base64). Máximo 4MB. */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxBase64Size(MAX_IMAGE_BYTES)
  image?: string;
}
