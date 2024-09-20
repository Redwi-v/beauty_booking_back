import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbService } from 'src/db/db.service';
import { DbModule } from 'src/db/db.module';
import { PasswordService } from 'src/auth/password.service';

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [UsersService, DbService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
