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
  @ApiProperty({
    example: 1,
  })
  clientId?: number;
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
    required: false,
  })
  clientComment?: string;
  //-----

  //--Field
  @ApiProperty({
    example: 'hello2',
    required: false,
  })
  adminComment?: string;
  //-----
  //--Field
  @ApiProperty({
    example: 'hello2',
    required: false,
  })
  masterComment?: string;
  //-----

  //--Field
  @IsNotEmpty()
  @IsPhoneNumber(undefined, {
    message: 'Неверный номер телефона',
  })
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
  @ApiProperty({
    example: '9412498123',
    required: false,
  })
  clientTelegramId?: string;
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
