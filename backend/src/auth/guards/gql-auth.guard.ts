import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AppRequest, GraphqlContext } from '../types/auth-context';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): AppRequest {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphqlContext>();

    return gqlContext.req;
  }
}
