import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { ADMIN_ROLES, User } from '@prisma/client';
import * as moment from 'moment';
import { SignUpAdminDto, SignUpClientDto, SignUpMasterDto } from './dto/dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private db: DbService,
  ) {}

  async signUpAdmin(data: SignUpAdminDto) {
    const { password, lastName, name, phoneNumber } = data;

    const user = await this.db.adminAccount.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (user) {
      throw new BadRequestException({
        message: ['phone is Exit'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const gift = await this.db.subscriptionType.findFirst({
      where: {
        isStartingSubscription: true,
      },
    });

    if (!gift)
      throw new BadRequestException({
        message: ['Нет подарочной подписки'],
        error: 'Bad Request',
        statusCode: 400,
      });

    const newAdmin = await this.db.user.create({
      data: {
        hash,
        salt,
        lastName,
        name,
        adminAccount: {
          create: {
            phoneNumber,
            role: ADMIN_ROLES.ADMIN,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: moment().add({ minutes: 30 }).toDate(),
            subscription: {
              connect: gift,
            },
          },
        },
      },
      include: {
        adminAccount: true,
      },
    });

    const accessToken = await this.getToken(
      newAdmin,
      newAdmin.adminAccount?.phoneNumber!,
      password,
    );

    return accessToken;
  }

  async signUpClient(data: SignUpClientDto) {
    const { password, lastName, name, phoneNumber } = data;

    const user = await this.db.clientAccount.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (user) {
      throw new BadRequestException({
        message: ['phone is Exit'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newClient = await this.db.user.create({
      data: {
        hash,
        salt,
        lastName,
        name,
        clientAccount: {
          create: {
            phoneNumber,
          },
        },
      },
      include: {
        clientAccount: true,
      },
    });

    const { accessToken } = await this.getToken(
      newClient,
      newClient.clientAccount?.phoneNumber!,
      password,
    );

    return { accessToken };
  }

  // async signUpMaster(data: SignUpMasterDto) {
  //   const { telegramId } = data;

  //   const user = await this.db.masterAccount.findUnique({
  //     where: {
  //       telegramId,
  //     },
  //   });

  //   if (user) {
  //     throw new BadRequestException({
  //       message: ['user is Exit'],
  //       error: 'Bad Request',
  //       statusCode: 400,
  //     });
  //   }

  //   const newClient = await this.db.masterAccount.create({
  //     data: {

  //     },

  //   });

  //   const { accessToken } = await this.getToken(
  //     newClient,
  //     newClient.clientAccount?.phoneNumber!,
  //     password,
  //   );

  //   return { accessToken };
  // }

  async signInAdmin(phoneNumber: string, password: string) {
    const admin = await this.db.adminAccount.findUnique({
      where: {
        phoneNumber,
      },
      include: {
        user: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException();
    }

    const tokenRes = await this.getToken(
      admin.user,
      admin.phoneNumber,
      password,
    );

    return tokenRes;
  }

  async signInClient(phoneNumber: string, password: string) {
    const user = await this.db.clientAccount.findUnique({
      where: {
        phoneNumber,
      },
      include: {
        user: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokenRes = await this.getToken(
      user.user,
      user.phoneNumber,
      password,
    );

    return tokenRes;
  }

  private async getToken(user: User, phoneNumber: string, password: string) {
    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) throw new UnauthorizedException();

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      phoneNumber: phoneNumber,
      name: user.name,
      lastName: user.lastName,
    });

    return { accessToken };
  }
}
