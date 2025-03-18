import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [MasterController],
  providers: [MasterService, DbService],
})
export class MasterModule {}
