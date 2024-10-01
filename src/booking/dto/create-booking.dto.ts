import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBookingDto {
  //--Field
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  masterId: number;
  //-----

  //--Field
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  salonBranchId: number;
  //-----

  //--Field
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  salonId: number;
  //-----

  //--Field
  @ApiProperty({
    example: 'hello',
  })
  clientComment: string;
  //-----

  //--Field
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({
    example: '+79212994212',
  })
  clientPhone: string;
  //-----

  //--Field
  @IsNotEmpty()
  @ApiProperty({
    example: 'Andrey',
  })
  clientName: string;
  //-----

  //--Field
  @IsNotEmpty()
  @ApiProperty({
    example: '9412498123',
  })
  clientTelegramId: string;
  //-----

  //--Field
  @IsNotEmpty()
  @ApiProperty({
    example: [1, 2, 3],
  })
  servicesIdArray: number[];
  //-----

  //--Field
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: new Date(),
  })
  time: Date;
  //-----
}
