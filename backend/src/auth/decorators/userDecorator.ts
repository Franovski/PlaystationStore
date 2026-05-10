import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/auth-context';

type HttpRequestWithUser = {
  user?: AuthenticatedUser;
};

export const User = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined =>
    context.switchToHttp().getRequest<HttpRequestWithUser>().user,
);
