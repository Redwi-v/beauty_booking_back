import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceTagDto {
  @ApiProperty({
    example: 1,
  })
  salonId: number;

  @ApiProperty({
    example: 'TagName',
  })
  name: string;
}

export class FindAllServiceTagDto {
  @ApiProperty({
    example: 0,
  })
  skip: number;

  @ApiProperty({
    example: 10,
  })
  take: number;

  @ApiProperty({
    example: '',
  })
  search: string;

  @ApiProperty({
    example: 10,
  })
  salonId: number;

  @ApiProperty({
    example: false,
  })
  takeServices: boolean;
}
