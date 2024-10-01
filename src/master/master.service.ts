import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateMasterDto,
  GetFreeTimeDto,
  GetMastersParams,
} from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { DbService } from 'src/db/db.service';
import { AuthService } from 'src/auth/auth.service';
import { Prisma, weekDays } from '@prisma/client';
import * as moment from 'moment';
import { getTimeSlots } from 'src/utils/get-time-steps';

@Injectable()
export class MasterService {
  constructor(
    private db: DbService,
    private auth: AuthService,
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
    const { salonId = 1, search, time, date, servicesIdList } = params;

    const whereParamsAnd = [
      { salon: { salonId: +salonId } },
      {
        OR: [
          { lastName: { contains: search } },
          { name: { contains: search } },
          { telegramId: { contains: search } },
          { email: { contains: search } },
          {
            masterService: {
              some: {
                id: { in: servicesIdList?.map((id) => +id) },
              },
            },
          },
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

      const weekDay = Object.keys(weekDays)[day] as weekDays;

      whereParams = {
        AND: [
          ...whereParamsAnd,
          {
            AND: [
              {
                workingDays: {
                  hasSome: [weekDay],
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

    return {
      masters,
      mastersCount,
    };
  }

  findOne(id: number) {
    return this.db.masterAccount.findUnique({
      where: { id },
      include: { masterService: true, Booking: true },
    });
  }

  async update(id: number, updateMasterDto: UpdateMasterDto) {
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

        startShift,
        //@ts-ignore
        workingDays,
        endShift,
        name,
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

  async getFreeTime({ date, masterId, servicesIdList }: GetFreeTimeDto) {
    const weekDay = moment(date).format('dddd') as weekDays;

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
        moment(date).format('DD.MM.YYYY')
      );
    });

    bookingToday.forEach((booking) => {
      let endTime = moment(booking.time);

      booking.services.forEach((service) => {
        endTime.add({ minutes: service.time });
      });

      console.log(endTime.format('HH:mm'));
      console.log(moment(booking.time).format('HH:mm'));

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
}

function roundTime(time: string): string {
  let [hours, minutes] = time.split(':');

  if (minutes === '30' || minutes === '00') return `${hours}:${minutes}`;

  if (+minutes > 30) {
    const checkedHours =
      +hours + 1 >= 24 ? '00' : +hours + 1 > 10 ? +hours + 1 : +hours + 1;

    return `${checkedHours}:00`;
  }

  return `${hours}:30`;
}
