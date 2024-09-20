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
import { RegisterUser, UpdateUser } from './dto/dto';

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

  @Post('add')
  registerUser(@Body() data: RegisterUser) {
    return this.userService.registerUser(data);
  }

  @Get('list')
  getUser(@SessionInfo() session: GetSessionInfoDto) {
    return this.userService.getUsers(session.id);
  }

  @Patch(':id')
  updateUser(@Param('id') userId: string, @Body() body: UpdateUser) {
    return this.userService.UpdateUser(+userId, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.DeleteUser(+userId);
  }
}
