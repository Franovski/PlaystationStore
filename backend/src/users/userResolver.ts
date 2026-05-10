import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UsersService } from './userService';
import { User } from './userEntity';
import { CreateUserDto, UpdateUserDto, UpdateUserSettingsDto } from './userDto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from './userEntity';

type GqlRequestContext = {
  req: {
    user: {
      userId: string;
      role: UserRole;
    };
  };
};

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [User])
  async adminUsers() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
    return this.userService.create(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => User)
  async updateUserSettings(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserSettingsInput')
    updateUserSettingsInput: UpdateUserSettingsDto,
    @Context() context: GqlRequestContext,
  ) {
    return this.userService.updateUserSettings(
      id,
      updateUserSettingsInput,
      context.req.user.userId,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => ID }) id: string) {
    await this.userService.remove(id);
    return true;
  }
}
