import { Field, ID, ObjectType } from '@nestjs/graphql';

/** Modelo GraphQL del usuario. NUNCA expone `passwordHash`. */
@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
