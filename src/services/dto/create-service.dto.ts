import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, Min, MinLength } from 'class-validator';
export class CreateServiceDto {
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: 'service1' })
  tagName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 500 })
  price: number;

  @IsNotEmpty()
  @ApiProperty({ example: 30 })
  time: number;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  salonId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 'name' })
  name: string;
}

export class FindAllServiceDto {
  @ApiProperty({
    required: false,
  })
  tagName?: string;

  @ApiProperty({
    required: false,
  })
  search?: string;

  @ApiProperty({
    required: false,
  })
  masterId?: number;
}
