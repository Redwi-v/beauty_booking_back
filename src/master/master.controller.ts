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
} from '@nestjs/common';
import { MasterService } from './master.service';
import {
  CreateMasterDto,
  GetFreeTimeDto,
  GetMastersParams,
} from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

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
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    console.log(id);
    console.log(updateMasterDto);

    return this.masterService.update(+id, updateMasterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterService.remove(+id);
  }

  @Get('/time/freeTime')
  getFreeTime(@Query() params: GetFreeTimeDto) {
    return this.masterService.getFreeTime(params);
  }
}

