import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { SignUpBodyDto } from 'src/auth/dto/dto';

export class createUserDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  hash: string;

  @IsNotEmpty()
  salt: string;
}

export class createMasterDto {
  @IsNotEmpty()
  @MinLength(2)
  speciality: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  telegramId?: string;
}

export class createSalonOwnerDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;
}

export class RegisterUser extends SignUpBodyDto {
  @ApiProperty({
    example: Role.ADMIN,
  })
  role: Role;
}

export class UpdateUser extends PartialType(RegisterUser) {}
