import { PartialType } from '@nestjs/swagger';
import { CreateSalonBranchDto } from './create-salon-branch.dto';

export class UpdateSalonBranchDto extends PartialType(CreateSalonBranchDto) {}
