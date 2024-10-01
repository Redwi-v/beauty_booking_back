import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, DbService],
})
export class BookingModule {}
