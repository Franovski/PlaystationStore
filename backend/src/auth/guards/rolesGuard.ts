import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../../users/userEntity';
import { ROLES_KEY } from '../decorators/roleDecorator';
import { AppRequest, GraphqlContext } from '../types/auth-context';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = this.getRequest(context);
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }

  private getRequest(context: ExecutionContext): AppRequest {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphqlContext>();

    if (gqlContext.req) {
      return gqlContext.req;
    }

    return context.switchToHttp().getRequest<AppRequest>();
  }
}
