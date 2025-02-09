import {
  Controller,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { MasterScheduleService } from './master.schedule.service';
import {
  GetFreeTimeDto,
  UpdateMasterScheduleDto,
} from './dto/update-master.schedule.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { stringify } from 'querystring';

@Controller('master.schedule')
@ApiTags('MasterSchedule')
export class MasterScheduleController {
  constructor(private readonly masterScheduleService: MasterScheduleService) {}

  @Patch(':userId')
  update(
    @Param('userId') id: string,
    @Body() updateMasterScheduleDto: UpdateMasterScheduleDto,
  ) {
    return this.masterScheduleService.update(+id, updateMasterScheduleDto);
  }

  @Patch('/updateOne/:id')
  updateOne(
    @Param('id') id: string,
    @Body() updateMasterScheduleDto: UpdateMasterScheduleDto,
  ) {
    return this.masterScheduleService.updateOne(+id, updateMasterScheduleDto);
  }

  @Get(':masterId')
  getList(@Param('masterId') masterId: string) {
    return this.masterScheduleService.get(+masterId);
  }

  @Get('/freetime/:masterId')
  getFreeTimeList(
    @Param('masterId') masterId: string,
    @Query() params: GetFreeTimeDto,
  ) {

    return this.masterScheduleService.getFreeTime(params, +masterId);
  }

  @Delete()
  delete(@Query('masterId') masterIdArr: number[]) {
    console.log(masterIdArr);

    return this.masterScheduleService.delete(
      Array.isArray(masterIdArr)
        ? masterIdArr.map((id) => +id)
        : [+masterIdArr],
    );
  }
}
