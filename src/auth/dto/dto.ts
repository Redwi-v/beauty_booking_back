import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SignUpBodyDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Andrey',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Sinitsyn',
  })
  @IsNotEmpty()
  lastName: string;
}
export class SignUpMasterDto extends SignUpBodyDto {
  @ApiProperty({
    example: 'Manicur',
  })
  @IsNotEmpty()
  speciality: string;

  telegramId?: string;
}
export class SignUpClientAccountDto extends SignUpBodyDto {
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}


export class SignInBodyDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1234',
  })
  @IsNotEmpty()
  password: string;
}

export class GetSessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  exp: number;
}
