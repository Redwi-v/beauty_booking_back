import { Module } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { SalonsController } from './salons.controller';
import { DbService } from 'src/db/db.service';
import { FilesController } from 'src/files/files.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [SalonsController],
  providers: [SalonsService, DbService],
})
export class SalonsModule {}
