import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({ default: 'Hello1234' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Иван' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Иванович' })
  lastName: string;

  @IsNotEmpty()
  @ApiProperty({ default: '+79212994200' })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  messageKey: string;
}

export class SinUpAdminDto extends SignUpUserDto {}
export class SinUpClientDto extends SignUpUserDto {}
export class SinUpMasterDto extends SignUpUserDto {}

export class SignInDto {
  @ApiProperty({ default: 'Hello1234' })
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({ default: '+79212994200' })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  messageKey: string;
}

export class GetSessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  exp: number;
}

export class ISendAuthKeyDto {
  @IsNotEmpty()
  @ApiProperty()
  key: string;
}
