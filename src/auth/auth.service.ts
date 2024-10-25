import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpBodyDto, SignUpClientAccountDto } from './dto/dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private db: DbService,
  ) {}

  async signUpServiceOwner(data: SignUpBodyDto) {
    const { email, password, lastName, name } = data;

    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new BadRequestException({ type: 'email-existes' });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newUser = await this.userService.createSalonOwnerAccount({
      ownerData: { lastName, name },
      userData: { email, hash, salt },
    });

    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.owner.email,
    });

    return { accessToken };
  }

  async signUpServiceClientAccount(data: SignUpClientAccountDto) {
    const { phoneNumber, password, lastName, name, email } = data;

    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException({ type: 'email-existes' });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newUser = await this.db.user.create({
      data: {
        email: email,
        hash: hash,
        salt: salt,
        role: 'CLIENT',
        clientAccount: {
          create: {
            lastName,
            name,
            phoneNumber,
          },
        },
      },
    });

    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      phone: newUser,
    });

    return { accessToken };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) throw new UnauthorizedException();

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
