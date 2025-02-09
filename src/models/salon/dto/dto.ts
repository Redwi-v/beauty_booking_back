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
  @ApiProperty({
    required: false,
  })
  onlyActiveBranches: string
}

export class DeleteSalonDto {
  @ApiProperty()
  @IsNotEmpty()
  salonsId: number[];
}
