import { PartialType } from '@nestjs/swagger';
import { CreateDserviceDto } from './create-dservice.dto';

export class UpdateDserviceDto extends PartialType(CreateDserviceDto) {}
