import { Module } from '@nestjs/common';
import { SalonBranchService } from './salon-branch.service';
import { SalonBranchController } from './salon-branch.controller';
import { DbService } from 'src/db/db.service';

@Module({
  
  controllers: [SalonBranchController],
  providers: [SalonBranchService, DbService],
  
})
export class SalonBranchModule {}
