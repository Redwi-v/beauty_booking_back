import { BadRequestException, Injectable, Body } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { createSalonOwnerDto, createUserDto } from './dto/dto';
import { Role } from './role.enum';
import { PasswordService } from 'src/auth/password.service';
import { ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private passwordService: PasswordService,
  ) {}

  async getAdminProfile(id: number) {
    const user = await this.db.adminAccount.findUnique({
      where: { userId: id },
      include: {
        subscription: true,
        user: true
      },
    });
    console.log(user);
    return user;
  }

  async getClientProfile(id: number) {
    const user = await this.db.clientAccount.findUnique({
      where: {
        userId: id,
      },
    });
    return user;
  }

  async DeleteUser(id: number) {
    return this.db.user.delete({
      where: { id },
    });
  }
}
