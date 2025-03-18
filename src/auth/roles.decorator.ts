import { SetMetadata } from '@nestjs/common';
import { TokenNamesEnum } from './cookie.service';

export const ROLES_KEY = 'ROLES';
export const DECORATOR_TOKEN_KEY = 'TOKENS';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const TokensDecorator = (...keys: TokenNamesEnum[]) =>
  SetMetadata(DECORATOR_TOKEN_KEY, keys);
