import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

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
    example: '12314512',
  })
  telegramId: string;
}

export class addServiceDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  masterId: number;

  @ApiProperty({
    example: 'Массаж',
  })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 1200,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 30,
  })
  @IsNotEmpty()
  time: number;
}

export class UpdateServiceDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({
    example: 'Массаж',
  })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 1200,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 30,
  })
  @IsNotEmpty()
  time: number;
}
