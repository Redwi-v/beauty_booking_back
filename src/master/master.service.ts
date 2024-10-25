import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateMasterDto,
  GetBookingByDate,
  GetFreeTimeDto,
  GetMastersParams,
} from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { DbService } from 'src/db/db.service';
import { AuthService } from 'src/auth/auth.service';
import { Prisma, weekDays } from '@prisma/client';
import * as moment from 'moment';
import { getTimeSlots } from 'src/utils/get-time-steps';
import { roundTime } from 'src/utils/round-time';
import { time } from 'console';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class MasterService {
  constructor(
    private db: DbService,
    private auth: AuthService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async create(createMasterDto: CreateMasterDto, avatar) {
    const salonBranch = await this.db.salonBranch.findUnique({
      where: {
        id: createMasterDto.salonBranchId,
      },
      include: {
        Salon: true,
      },
    });

    const masterFormDb = await this.db.masterAccount.findFirst({
      where: {
        OR: [
          { telegramId: { contains: createMasterDto.telegramId } },
          { email: { contains: createMasterDto.email } },
        ],
      },
    });

    if (masterFormDb) {
      throw new BadRequestException(
        'Пользователь с таким tg id или email уже существует',
      );
    }

    if (!salonBranch) {
      throw new BadRequestException(
        'не удалось присоедить мастера к данному салону',
      );
    }

    const masterData: any = {
      ...createMasterDto,
    };

    delete masterData.salonBranchId;
    delete masterData.servicesIdArray;

    const masterServices = createMasterDto.servicesIdArray
      ? createMasterDto.servicesIdArray.map((id) => ({
          id: id,
        }))
      : undefined;

    const connectedUser = await this.db.masterAccount.create({
      data: {
        avatar,
        telegramId: createMasterDto.telegramId,
        ...masterData,
        salon: {
          connect: {
            salonId: salonBranch.Salon?.salonId,
          },
        },
        salonBranch: {
          connect: {
            id: salonBranch.id,
          },
        },
        masterService: {
          connect: masterServices,
        },
      },
    });

    return { connectedUser };
  }

  async findAll(params: GetMastersParams) {
    const { salonId, branchId, search, time, date } = params;

    let { servicesIdList } = params;
    servicesIdList = Array.isArray(servicesIdList)
      ? servicesIdList
      : servicesIdList
        ? [servicesIdList]
        : [];

    const whereParamsAnd = [
      { salon: { salonId: +salonId }, salonBranchId: branchId ? +branchId : undefined },
      {
        OR: [
          { lastName: { contains: search } },
          { name: { contains: search } },
          { telegramId: { contains: search } },
          { email: { contains: search } },
        ],
      },
    ];

    let whereParams: Prisma.MasterAccountWhereInput = {
      AND: whereParamsAnd,
    };
    // поиск по дате и времени
    if (date) {
      const FindDate = new Date(date);
      const day = FindDate.getDay();

      const weekDay = moment().day(day).format('dddd') as weekDays;

      whereParams = {
        AND: [
          ...whereParamsAnd,
          {
            AND: [
              {
                workingDays: {
                  has: weekDay,
                },
              },
            ],
          },
        ],
      };
    }

    const mastersPromise = this.db.masterAccount.findMany({
      where: whereParams,
      include: {
        salonBranch: {
          include: {
            address: true,
          },
        },
        Booking: {
          include: {
            services: true,
          },
        },
        masterService: true,
      },
    });

    const mastersCountPromise = this.db.masterAccount.count({
      where: { salon: { salonId: +salonId } },
    });

    let [masters, mastersCount] = await Promise.all([
      mastersPromise,
      mastersCountPromise,
    ]);

    if (date && time) {
      masters = masters.filter((item) => {
        const bookingToday = [...item.Booking].filter((booking) => {
          return (
            moment(booking.time).format('DD.MM.YYYY') ===
            moment(date).format('DD.MM.YYYY')
          );
        });

        const startShift = moment(item.startShift);
        const endShift = moment(item.endShift);

        let timeSteps = getTimeSlots(startShift.toDate(), endShift.toDate());

        bookingToday.forEach((item) => {
          let endTime = moment(item.time);

          item.services.forEach((service) => {
            endTime.add({ minutes: service.time });
          });

          const startIndex = timeSteps.findIndex(
            (value) => value === roundTime(moment(item.time).format('HH:mm')),
          );
          const endIndex = timeSteps.findIndex(
            (value) => value === roundTime(endTime.format('HH:mm')),
          );

          timeSteps = timeSteps.filter((_, index) => {
            return index < startIndex || index > endIndex;
          });
        });

        return timeSteps.includes(moment(time).format('HH:mm'));
      });
    }

    if (servicesIdList) {
      masters = masters.filter((master) => {
        if (!Array.isArray(servicesIdList)) return master;
        let allId = [...servicesIdList].map((id) => +id);

        master.masterService.forEach((service) => {
          if (allId.includes(service.id)) {
            allId = allId.filter((id) => id !== service.id);
          }
        });

        if (allId.length === 0) return master;
      });
    }

    return {
      masters,
      mastersCount,
    };
  }

  async findOne(id: number) {
    try {
      return this.db.masterAccount.findUnique({
        where: { id },
        include: {
          masterService: true,
          Booking: {
            include: {
              services: true,
            },
          },
          salonBranch: {
            include: {
              address: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: number,
    updateMasterDto: UpdateMasterDto,
    avatarUrl?: string,
  ) {
    const {
      canChangeSchedule,
      email,
      lastName,
      name,
      salonBranchId,
      servicesIdArray,
      speciality,
      telegramId,
      about,
      startShift,
      endShift,
      workingDays,
    } = updateMasterDto;
    console.log(avatarUrl);

    const masterServices = servicesIdArray?.map((id) => ({
      id,
    }));

    const salonBranch = salonBranchId
      ? await this.db.salonBranch.findUnique({
          where: {
            id: salonBranchId,
          },
          include: {
            Salon: true,
            Booking: true,
            MasterService: true,
          },
        })
      : undefined;

    const master = await this.db.masterAccount.findUnique({
      where: {
        id,
      },
      include: {
        masterService: true,
      },
    });

    const additionally: any = {};
    const forDisconnect = master?.masterService.filter(
      (service) => !masterServices?.includes(service),
    );

    if (masterServices) {
      additionally.masterService = {
        disconnect: forDisconnect,
        connect: masterServices,
      };
    }

    if (salonBranchId) {
      additionally.salonBranch = {
        connect: {
          id: salonBranchId,
        },
      };
    }

    if (salonBranch) {
      additionally.salon = {
        connect: {
          salonId: salonBranch?.Salon?.salonId,
        },
      };
    }

    return this.db.masterAccount.update({
      where: { id },
      data: {
        about,
        canChangeSchedule,
        email,
        lastName,
        speciality,

        startShift:
          typeof startShift === 'string' ? new Date(startShift) : startShift,
        //@ts-ignore
        workingDays: Array.isArray(workingDays)
          ? workingDays
          : //@ts-ignore
            workingDays.split(','),
        endShift: typeof endShift === 'string' ? new Date(endShift) : endShift,
        name,
        avatar: avatarUrl,
        telegramId,
        ...additionally,
      },
      include: {
        masterService: true,
      },
    });
  }

  remove(id: number) {
    return this.db.masterAccount.delete({ where: { id } });
  }

  async getFreeTime({
    date,
    masterId,
    servicesIdList,
    bookingId,
  }: GetFreeTimeDto) {
    const weekDay = moment(date).format('dddd') as weekDays;

    if (!masterId || !servicesIdList) {
      const masters = await this.db.masterAccount.findMany({
        where: {
          workingDays: {
            has: weekDay,
          },
        },
      });

      let startTime: string = '',
        endTime: string = '';

      masters.forEach((master, index) => {
        const start = moment(master.startShift).format('HH:mm');
        const end = moment(master.endShift).format('HH:mm');

        if (index === 0) {
          startTime = start;
          endTime = end;
          return;
        }

        startTime = getMaxTime(startTime, start)[0];
        endTime = getMaxTime(endTime, end)[1];
      });

      const startDate = moment()
        .hours(+startTime.split(':')[0])
        .minutes(+startTime.split(':')[1])
        .toDate();
      const endDate = moment()
        .hours(+endTime.split(':')[0])
        .minutes(+endTime.split(':')[1])
        .toDate();

      const freeTime = getTimeSlots(startDate, endDate);

      return { freeTime };
    }

    const master = await this.db.masterAccount.findUnique({
      where: {
        id: +masterId,
      },
      include: {
        Booking: {
          include: {
            services: true,
          },
        },
      },
    });

    if (!master?.workingDays.includes(weekDay))
      return new BadRequestException('Мастер не работает в этот день');

    const startShift = moment(master.startShift).toDate();
    const endShift = moment(master.endShift).toDate();

    let timeSteps = getTimeSlots(startShift, endShift);
    const forbiddenTime: string[] = [];

    const bookingToday = master.Booking.filter((item) => {
      return (
        moment(item.time).format('DD.MM.YYYY') ===
          moment(date).format('DD.MM.YYYY') && +item.id !== Number(bookingId)
      );
    });

    bookingToday.forEach((booking) => {
      let endTime = moment(booking.time);

      booking.services.forEach((service) => {
        endTime.add({ minutes: service.time });
      });

      const startIndex = timeSteps.findIndex(
        (value) => value === roundTime(moment(booking.time).format('HH:mm')),
      );
      const endIndex = timeSteps.findIndex(
        (value) => value === roundTime(endTime.format('HH:mm')),
      );

      timeSteps = timeSteps.filter((step, index) => {
        if (index < startIndex || index > endIndex) return true;
        forbiddenTime.push(step);
        return;
      });
    });

    const servicesNumberIdList = Array.isArray(servicesIdList)
      ? servicesIdList.map((id) => +id)
      : [+servicesIdList];

    const freeTime: string[] = [];

    const services = await this.db.masterService.findMany({
      where: {
        id: {
          in: servicesNumberIdList,
        },
      },
    });

    const totalNewServicesTime = services.reduce((prevValue, service) => {
      return (prevValue += service.time);
    }, 0);

    console.log(totalNewServicesTime);

    console.log(timeSteps);

    timeSteps.forEach((step) => {
      const [hours, minutes] = step.split(':');
      const time = moment().hours(+hours).minutes(+minutes);
      time.add({ minutes: totalNewServicesTime });

      console.log(time.format('HH:mm'));

      if (
        !timeSteps.includes(roundTime(time.format('HH:mm'))) ||
        forbiddenTime.includes(roundTime(time.format('HH:mm')))
      )
        return;

      freeTime.push(step);
    });

    return { freeTime };
  }

  async getByTelegramId(telegramId: string | number) {
    return this.db.masterAccount.findUnique({
      where: {
        telegramId: String(telegramId),
      },
      include: {
        Booking: true,
        masterService: true,
        reviews: true,
        salon: true,
        salonBranch: {
          include: {
            address: true,
          },
        },
      },
    });
  }

  async getBookingByDate(params: GetBookingByDate) {
    const { date, masterId } = params;

    try {
      return this.db.booking.findMany({
        where: {
          AND: [
            {
              master: {
                id: +masterId,
              },
            },
            {
              time: {
                lte: moment(date).hours(23).minutes(59).toDate(),
                gte: moment(date).hours(0).minutes(0).toDate(),
              },
            },
          ],
        },
        include: {
          services: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

function getMaxTime(time1: string, time2: string): [string, string] {
  const [h1, m1] = time1.split(':').map((s) => +s);
  const [h2, m2] = time2.split(':').map((s) => +s);

  if (h1 * 60 + m1 > h2 * 60 + m2) {
    return [time2, time1];
  } else if (h1 * 60 + m1 < h2 * 60 + m2) {
    return [time1, time2];
  } else {
    if (m1 >= m2) {
      return [time2, time1];
    } else {
      return [time1, time2];
    }
  }
}
