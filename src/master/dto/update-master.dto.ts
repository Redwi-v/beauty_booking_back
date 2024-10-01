import { IsNotEmpty, MinLength } from 'class-validator';
import { CreateMasterDto } from './create-master.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMasterDto extends PartialType(CreateMasterDto) {}
