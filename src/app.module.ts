import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { FilesModule } from './files/files.module';
import { DservicesModule } from './dservices/dservices.module';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SalonModule } from './models/salon/salon.module';
import { SalonBranchModule } from './models/salon.branch/salon.branch.module';
import { MasterModule } from './models/master/master.module';

const sessions = new LocalSession({ database: 'sessions_db.json' });
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: '7184076234:AAEuUjeQBGtCyaa0yhBr6QK2pyFbVNZR77o',
    }),

    DbModule,

    AuthModule,

    UsersModule,

    FilesModule,

    DservicesModule,

    PaymentModule,

    SubscriptionModule,

    SalonModule,
    SalonBranchModule,
    MasterModule,
  ],

  controllers: [AppController],
  providers: [AppService, AppUpdate, AuthService],
})
export class AppModule {}
