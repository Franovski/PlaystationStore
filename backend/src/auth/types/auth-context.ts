import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRole } from '../../users/userEntity';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

export type AppRequest = Omit<Request, 'user'> & {
  user?: AuthenticatedUser;
};

export type AuthenticatedRequest = Omit<Request, 'user'> & {
  user: AuthenticatedUser;
};

export interface GraphqlContext {
  req: AppRequest;
  res: Response;
}

export interface GraphqlContextInput {
  req: Request;
  res: Response;
}

export function getAuthenticatedUser(
  context: GraphqlContext,
): AuthenticatedUser {
  if (!context.req.user) {
    throw new UnauthorizedException('Authentication required');
  }

  return context.req.user;
}
