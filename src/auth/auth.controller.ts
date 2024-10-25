import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GetSessionInfoDto,
  SignInBodyDto,
  SignUpBodyDto,
  SignUpClientAccountDto,
} from './dto/dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookeService: CookieService,
  ) {}

  @Post('sign-up-salon-owner')
  @ApiCreatedResponse()
  async signUp(
    @Body() body: SignUpBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUpServiceOwner(body);
    this.cookeService.setToken(res, accessToken);
  }

  @Post('sign-up-client')
  @ApiCreatedResponse()
  async signUpClient(
    @Body() body: SignUpClientAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } =
      await this.authService.signUpServiceClientAccount(body);
    this.cookeService.setToken(res, accessToken);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async signIn(
    @Body() body: SignInBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );
    this.cookeService.setToken(res, accessToken);
  }

  @Post('sign-out')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookeService.removeToken(res);
  }

  @Get('session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: GetSessionInfoDto,
  })
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }
}
