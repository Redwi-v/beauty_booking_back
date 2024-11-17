import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class GetAllSalonsDto {
  @ApiProperty({
    required: false,
  })
  skip: string;

  @ApiProperty({
    required: false,
  })
  take: string;

  @ApiProperty({
    required: false,
  })
  search: string;
}

export class GetByIdDto {
  @ApiProperty()
  @IsNotEmpty()
  salonId: number;
}

export class DeleteSalonDto {
  @ApiProperty()
  @IsNotEmpty()
  salonsId: number[];
}
