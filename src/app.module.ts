import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local'
import { TelegrafModule } from 'nestjs-telegraf'
import { AppUpdate } from './app.update';


const sessions = new LocalSession({database: 'sessions_db.json'})
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [ sessions.middleware() ],
      token: '7184076234:AAEuUjeQBGtCyaa0yhBr6QK2pyFbVNZR77o',
    })
  ],
  controllers: [AppController],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
