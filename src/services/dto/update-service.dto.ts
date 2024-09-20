import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
