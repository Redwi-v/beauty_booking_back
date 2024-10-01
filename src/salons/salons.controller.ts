import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@Controller('salons')
@ApiTags('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @UseGuards(AuthGuard)
  @Post()
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
  create(
    @Body() createSalonBody: CreateSalonDto,
    @SessionInfo() session: GetSessionInfoDto,
    @UploadedFile() file: { originalname: string; filename?: string },
  ) {
    return this.salonsService.create(createSalonBody, session, file?.filename);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @SessionInfo() session: GetSessionInfoDto,
    @Query('search') search?: string,
  ) {
    return this.salonsService.findAll(session, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salonsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
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
  update(
    @Param('id') id: string,
    @Body() updateSalonDto: UpdateSalonDto,
    @UploadedFile() file: { originalname: string; filename?: string },
  ) {
    return this.salonsService.update(+id, updateSalonDto, file?.filename);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salonsService.remove(+id);
  }
}
