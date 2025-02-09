import { BadRequestException, Body, Injectable } from '@nestjs/common';
import {
  CreateMasterDto,
  GetAllMastersDto,
  UpdateMasterDto,
} from './dto/create-master.dto';
import { DbService } from 'src/db/db.service';
import * as moment from 'moment';

@Injectable()
export class MasterService {
  constructor(private readonly db: DbService) {}

  async create(createMasterDto: CreateMasterDto, avatarUrl?: string) {
    const {
      about,
      canChangeSchedule,
      lastName,
      name,
      avatar,
      salonBranchId,
      speciality,
      telegramId,
      canChangeBookingTime,
    } = createMasterDto;

    const masterInDb = await this.db.masterAccount.findFirst({
      where: {
        telegramId,
      },
    });

    if (masterInDb)
      throw new BadRequestException('Мастер с таким telegramId уже существует');

    return this.db.masterAccount.create({
      data: {
        speciality,
        telegramId,
        about,
        name,
        lastName,
        avatar: avatarUrl,
        canChangeSchedule: canChangeSchedule === 'true',
        canChangeBookingTime: canChangeBookingTime === 'true',
        salonBranch: {
          connect: {
            id: +salonBranchId,
          },
        },
      },
    });
  }

  async findAll(params: GetAllMastersDto) {
    const { search, skip, take, salonBranchId, salonId, date, time } = params;

    if (!time) {
      const searchPromise = this.db.masterAccount.findMany({
        where: {
          salonBranchId: {
            equals: salonBranchId ? +salonBranchId : undefined,
          },
          salonBranch: {
            salonId: +salonId
          },
          name: { contains: search, mode: 'insensitive' },
        },
      });

      const countPromise = this.db.masterAccount.count({
        where: {
          salonBranchId: {
            equals: salonBranchId ? +salonBranchId : undefined,
          },
          salonBranch: {
            salonId: +salonId
          },

          name: { contains: search, mode: 'insensitive' },
        },
      });

      const [searchRes, countRes] = await this.db.$transaction([
        searchPromise,
        countPromise,
      ]);

      return {
        list: searchRes,
        count: countRes,
      };
    }

    let timeInMinutes;

    timeInMinutes = time
      ? +time?.split(':')[0] * 60 + +time?.split(':')[1]
      : undefined;

    const findDate = date ? moment(date).toDate() : undefined;

    const searchPromise = this.db.masterAccount.findMany({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: {
        salonBranchId: {
          equals: salonBranchId ? +salonBranchId : undefined,
        },
        salonBranch: {
          salonId: +salonId,
        },
        workingsDays: {
          some: {
            day: {
              gte: date
                ? moment(findDate).set({ minutes: 0, hours: 0 }).toDate()
                : undefined,
              lte: date
                ? moment(findDate).set({ minutes: 59, hours: 23 }).toDate()
                : undefined,
            },
            allowedRecordingTime: time
              ? {
                  has: timeInMinutes,
                }
              : undefined,
          },
        },

        name: { contains: search, mode: 'insensitive' },
      },
      include: {
        Booking: true,
        masterService: true,
        workingsDays: true,
      },
    });

    const countPromise = this.db.masterAccount.count({
      where: {
        salonBranchId: {
          equals: salonBranchId ? +salonBranchId : undefined,
        },

        name: { contains: search, mode: 'insensitive' },
      },
    });

    const [searchRes, countRes] = await this.db.$transaction([
      searchPromise,
      countPromise,
    ]);

    return {
      list: searchRes,
      count: countRes,
    };
  }

  findOne(id: number) {
    return this.db.masterAccount.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMasterDto: UpdateMasterDto, avatarUrl?: string) {
    const { avatar, about, canChangeSchedule, ...body } = updateMasterDto;
    return this.db.masterAccount.update({
      where: {
        id,
      },
      data: {
        avatar: avatarUrl,
        about: about,
        canChangeSchedule: canChangeSchedule === 'true',
        lastName: body.lastName,
        name: body.name,
        speciality: body.speciality,
        telegramId: body.telegramId,
        canChangeBookingTime: body.canChangeBookingTime === 'true',
        salonBranch: {
          connect: {
            id: body.salonBranchId ? +body.salonBranchId : undefined,
          },
        },
      },
    });
  }

  remove(idArray: number[]) {
    return this.db.masterAccount.deleteMany({
      where: {
        id: {
          in: Array.isArray(idArray) ? idArray.map((id) => +id) : [+idArray],
        },
      },
    });
  }
}
