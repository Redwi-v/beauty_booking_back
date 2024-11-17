import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMasterDto {
  @ApiProperty({
    example: '123124123',
  })
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  salonBranchId: string;

  @ApiProperty({
    example: 'Главный мастер',
  })
  @IsNotEmpty()
  speciality: string;

  @ApiProperty()
  @IsNotEmpty()
  about: string;

  @ApiProperty({
    format: 'binary',
    type: 'string',
    required: false,
  })
  avatar: File;

  @ApiProperty({
    example: false,
  })
  canChangeSchedule: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Andrey',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Kai',
  })
  lastName: string;

  @ApiProperty({
    example: false,
  })
  canChangeBookingTime: string;
}

export class UpdateMasterDto extends PartialType(CreateMasterDto) {}

export class GetAllMastersDto {
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

  @ApiProperty({
    required: false,
  })
  salonBranchId?: string;
}

export class removeItemsDto {
  @ApiProperty({
    required: true,
  })
  idArray: number[];
}
