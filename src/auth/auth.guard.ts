import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenNamesEnum } from './cookie.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { DECORATOR_TOKEN_KEY } from './roles.decorator';
import { appTypesEnum } from 'src/main';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;

    const appType = req.headers.apptype as appTypesEnum;

    if (!appType) throw new UnauthorizedException('appType не указан');

    let token: null | string = null;

    let availableTokensKeys = this.reflector.getAllAndOverride(
      DECORATOR_TOKEN_KEY,
      [context.getHandler, context.getClass],
    ) as TokenNamesEnum[] | undefined;

    if (!availableTokensKeys)
      availableTokensKeys = Object.values(TokenNamesEnum);

    if (
      appType === appTypesEnum.ADMIN &&
      availableTokensKeys.includes(TokenNamesEnum.adminToken)
    ) {
      token = req.cookies[TokenNamesEnum.adminToken];
    }

    if (
      appType === appTypesEnum.MASTER &&
      availableTokensKeys.includes(TokenNamesEnum.masterToken)
    ) {
      token = req.cookies[TokenNamesEnum.masterToken];
    }

    if (
      appType === appTypesEnum.CLIENT &&
      availableTokensKeys.includes(TokenNamesEnum.clientToken)
    ) {
      token = req.cookies[TokenNamesEnum.clientToken];
    }

    if (!token)
      throw new UnauthorizedException(
        'Пользователь не авторизован или у него нет доступа к этому ресурсу',
      );

    try {
      const sessionInfo = this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      req['session'] = sessionInfo;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}


