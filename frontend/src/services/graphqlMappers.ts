import { Platform, User } from '../types';

type AnyRecord = Record<string, any>;

export const toGraphqlRole = (role?: string | null) => {
  if (role === 'admin') return 'ADMIN';
  if (role === 'playstation_user') return 'PLAYSTATION_USER';
  return role;
};

export const fromGraphqlRole = (role?: string | null): User['role'] => {
  if (role === 'ADMIN') return 'admin';
  if (role === 'PLAYSTATION_USER') return 'playstation_user';
  return (role as User['role']) ?? 'playstation_user';
};

export const toGraphqlPlatformName = (platformName?: string | null) => {
  if (platformName === 'ps4') return 'PS4';
  if (platformName === 'ps5') return 'PS5';
  return platformName;
};

export const fromGraphqlPlatformName = (
  platformName?: string | null,
): Platform['platformName'] => {
  if (platformName === 'PS4') return 'ps4';
  if (platformName === 'PS5') return 'ps5';
  return (platformName as Platform['platformName']) ?? 'ps5';
};

export const normalizeUser = (user?: AnyRecord | null): User | null => {
  if (!user) return null;

  return {
    ...user,
    role: fromGraphqlRole(user.role),
  } as User;
};

export const normalizeUsers = (users?: AnyRecord[] | null): User[] =>
  (users ?? []).map((user) => normalizeUser(user)).filter(Boolean) as User[];

export const withGraphqlRole = <T extends AnyRecord>(data: T): T => ({
  ...data,
  role: toGraphqlRole(data.role),
});

export const normalizePlatform = (
  platform?: AnyRecord | null,
): Platform | null => {
  if (!platform) return null;

  return {
    ...platform,
    platformName: fromGraphqlPlatformName(platform.platformName),
  } as Platform;
};

export const normalizePlatforms = (
  platforms?: AnyRecord[] | null,
): Platform[] =>
  (platforms ?? [])
    .map((platform) => normalizePlatform(platform))
    .filter(Boolean) as Platform[];

export const withGraphqlPlatformName = <T extends AnyRecord>(data: T): T => ({
  ...data,
  platformName: toGraphqlPlatformName(data.platformName),
});
