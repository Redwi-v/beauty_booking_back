import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: '2024.12.17 12:00',
  })
  @IsNotEmpty()
  start: string;

  @ApiProperty({
    example: 120,
  })
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  salonBranch: number;

  @ApiProperty({
    example: 'Запись клиента Наталии',
  })
  title: string;

  @ApiProperty({
    example: 'хороший клинет попросил колы',
  })
  description: string;

  @ApiProperty({
    example: 1,
  })
  masterId: number;

  @ApiProperty({
    example: [1, 2],
  })
  servicesIdArr: number[];

  @ApiProperty({
    example: '89212994200',
  })
  @IsNotEmpty()
  clientNumber: string;

  @ApiProperty({
    example: 'Настя',
  })
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    example: 'Федотова',
  })
  @IsNotEmpty()
  clientLastName: string;

  @ApiProperty({
    example: 'Федотова',
  })
  @IsNotEmpty()
  clientComment: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class findAllParams {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  salonId: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  salonBranchId: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  masterId: number;
}
