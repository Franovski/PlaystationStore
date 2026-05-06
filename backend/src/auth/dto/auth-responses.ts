import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/userEntity';

@ObjectType()
export class LoginResponse {
  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  requiresTwoFactor?: boolean;

  @Field({ nullable: true })
  tempToken?: string;

  @Field({ nullable: true })
  otpMethod?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
