import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSalonDto, getAllBookingDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { GetSessionInfoDto } from 'src/auth/dto/dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class SalonsService {
  constructor(private db: DbService) {}

  async create(
    createSalonData: CreateSalonDto,
    session: GetSessionInfoDto,
    imageName?: string,
  ) {
    console.log(session);
    console.log(createSalonData);

    const data = await this.db.salon.create({
      data: {
        ...createSalonData,
        SalonOwnerAccount: { connect: { id: session.id } },
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
      include: {
        _count: true,
        branches: {
          include: {
            address: true,
          },
        },
        MasterAccount: true,
      },
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

  async getAllBooking(params: getAllBookingDto) {
    try {
      return this.db.booking.findMany({
        where: {
          AND: [
            { salonId: { equals: +params.salonId } },
            { salonBranchId: { equals: +params.branchId } },
          ],
        },
        include: {
          services: true,
          master: true,
        },
      });
    } catch (error) {
      console.log(error);

      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    try {
      console.log('one ----');

      const item = await this.db.salon.findFirst({
        where: { salonId: id },
        include: {
          branches: {
            include: {
              address: true,
            },
          },
        },
      });
      return item;
    } catch (error) {
      throw new NotFoundException('Салон с данным id не найден');
    }
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
    console.log(id);

    return this.db.salon.delete({
      where: {
        salonId: id,
      },
    });
  }
}
