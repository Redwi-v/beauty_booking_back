import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { DbService } from 'src/db/db.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import moment from 'moment';

@Module({
  imports: [AuthModule],
  controllers: [MasterController],
  providers: [
    MasterService,
    DbService,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
})
export class MasterModule {}
