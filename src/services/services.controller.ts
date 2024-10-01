import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, FindAllServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('services')
@ApiTags('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(@Query() params: FindAllServiceDto) {
    return this.servicesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post('/tag/:tagName')
  createTag(@Param('tagName') tagName: string) {
    return this.servicesService.createTag(tagName);
  }

  @UseGuards(AuthGuard)
  @Delete('/tag/:tagName')
  deleteTag(@Param('tagName') tagName: string) {
    return this.servicesService.deleteTag(tagName);
  }

  @Get('/tag/all')
  findAllTags() {
    return this.servicesService.findAllTags();
  }
}
