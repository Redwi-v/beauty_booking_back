import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
