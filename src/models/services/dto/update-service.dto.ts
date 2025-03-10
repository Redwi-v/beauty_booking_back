import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  
  @ApiProperty({
    example: 30
  })
  duration;
}
