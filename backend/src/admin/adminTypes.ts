import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DashboardSummary {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalAdmins: number;

  @Field(() => Int)
  totalCustomers: number;

  @Field(() => Int)
  totalGames: number;

  @Field(() => Int)
  totalCategories: number;

  @Field(() => Int)
  totalPlatforms: number;
}
