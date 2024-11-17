import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateSalonBranchDto,
  GetAllSalonBranchesDto,
  UpdateSalonBranchDto,
} from './dto/create-salon.branch.dto';
import { DbService } from 'src/db/db.service';
import { GetSessionInfoDto } from 'src/auth/dto/dto';

@Injectable()
export class SalonBranchService {
  constructor(private db: DbService) {}

  async create(
    createSalonBranchDto: CreateSalonBranchDto,
    session: GetSessionInfoDto,
  ) {
    const { address, isOpen, latitude, longitude, salonId } =
      createSalonBranchDto;

    const salon = await this.db.salon.findUnique({
      where: {
        id: salonId,
        owner: {
          userId: session.id,
        },
      },
    });

    if (!salon) throw new BadRequestException('Салон не найден');

    return this.db.salonBranch.create({
      data: {
        isOpen,

        address,
        latitude: String(latitude),
        longitude: String(longitude),

        salon: {
          connect: salon,
        },
      },
    });
  }

  async findAll(params: GetAllSalonBranchesDto) {
    const { search, skip, take } = params;

    console.log(skip);
    console.log(take);
    console.log(search);

    const findManyPromise = this.db.salonBranch.findMany({
      take: take ? +take : undefined,
      skip: skip ? +skip : undefined,
      where: {
        address: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const countPromise = this.db.salonBranch.count({
      where: {
        address: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    const [listRes, countRes] = await this.db.$transaction([
      findManyPromise,
      countPromise,
    ]);

    return {
      list: listRes,
      count: countRes,
    };
  }

  async findOne(id: number) {
    const res = await this.db.salonBranch.findUnique({
      where: {
        id: id,
      },
    });

    if (!res) throw new BadRequestException('Ветка не найдена');
    return res;
  }

  async update(
    id: number,
    updateSalonBranchDto: UpdateSalonBranchDto,
    session: GetSessionInfoDto,
  ) {
    const { address, isOpen, latitude, longitude, salonId } =
      updateSalonBranchDto;

    let salon;
    if (salonId) {
      salon = await this.db.salon.findUnique({
        where: {
          id: salonId,
          owner: {
            userId: session.id,
          },
        },
      });
    }

    if (!salon && salonId) throw new BadRequestException('Салон не найдет');

    return this.db.salonBranch.update({
      where: {
        id,
        salon: {
          owner: {
            userId: session.id,
          },
        },
      },
      data: {
        address,
        latitude,
        longitude,
        isOpen,
        salon: {
          connect: salon,
        },
      },
    });
  }

  remove(idArray: number[]) {
    return this.db.salonBranch.deleteMany({
      where: {
        id: {
          in: idArray,
        },
      },
    });
  }
}
