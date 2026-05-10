import apolloClient from '../../../services/graphql';
import { normalizeUser, normalizeUsers, toGraphqlRole } from '../../../services/graphqlMappers';
import { Role, User } from '../../../types';
import { GET_ADMIN_USERS, UPDATE_USER_SETTINGS } from './settings.graphql';

export type UpdateUserSettingsPayload = {
  role?: Role;
  isEmailVerified?: boolean;
  isTotpEnabled?: boolean;
  password?: string;
  totpSecret?: string | null;
  refreshToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  passwordResetMethod?: string | null;
  passwordResetAttempts?: number;
};

const settingsInput = (payload: UpdateUserSettingsPayload) => {
  const input: Record<string, unknown> = {};

  if (payload.role !== undefined) {
    input.role = toGraphqlRole(payload.role);
  }

  if (payload.isEmailVerified !== undefined) {
    input.isEmailVerified = payload.isEmailVerified;
  }

  if (payload.isTotpEnabled !== undefined) {
    input.isTotpEnabled = payload.isTotpEnabled;
  }

  if (payload.password !== undefined) {
    input.password = payload.password;
  }

  if (payload.totpSecret !== undefined) {
    input.totpSecret = payload.totpSecret;
  }

  if (payload.refreshToken !== undefined) {
    input.refreshToken = payload.refreshToken;
  }

  if (payload.passwordResetToken !== undefined) {
    input.passwordResetToken = payload.passwordResetToken;
  }

  if (payload.passwordResetExpires !== undefined) {
    input.passwordResetExpires = payload.passwordResetExpires;
  }

  if (payload.passwordResetMethod !== undefined) {
    input.passwordResetMethod = payload.passwordResetMethod;
  }

  if (payload.passwordResetAttempts !== undefined) {
    input.passwordResetAttempts = payload.passwordResetAttempts;
  }

  return input;
};

const fetchAdminUsers = async (): Promise<User[]> => {
  const { data } = await apolloClient.query<any>({
    query: GET_ADMIN_USERS,
    fetchPolicy: 'network-only',
  });

  return normalizeUsers(data.adminUsers);
};

const updateUserSettings = async (
  userId: string,
  payload: UpdateUserSettingsPayload,
): Promise<User | null> => {
  const { data } = await apolloClient.mutate<any>({
    mutation: UPDATE_USER_SETTINGS,
    variables: {
      id: userId,
      updateUserSettingsInput: settingsInput(payload),
    },
  });

  return normalizeUser(data.updateUserSettings);
};

export const settingsApi = {
  fetchAdminUsers,
  getAdminUsers: fetchAdminUsers,
  updateUserSettings,
};
