import { Module } from '@nestjs/common';
import { MasterScheduleService } from './master.schedule.service';
import { MasterScheduleController } from './master.schedule.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [MasterScheduleController],
  providers: [MasterScheduleService, DbService],
})
export class MasterScheduleModule {}
