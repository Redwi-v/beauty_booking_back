import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [SalonController],
  providers: [SalonService, DbService],
})
export class SalonModule {}
