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
  addServiceDto,
  CreateMasterDto,
  UpdateServiceDto,
} from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { ApiTags } from '@nestjs/swagger';

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
  findAll(
    @Query('salonId') salonId?: string,
    @Query('search') search?: string,
  ) {
    if (!salonId) throw new NotFoundException();

    return this.masterService.findAll(+salonId, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    return this.masterService.update(+id, updateMasterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterService.remove(+id);
  }

  @Post('update-service')
  updateService(@Body() addServiceData: UpdateServiceDto) {
    return this.masterService.updateService(addServiceData);
  }

  @Post('delete-service/:id')
  deleteService(@Param('id') id: string) {
    return this.masterService.removerService(+id);
  }
}
