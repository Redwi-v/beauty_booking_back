import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SalonBranchService } from './salon.branch.service';
import {
  CreateSalonBranchDto,
  DeleteBranchDto,
  GetAllSalonBranchesDto,
  UpdateSalonBranchDto,
} from './dto/create-salon.branch.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { TokensDecorator } from 'src/auth/roles.decorator';
import { TokenNamesEnum } from 'src/auth/cookie.service';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { query } from 'express';

@Controller('salonBranch')
@ApiTags('salon Branch ')
export class SalonBranchController {
  constructor(private readonly salonBranchService: SalonBranchService) {}

  // СОЗДАТЬ ВЕТКУ
  @Post()
  @TokensDecorator(TokenNamesEnum.adminToken)
  @UseGuards(AuthGuard)
  create(
    @Body() createSalonBranchDto: CreateSalonBranchDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.salonBranchService.create(createSalonBranchDto, session);
  }

  // НАЙТИ ВСЕ

  @Get()
  findAll(@Query() query: GetAllSalonBranchesDto) {
    console.log(query);

    return this.salonBranchService.findAll(query);
  }

  // НАЙТИ Одну по id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salonBranchService.findOne(+id);
  }

  // Обновить Одну по id
  @Patch(':id')
  @TokensDecorator(TokenNamesEnum.adminToken)
  @UseGuards(AuthGuard)
  update(
    @Body() updateSalonBranchDto: UpdateSalonBranchDto,
    @Param('id') id: string,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.salonBranchService.update(+id, updateSalonBranchDto, session);
  }

  // УДАЛИТЬ ЗАПИСИ
  @Delete()
  remove(@Query() query: DeleteBranchDto) {
    const numberIdArray = Array.isArray(query.idArray)
      ? query.idArray.map((id) => +id)
      : [+query.idArray];

    return this.salonBranchService.remove(numberIdArray);
  }
}
