import { Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';

@Update()
export class AppUpdate {

  constructor (

    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,

  ) { }

  @Start()
  async startCommand(ctx: Context) {

    await ctx.reply('hello pidor')

  }

}
