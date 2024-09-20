import { Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Telegraf, Context, Markup } from 'telegraf';

@Update()
export class AppUpdate {

  constructor (

    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,

  ) { }

  @Start()
  async startCommand( ctx: Context ) {

    await ctx.reply(
      'hello',
      Markup.inlineKeyboard(
        [

          Markup.button.url( 'СалонApp', 't.me/beauty_booking123123_bot/beautyBooking?startapp=331231' ),
          Markup.button.webApp( 'СалонUrl', 'https://a9d9ad38f3fd888c27a7505416874964.serveo.net' )

        ] ),

    )


  }

}
