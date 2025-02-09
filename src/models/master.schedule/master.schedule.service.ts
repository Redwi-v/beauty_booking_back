import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GetFreeTimeDto,
  UpdateMasterScheduleDto,
} from './dto/update-master.schedule.dto';
import { DbService } from 'src/db/db.service';
import * as moment from 'moment';

@Injectable()
export class MasterScheduleService {
  constructor(private db: DbService) {}

  async update(
    masterId: number,
    updateMasterScheduleDto: UpdateMasterScheduleDto,
  ) {
    await this.db.masterAccount.update({
      data: {
        workingsDays: {
          createMany: {
            data: updateMasterScheduleDto.workingDays,
          },
        },
      },
      where: {
        id: masterId,
      },
    });
  }

  async updateOne(
    id: number,
    updateMasterScheduleDto: UpdateMasterScheduleDto,
  ) {
    return this.db.workingDay.update({
      where: {
        id,
      },
      data: updateMasterScheduleDto.workingDays[0],
    });
  }

  async get(masterId: number) {
    return this.db.workingDay.findMany({
      where: {
        masterAccountId: masterId,
      },
    });
  }

  async getFreeTime(params: GetFreeTimeDto, masterId: number) {
    const { activeEventId, salonBranchId, salonId, servicesIdArr, date } =
      params;

      console.log('masterId');
      console.log(masterId);
      

    if (!masterId) {
      const mastersAccounts = await this.db.masterAccount.findMany({
        where: {
          salonBranchId: +salonBranchId,
        },
        include: {
          workingsDays: true,
        },
      });

      const allowedTime: number[] = [];

      mastersAccounts.forEach((account) => {
        account.workingsDays.forEach((day) => {
          if (
            moment(day.day).format('DD.MM.YYYY') ===
            moment(date).format('DD.MM.YYYY')
          ) {
            allowedTime.push(...day.allowedRecordingTime);
          }
        });
      });

      const clearAllowedTime = Array.from( new Set(allowedTime) ).sort((a, b) => a - b);

      console.log(clearAllowedTime);

      return clearAllowedTime;

    }

    const events = masterId
      ? await this.db.events.findMany({
          where: {
            start: { contains: date },
            masterAccountId: +masterId,
            id: {
              not: +activeEventId || undefined,
            },
          },
        })
      : null;

    //@ts-ignore
    const momentDate = date
      ? moment(new Date(date)).set({ hours: 23, minutes: 59 })
      : undefined;
    //@ts-ignore
    const momentDateLte = date
      ? moment(new Date(date)).set({
          hours: 0,
          minutes: 0,
        })
      : undefined;

    const workingDay = masterId
      ? await this.db.workingDay.findFirst({
          where: {
            masterAccountId:  +masterId,
            MasterAccount: salonBranchId
              ? {
                  salonBranchId: +salonBranchId,
                }
              : undefined,
            day: date
              ? {
                  lte: momentDate?.toDate(),
                  gte: momentDateLte?.toDate(),
                }
              : undefined,
          },
        })
      : null;


      console.log(workingDay);
      
    if (!masterId) return [];

    //удалить все перерывы
    let freeTimeArray: number[] = workingDay
      ? [...workingDay.allowedRecordingTime]
      : [];
    const timeouts = workingDay ? [...workingDay.freeTime] : [];

    timeouts.forEach((timeout) => {
      let start: string[] | number = timeout.split('-')[0].split(':');
      start = +start[0] * 60 + +start[1];

      let end: string[] | number = timeout.split('-')[1].split(':');
      end = +end[0] * 60 + +end[1];

      console.log(start);
      console.log(end);

      freeTimeArray = freeTimeArray.filter((time) => {
        if (time >= +start && time < +end) return false;
        return true;
      });
    });

    events &&
      events.map((event) => {
        let start: string[] | number = event.start.split(' ')[1].split(':');
        start = +start[0] * 60 + +start[1];

        const end = start + event.duration;

        freeTimeArray = freeTimeArray.filter((time) => {
          if (time >= +start && time <= +end) return false;
          return true;
        });
      });

    console.log(
      freeTimeArray.map((time) => {
        return moment().set({ hours: 0, minutes: time }).format('HH:mm');
      }),
    );

    return freeTimeArray.sort((a,b) => a - b);
  }

  async delete(masterIdArr: number[]) {
    console.log(masterIdArr);

    return this.db.workingDay.deleteMany({
      where: {
        id: {
          in: masterIdArr,
        },
      },
    });
  }
}
