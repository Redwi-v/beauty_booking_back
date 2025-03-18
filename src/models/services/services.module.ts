import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, DbService],
})
export class ServicesModule {}
