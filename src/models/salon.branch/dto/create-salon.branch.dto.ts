import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateSalonBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  salonId: number;

  @ApiProperty({ default: 'Архангельс' })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ default: '64.542995' })
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({ default: '40.536279' })
  @IsNotEmpty()
  longitude: string;

  @ApiProperty()
  isOpen: boolean;
}

export class UpdateSalonBranchDto extends PartialType(CreateSalonBranchDto) {}

export class GetAllSalonBranchesDto {
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

  @ApiProperty({})
  salonId: number;

  
  @ApiProperty({})
  onlyActive: boolean;
}

export class DeleteBranchDto {
  @ApiProperty()
  idArray: number[];
}
