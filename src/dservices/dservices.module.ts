import { Module } from '@nestjs/common';
import { DservicesService } from './dservices.service';
import { DservicesController } from './dservices.controller';

@Module({
  controllers: [DservicesController],
  providers: [DservicesService],
})
export class DservicesModule {}
