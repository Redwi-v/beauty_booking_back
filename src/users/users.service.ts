import { BadRequestException, Injectable, Body } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  createSalonOwnerDto,
  createUserDto,
  RegisterUser,
  UpdateUser,
} from './dto/dto';
import { Role } from './role.enum';
import { PasswordService } from 'src/auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private passwordService: PasswordService,
  ) {}

  findByEmail(email: string) {
    return this.db.user.findFirst({ where: { email } });
  }

  createSalonOwnerAccount(data: {
    userData: createUserDto;
    ownerData: createSalonOwnerDto;
    role?: Role;
  }) {
    const { ownerData, userData, role } = data;

    return this.db.salonOwnerAccount.create({
      data: {
        owner: {
          create: {
            ...userData,
            role,
          },
        },
        ...ownerData,
      },
      include: {
        owner: true,
      },
    });
  }

  getAdminProfile(id: number) {
    return this.db.salonOwnerAccount.findUnique({
      where: { id: id },
      include: {
        owner: true,
      },
    });
  }

  async registerUser(data: RegisterUser) {
    const { email, password, lastName, name, role } = data;

    const user = await this.findByEmail(email);

    if (user) {
      throw new BadRequestException({ type: 'email-existes' });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newUser = await this.createSalonOwnerAccount({
      ownerData: { lastName, name },
      userData: { email, hash, salt },
      role: Role[role],
    });

    return newUser;
  }

  async getUsers(activeUserId: number) {
    const res = await this.db.user.findMany({
      select: {
        hash: false,
        salt: false,
        SalonOwnerAccount: true,
        email: true,
        id: true,
        role: true,
      },
      where: {
        id: {
          not: { equals: activeUserId },
        },
      },
    });

    return { list: res };
  }

  async UpdateUser(id: number, body: UpdateUser) {
    const { email, lastName, name, role } = body;
    return this.db.user.update({
      where: { id },

      data: {
        email,
        role,
        SalonOwnerAccount: {
          update: {
            lastName,
            name,
          },
        },
      },
    });
  }

  async DeleteUser(id: number) {
    return this.db.user.delete({
      where: { id },
    });
  }
}
