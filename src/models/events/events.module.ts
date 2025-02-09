import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, DbService],
})
export class EventsModule {}
