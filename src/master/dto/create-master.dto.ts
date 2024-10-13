import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';

export enum weekDays {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export class CreateMasterDto {
  @ApiProperty({
    example: 'masterLastName',
  })
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: 'Anna',
  })
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'manicur',
  })
  @MinLength(2)
  @IsNotEmpty()
  speciality: string;

  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  salonBranchId: number;

  @ApiProperty({
    example: true,
  })
  canChangeSchedule?: boolean;

  @ApiProperty({
    example: [1, 2, 3],
  })
  servicesIdArray: number[];

  @ApiProperty({
    example: '12314512',
  })
  telegramId: string;

  @ApiProperty({
    example: 'about hello',
  })
  about: string;

  //---property
  @IsNotEmpty()
  @ApiProperty({})
  startShift: Date;
  //---

  //---property
  @IsNotEmpty()
  @ApiProperty({})
  endShift: Date;
  //---

  //---property
  @IsNotEmpty()
  @ApiProperty({
    example: [weekDays[0], weekDays[1], weekDays[2], weekDays[3], weekDays[4]],
  })
  workingDays: weekDays[] | weekDays;
  //---
}

export class GetMastersParams {
  @ApiProperty({})
  salonId: number;

  @ApiProperty({
    required: false,
  })
  search?: string;

  @ApiProperty({
    required: false,
    example: new Date(),
  })
  time?: Date;

  @ApiProperty({
    required: false,
    example: new Date(),
  })
  date?: Date;

  @ApiProperty({
    required: false,
    example: ['1', '2'],
  })
  servicesIdList?: string[] | string;
}

export class GetFreeTimeDto {
  @ApiProperty({
    example: new Date(),
  })
  date: Date;

  @ApiProperty({
    example: 1,
    required: false,
  })
  masterId?: number;

  @ApiProperty({
    example: ['1', '2'],
    required: false,
  })
  servicesIdList?: string[];
}

export class GetBookingByDate {
  @ApiProperty({
    example: new Date(),
  })
  date: Date;

  @ApiProperty({
    example: 1,
  })
  masterId: number;
}
