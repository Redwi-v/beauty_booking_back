import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceTagDto } from './create-service-tag.dto';

export class UpdateServiceTagDto extends PartialType(CreateServiceTagDto) {}
