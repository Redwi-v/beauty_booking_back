import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, DbService],
})
export class SubscriptionModule {}
