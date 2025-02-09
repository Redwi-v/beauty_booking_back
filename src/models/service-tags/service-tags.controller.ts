import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ServiceTagsService } from './service-tags.service';
import {
  CreateServiceTagDto,
  FindAllServiceTagDto,
} from './dto/create-service-tag.dto';
import { UpdateServiceTagDto } from './dto/update-service-tag.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('service-tags')
@ApiTags('services tags')
export class ServiceTagsController {
  constructor(private readonly serviceTagsService: ServiceTagsService) {}

  @Post()
  create(@Body() createServiceTagDto: CreateServiceTagDto) {
    return this.serviceTagsService.create(createServiceTagDto);
  }

  @Get()
  findAll(@Query() params: FindAllServiceTagDto) {
    return this.serviceTagsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceTagsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceTagsService.remove(+id);
  }
}
