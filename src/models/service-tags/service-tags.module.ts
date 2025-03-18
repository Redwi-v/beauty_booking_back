import { Module } from '@nestjs/common';
import { ServiceTagsService } from './service-tags.service';
import { ServiceTagsController } from './service-tags.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [ServiceTagsController],
  providers: [ServiceTagsService, DbService],
})
export class ServiceTagsModule {}
