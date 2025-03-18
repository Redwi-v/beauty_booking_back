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

export class SignUpAdminDto extends SignUpUserDto {}
export class SignUpClientDto extends SignUpUserDto {}
export class SignUpMasterDto extends SignUpUserDto {}
// export class SignUpMasterDto {

//   @ApiProperty({
//     example: 1,
//   })
//   salonBranchId: number

//   @ApiProperty()
//   masterServicesId: number[]

//   @ApiProperty()
//   speciality: string
//   @ApiProperty()
//   about: string

//   @ApiProperty()
//   name: st

//   @ApiProperty()
//   lastName String

//   @ApiProperty()
//   avatar String?

//   @ApiProperty()
//   canChangeSchedule Boolean? @default(false)

//   @ApiProperty()
//   canChangeBookingTime Boolean? @default(false)

//   @ApiProperty()
//   telegramId String    @unique()

//   @ApiProperty()
//   Booking    Booking[]


//   @ApiProperty()
//   workingsDays WorkingDay[]


//   @ApiProperty()
//   salonBranch SalonBranch? @relation(fields: [salonBranchId], references: [id])
// }

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
