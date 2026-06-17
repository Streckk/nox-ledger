import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

/**
 * Input opcional para refresh/logout.
 * El cliente web NO lo usa (el token va en la cookie httpOnly);
 * el cliente móvil envía aquí su refresh token.
 */
@InputType()
export class RefreshInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
