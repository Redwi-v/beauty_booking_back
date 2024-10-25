import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as moment from 'moment';
import { DbService } from 'src/db/db.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CookieService } from 'src/auth/cookie.service';
import { GetSessionInfoDto } from 'src/auth/dto/dto';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private db: DbService,
    private JwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { id: salonId } = request.params;

    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies[CookieService.tokenKey];

    let sessionInfo: GetSessionInfoDto | null = null;

    if (token) {
      sessionInfo = (await this.JwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })) as GetSessionInfoDto;
    }

    const salon = await this.db.salon.findUnique({
      where: {
        salonId: +salonId,
      },
      include: {
        SalonOwnerAccount: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!salon) throw new BadRequestException('Салон не найден');

    if (sessionInfo && salon.salonOwnerAccountId === sessionInfo.id)
      return true;

    if (
      !salon.SalonOwnerAccount?.subscription ||
      !salon.SalonOwnerAccount?.subscriptionEndDate ||
      moment(salon.SalonOwnerAccount?.subscriptionEndDate).isBefore(moment())
    )
      throw new ForbiddenException('У салона закончилась подписка');

    return true;
  }
}
