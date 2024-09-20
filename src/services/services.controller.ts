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
@UseGuards(AuthGuard)
@ApiTags('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiQuery({ name: 'search', type: FindAllServiceDto })
  findAll(
    @Query('search') search?: string,
    @Query('tagName') tagName?: string,
  ) {
    return this.servicesService.findAll(tagName, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }

  @Post('/tag/:tagName')
  createTag(@Param('tagName') tagName: string) {
    return this.servicesService.createTag(tagName);
  }

  @Delete('/tag/:tagName')
  deleteTag(@Param('tagName') tagName: string) {
    return this.servicesService.deleteTag(tagName);
  }

  @Get('/tag/all')
  findAllTags() {
    return this.servicesService.findAllTags();
  }
}
