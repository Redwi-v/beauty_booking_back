import { Injectable } from '@nestjs/common';
import { Response } from 'express'

export enum TokenNamesEnum {
  adminToken = 'ADMIN_TOKEN',
  clientToken = 'CLIENT_TOKEN',
  masterToken = 'MASTER_TOKEN',
}
@Injectable()
export class CookieService {
  setToken(res: Response, token: string, tokenKey: TokenNamesEnum) {
    res.cookie(tokenKey, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 10,
      sameSite: 'none',
      secure: true,
    });
  }

  removeToken(res: Response, tokenKey: TokenNamesEnum) {
    res.clearCookie(tokenKey);
  }
}





