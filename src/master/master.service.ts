import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMasterDto, UpdateServiceDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { DbService } from 'src/db/db.service';
import { AuthService } from 'src/auth/auth.service';

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

    const masterData: any = { ...createMasterDto };
    delete masterData.salonBranchId;

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
      },
    });

    return { connectedUser };
  }

  async findAll(salonId: number, search?: string) {
    const mastersPromise = this.db.masterAccount.findMany({
      where: {
        AND: [
          { salon: { salonId: salonId } },
          {
            OR: [
              { lastName: { contains: search } },
              { name: { contains: search } },
              { telegramId: { contains: search } },
              { email: { contains: search } },
            ],
          },
        ],
      },
      include: {
        salonBranch: {
          include: {
            address: true,
          },
        },
      },
    });

    const mastersCountPromise = this.db.masterAccount.count({
      where: { salon: { salonId: salonId } },
    });

    const [masters, mastersCount] = await Promise.all([
      mastersPromise,
      mastersCountPromise,
    ]);

    return {
      masters,
      mastersCount,
    };
  }

  findOne(id: number) {
    return this.db.masterAccount.findUnique({ where: { id } });
  }

  update(id: number, updateMasterDto: UpdateMasterDto) {
    return this.db.masterAccount.update({
      where: { id },
      data: {
        ...updateMasterDto,
      },
    });
  }

  remove(id: number) {
    return this.db.masterAccount.delete({ where: { id } });
  }

  async updateService(data: UpdateServiceDto) {
    const { serviceId, ...serviceData } = data;

    return this.db.masterService.update({
      where: { id: serviceId },
      data: serviceData,
    });
  }

  async removerService(id: number) {
    return this.db.masterService.delete({ where: { id } });
  }
}
