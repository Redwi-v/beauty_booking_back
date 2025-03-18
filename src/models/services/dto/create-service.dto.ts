import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: [1, 2],
  })
  masterAccountsId: number[];

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  serviceTagId: number;

  @ApiProperty({
    example: 'Ногти',
  })
  name: string;

  @ApiProperty({
    example: 1000,
  })
  price: number;

  @ApiProperty({
    example: 60,
  })
  duration: number;
}

export class FindManyServicesDto {
  @ApiProperty({
    example: 0,
    required: false,
  })
  skip: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  take: number;

  @ApiProperty({
    example: '',
    required: false,
  })
  search: string;

  @ApiProperty({
    example: 0,
  })
  salonId: number;

  @ApiProperty({
    required: false,
  })
  tagId: number;

  @ApiProperty({
    required: false,
  })
  masterId: number;
}
