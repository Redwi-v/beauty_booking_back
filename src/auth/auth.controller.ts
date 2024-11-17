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
  SinUpAdminDto,
} from './dto/dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieService, TokenNamesEnum } from './cookie.service';
import { SessionInfo } from './session-info.decorator';
import { AuthGuard } from './auth.guard';
import { TokensDecorator } from './roles.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookeService: CookieService,
    private readonly httpService: HttpService,
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
    @Body() body: SinUpAdminDto,
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
    return session;
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
            Authorization: `Basic ${ process.env.DGTL_WIDGET_AUTH }`,
          },
        },
      )
      .pipe(map((res) => res.data));

    return res;
  }

  // CLIENTS

  @Post('client/sign-up')
  async signUpClient(
    @Body() body: SinUpAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUpClient(body);
    this.cookeService.setToken(res, accessToken, TokenNamesEnum.clientToken);
  }
}
