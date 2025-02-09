import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SalonService } from './salon.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TokensDecorator } from 'src/auth/roles.decorator';
import { TokenNamesEnum } from 'src/auth/cookie.service';
import { CreateSalonDto, UpdateSalonDto } from './dto/create.salon.dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { DeleteSalonDto, GetAllSalonsDto, GetByIdDto } from './dto/dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@Controller('salon')
@ApiTags('Salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  // удалить
  // getById
  // get all

  // СОЗДАТЬ
  @Post()
  @TokensDecorator(TokenNamesEnum.adminToken)
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createSalon(
    @UploadedFile() file: { originalname: string; filename?: string },
    @Body() body: CreateSalonDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    console.log(body);

    return this.salonService.createSalon(body, session, file?.filename);
  }

  // ОБНОВИТЬ
  @Put()
  @ApiConsumes('multipart/form-data')
  @TokensDecorator(TokenNamesEnum.adminToken)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  updateSalon(
    @UploadedFile() file: { originalname: string; filename?: string },
    @Body() body: UpdateSalonDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.salonService.updateSalon(body, session, file?.filename);
  }

  // ПОЛУЧИТЬ ПО ID
  @Get(':id')
  getById(
    @Param('id') salonId: number,
    @SessionInfo() session: GetSessionInfoDto,
    @Query() params: GetByIdDto
  ) {

    
    return this.salonService.getById(+salonId, session, params);
  }

  // ПОЛУЧИТЬ МНОГО
  @Get()
  @TokensDecorator(TokenNamesEnum.adminToken)
  @UseGuards(AuthGuard)
  getAll(
    @Query() params: GetAllSalonsDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    console.log(params);

    return this.salonService.getAllSalons(params, session);
  }

  // УДАЛИТЬ ПО ID
  @Delete()
  @TokensDecorator(TokenNamesEnum.adminToken)
  @UseGuards(AuthGuard)
  deleteById(
    @Query() params: DeleteSalonDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.salonService.deleteSalon(params.salonsId, session);
  }
}
