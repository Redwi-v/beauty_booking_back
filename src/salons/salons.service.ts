import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { DbService } from 'src/db/db.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SalonsService {
  constructor(private db: DbService) {}

  async create(
    createSalonData: CreateSalonDto,
    session: GetSessionInfoDto,
    imageName?: string,
  ) {
    const data = await this.db.salon.create({
      data: {
        ...createSalonData,
        SalonOwnerAccount: { connect: { ownerId: session.id } },
        logoUrl: imageName,
        isOpen: Boolean(Number(createSalonData?.isOpen)),
      },
    });

    return data;
  }

  async findAll(session: GetSessionInfoDto, search?: string) {
    const salonsListPromise = this.db.salon.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
        AND: {
          salonOwnerAccountId: session.id,
        },
      },
      include: { _count: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const salonsCountPromise = this.db.salon.count();

    const [salonsList, count] = await Promise.all([
      salonsListPromise,
      salonsCountPromise,
    ]);

    return { list: salonsList, meta: { count } };
  }

  async findOne(id: number) {
    const item = await this.db.salon.findUnique({
      where: { salonId: id },
    });

    if (!item) throw new NotFoundException('Салон с данным id не найден');

    return item;
  }

  update(id: number, updateSalonDto: UpdateSalonDto, imageName?: string) {
    return this.db.salon.update({
      where: { salonId: id },
      data: {
        ...updateSalonDto,
        logoUrl: imageName,
        isOpen: Boolean(Number(updateSalonDto.isOpen)),
      },
    });
  }

  remove(id: number) {
    return this.db.salon.delete({ where: { salonId: id } });
  }
}
