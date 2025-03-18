import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GetSessionInfoDto,
  ISendAuthKeyDto,
  SignInDto,
  SignUpAdminDto,
  SignUpClientDto,
  SignUpMasterDto,
} from './dto/dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieService, TokenNamesEnum } from './cookie.service';
import { SessionInfo } from './session-info.decorator';
import { AuthGuard } from './auth.guard';
import { TokensDecorator } from './roles.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { DbService } from 'src/db/db.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookeService: CookieService,
    private readonly httpService: HttpService,
    private db: DbService,
  ) {}

  private async checkKey(messageKey: string) {
    return firstValueFrom(
      this.httpService.post<{ status: 'CONFIRMED' | string }>(
        'https://direct.i-dgtl.ru/api/v1/verifier/widget/check',
        {
          key: messageKey,
        },
        {
          headers: {
            Authorization: `Basic ${process.env.DGTL_WIDGET_AUTH}`,
          },
        },
      ),
    );
  }

  // ADMINS
  @Post('admin/sign-up')
  async signUpAdmin(
    @Body() body: SignUpAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const widgetRes = await this.checkKey(body.messageKey);

    if (widgetRes.data.status !== 'CONFIRMED') return;

    const { accessToken } = await this.authService.signUpAdmin(body);
    this.cookeService.setToken(res, accessToken, TokenNamesEnum.adminToken);
  }

  @Post('admin/sign-in')
  async signInAdmin(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const widgetRes = await this.checkKey(body.messageKey);

    if (widgetRes.data.status !== 'CONFIRMED') return;

    const { accessToken } = await this.authService.signInAdmin(
      body.phoneNumber,
      body.password,
    );
    this.cookeService.setToken(res, accessToken, TokenNamesEnum.adminToken);
  }

  @Post('admin/sign-out')
  @TokensDecorator()
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookeService.removeToken(res, TokenNamesEnum.adminToken);
  }

  @Get('/session')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: GetSessionInfoDto,
  })
  async getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {

    console.log(session.phoneNumber);
    
    let booking = await this.db.events.findMany({
      where: {
        clientNumber: session.phoneNumber
      },
      include: {
        client: true,
        services: true,
        master: true,
      }
    }, 
  );

    return { ...session, bookingList: booking };
  }

  @Post('key/send')
  @ApiOkResponse({
    status: 200,
  })
  @HttpCode(HttpStatus.OK)
  async sendAuthKey(@Body() body: ISendAuthKeyDto) {
    const res = await this.httpService
      .post(
        'https://direct.i-dgtl.ru/api/v1/verifier/widget/send',
        {
          key: body.key,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.DGTL_WIDGET_AUTH}`,
          },
        },
      )
      .pipe(map((res) => res.data));

    return res;
  }

  // CLIENTS

  @Post('client/sign-up')
  async signUpClient(
    @Body() body: SignUpClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUpClient(body);
    this.cookeService.setToken(res, accessToken, TokenNamesEnum.clientToken);
  }

  @Post('client/sign-out')
  @TokensDecorator()
  @UseGuards(AuthGuard)
  signOutClient(@Res({ passthrough: true }) res: Response) {
    this.cookeService.removeToken(res, TokenNamesEnum.clientToken);
  }

  @Post('client/sign-in')
  async signInClient(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(body);

    const widgetRes = await this.checkKey(body.messageKey);

    if (widgetRes.data.status !== 'CONFIRMED') return;

    const { accessToken } = await this.authService.signInClient(
      body.phoneNumber,
      body.password,
    );
    this.cookeService.setToken(res, accessToken, TokenNamesEnum.clientToken);
  }

  @Post('master/sign-up')
  async signUpMaster(
    @Body() body: SignUpMasterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUpClient(body);
    this.cookeService.setToken(res, accessToken, TokenNamesEnum.clientToken);
  }
}
