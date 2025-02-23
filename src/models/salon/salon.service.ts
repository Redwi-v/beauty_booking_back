import { Injectable, Inject } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateSalonDto, UpdateSalonDto } from './dto/create.salon.dto';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { GetAllSalonsDto, GetByIdDto } from './dto/dto';
import { Prisma } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class SalonService {
  constructor(private readonly db: DbService) {}

  createSalon(
    body: CreateSalonDto,
    session: GetSessionInfoDto,
    avatar?: string,
  ) {
    const { description, isOpen, name } = body;

    return this.db.salon.create({
      data: {
        name,
        description,
        isOpen: isOpen === 'true',
        logoUrl: avatar,
        owner: {
          connect: {
            userId: session.id,
          },
        },
      },
    });
  }

  updateSalon(
    body: UpdateSalonDto,
    session: GetSessionInfoDto,
    avatar?: string,
  ) {
    const { description, isOpen, name, salonId } = body;

    return this.db.salon.update({
      where: {
        id: +salonId,
        owner: {
          userId: session.id,
        },
      },
      data: {
        description,
        isOpen: isOpen === 'true',
        name,
        logoUrl: avatar,
      },
    });
  }

  deleteSalon(salonId: number | number[], session: GetSessionInfoDto) {

    console.log('====================================');
    console.log(salonId);
    console.log('====================================');

    if (Array.isArray(salonId))
      return this.db.salon.deleteMany({
        where: {
          id: {
            in: salonId.map((id) => +id),
          },
          owner: {
            userId: session.id,
          },
        },
      });

    return this.db.salon.delete({
      where: {
        id: +salonId,
        owner: {
          userId: +session.id,
        },
      },
    });
  }

  async getAllSalons(params: GetAllSalonsDto, session: GetSessionInfoDto) {
    const { search, skip, take } = params;

    const whereArgs: Prisma.SalonWhereInput = {
      name: { contains: search, mode: 'insensitive' },
      owner: { userId: session.id },
    };

    const transaction = await this.db.$transaction([
      this.db.salon.count({
        where: whereArgs,
      }),
      this.db.salon.findMany({
        take: take ? +take : undefined,
        skip: skip ? +skip : undefined,
        where: whereArgs,
      }),
    ]);

    return {
      list: transaction[1],
      totalCount: transaction[0],
    };
  }

  getById(id: number, session: GetSessionInfoDto, params: GetByIdDto) {

    const {onlyActiveBranches} = params

    return this.db.salon.findUnique({
      where: {
        id: +id,
      },

      include: {
        branches: {
          where: {
            isOpen: {
              equals: onlyActiveBranches === 'true' ? true : undefined
            }
          }
        }
      }
    });
  }
}
