import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local'
import { TelegrafModule } from 'nestjs-telegraf'
import { AppUpdate } from './app.update';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { SalonsModule } from './salons/salons.module';
import { FilesModule } from './files/files.module';
import { SalonBranchModule } from './salon-branch/salon-branch.module';
import { MasterModule } from './master/master.module';
import { DservicesModule } from './dservices/dservices.module';
import { ServicesModule } from './services/services.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionModule } from './subscription/subscription.module';


const sessions = new LocalSession({database: 'sessions_db.json'})
@Module({

  imports: [

    TelegrafModule.forRoot({
      
      middlewares: [ sessions.middleware() ],
      token: '7184076234:AAEuUjeQBGtCyaa0yhBr6QK2pyFbVNZR77o',
      
    }),

    DbModule,

    AuthModule,

    UsersModule,

    SalonsModule,

    FilesModule,

    SalonBranchModule,

    MasterModule,

    DservicesModule,

    ServicesModule,

    BookingModule,

    PaymentModule,

    SubscriptionModule

  ],

  controllers: [ AppController ],
  providers: [ AppService, AppUpdate, AuthService ],

})
export class AppModule {}
