import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { MasterService } from './master.service';
import {
  CreateMasterDto,
  GetAllMastersDto,
  removeItemsDto,
  UpdateMasterDto,
} from './dto/create-master.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@ApiTags('master')
@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @Body() createMasterDto: CreateMasterDto,
    @UploadedFile() avatar: { originalname: string; filename?: string },
  ) {
    return this.masterService.create(createMasterDto, avatar?.filename);
  }

  @Get()
  findAll(@Query() params: GetAllMastersDto) {
    return this.masterService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
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
    @UploadedFile() avatar: { originalname: string; filename?: string },
  ) {
    return this.masterService.update(+id, updateMasterDto, avatar?.filename);
  }

  @Delete('')
  remove(@Query() params: removeItemsDto) {
    return this.masterService.remove(params.idArray);
  }
}
