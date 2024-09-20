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
  Put,
} from '@nestjs/common';
import { SalonBranchService } from './salon-branch.service';
import { CreateSalonBranchDto } from './dto/create-salon-branch.dto';
import { UpdateSalonBranchDto } from './dto/update-salon-branch.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('salon-branch')
@ApiTags('salonBranches')
@UseGuards(AuthGuard)
export class SalonBranchController {
  constructor(private readonly salonBranchService: SalonBranchService) {}

  @Post()
  create(
    @Body() createSalonBranchDto: CreateSalonBranchDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.salonBranchService.create(createSalonBranchDto, session);
  }

  @Get()
  findAll() {
    return this.salonBranchService.findAll();
  }

  @Get('findOne')
  findOne(@Query('salonBranchId') branchId: string) {
    return this.salonBranchService.findOne(+branchId);
  }
  @Get('findSalonBranches')
  async getSalonBranches(@Query('salonId') salonId: string) {
    const list = await this.salonBranchService.getSalonBranches(salonId);

    return {
      list,
    };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalonBranchDto: UpdateSalonBranchDto,
  ) {
    return this.salonBranchService.update(+id, updateSalonBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salonBranchService.remove(+id);
  }
}
