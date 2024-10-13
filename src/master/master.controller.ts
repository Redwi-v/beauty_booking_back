import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MasterService } from './master.service';
import {
  CreateMasterDto,
  GetBookingByDate,
  GetFreeTimeDto,
  GetMastersParams,
} from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@ApiTags('master')
@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  create(
    @Body() createMasterDto: CreateMasterDto,
    @UploadedFile() file: { originalname: string; filename?: string },
  ) {
    return this.masterService.create(createMasterDto, file?.filename);
  }

  @Get()
  findAll(@Query() params?: GetMastersParams) {
    if (!params?.salonId) throw new NotFoundException();

    return this.masterService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(+id);
  }

  @Patch(':id')
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
    @Body() updateMasterDto: UpdateMasterDto,
    @UploadedFile() file: { originalname: string; filename?: string },
  ) {
    return this.masterService.update(+id, updateMasterDto, file?.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterService.remove(+id);
  }

  @Get('/time/freeTime')
  getFreeTime(@Query() params: GetFreeTimeDto) {
    console.log(params);

    return this.masterService.getFreeTime(params);
  }

  @Get('/telegram/:id')
  getOneByTelegramId(@Param('id') id: string) {
    return this.masterService.getByTelegramId(id);
  }

  @Get('/booking/find/byDate')
  getBookingByDate(@Query() params: GetBookingByDate) {
    console.log(params);

    return this.masterService.getBookingByDate(params);
  }
}

