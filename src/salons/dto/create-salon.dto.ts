import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateSalonDto {
  @ApiProperty({
    example: 'BeautySalon',
  })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 0,
  })
  isOpen?: 0 | 1;

  description: string;
}
