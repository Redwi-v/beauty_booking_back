import { IsNotEmpty, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Ленинградский 271',
  })
  address: string;

  @ApiProperty({
    example: 'г.Архнагельск',
  })
  @MinLength(2)
  @IsNotEmpty()
  city: string;
}

export class SalonDto {
  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  salonId: number;
}

export class CreateSalonBranchDto {
  @ApiProperty()
  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto;

  @ApiProperty()
  @Type(() => SalonDto)
  @ValidateNested()
  @IsNotEmpty()
  salon: SalonDto;
}
