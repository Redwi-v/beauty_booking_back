import { Body, Injectable } from '@nestjs/common';
import {
  CreateMasterDto,
  GetAllMastersDto,
  UpdateMasterDto,
} from './dto/create-master.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class MasterService {
  constructor(private readonly db: DbService) {}

  create(createMasterDto: CreateMasterDto, avatarUrl?: string) {
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
    console.log(params);

    const { search, skip, take, salonBranchId } = params;

    const searchPromise = this.db.masterAccount.findMany({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: {
        salonBranchId: {
          equals: salonBranchId ? +salonBranchId : undefined,
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
