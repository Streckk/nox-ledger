import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../users/models/user.model';

/** Resultado de un login/registro exitoso. */
@ObjectType('AuthPayload')
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserModel)
  user: UserModel;
}
