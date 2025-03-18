import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSalonDto {
  @ApiProperty({ example: 'TestSalon' })
  name: string;

  @ApiProperty({ example: false })
  isOpen: string;

  @ApiProperty({ example: false })
  description: string;

  @ApiProperty({
    format: 'binary',
    type: 'string',
  })
  image: File;
}

export class UpdateSalonDto extends PartialType(CreateSalonDto) {
  @ApiProperty()
  @IsNotEmpty()
  salonId: number;
}
