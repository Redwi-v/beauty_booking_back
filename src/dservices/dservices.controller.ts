import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DservicesService } from './dservices.service';
import { CreateDserviceDto } from './dto/create-dservice.dto';
import { UpdateDserviceDto } from './dto/update-dservice.dto';

@Controller('dservices')
export class DservicesController {
  constructor(private readonly dservicesService: DservicesService) {}

  @Post()
  create(@Body() createDserviceDto: CreateDserviceDto) {
    return this.dservicesService.create(createDserviceDto);
  }

  @Get()
  findAll() {
    return this.dservicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dservicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDserviceDto: UpdateDserviceDto) {
    return this.dservicesService.update(+id, updateDserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dservicesService.remove(+id);
  }
}
