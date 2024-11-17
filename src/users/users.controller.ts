import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/dto';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  createSalonOwner() {}

  @Get('profile')
  getProfile(@SessionInfo() session: GetSessionInfoDto) {
    return this.userService.getAdminProfile(session.id);
  }

  @Get('client/profile')
  getProfileClient(@SessionInfo() session: GetSessionInfoDto) {
    return this.userService.getClientProfile(session.id);
  }

  // @Post('add')
  // registerUser(@Body() data: RegisterUser) {}

  @Get('list')
  getUser(@SessionInfo() session: GetSessionInfoDto) {}

  @Patch(':id')
  // updateUser(@Param('id') userId: string, @Body() body: UpdateUser) {}
  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.DeleteUser(+userId);
  }
}
