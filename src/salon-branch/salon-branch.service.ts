import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSalonBranchDto } from './dto/create-salon-branch.dto';
import { UpdateSalonBranchDto } from './dto/update-salon-branch.dto';
import { DbService } from 'src/db/db.service';
import { GetSessionInfoDto } from 'src/auth/dto/dto';

@Injectable()
export class SalonBranchService {
  constructor(private db: DbService) {}

  async create(
    createSalonBranchDto: CreateSalonBranchDto,
    session: GetSessionInfoDto,
  ) {
    try {
      const item = await this.db.salonBranch.create({
        data: {
          address: {
            create: createSalonBranchDto.address,
          },
          Salon: {
            connect: createSalonBranchDto.salon,
          },
        },
      });

      return item;
    } catch (error) {
      throw new BadRequestException(error.meta.cause);
    }
  }

  findAll() {
    return this.db.salonBranch.findMany({
      include: { address: true, MasterAccount: true, Salon: true },
    });
  }

  findOne(id: number) {
    return this.db.salonBranch.findUnique({
      where: { id },
    });
  }

  getSalonBranches(salonId: string) {
    return this.db.salonBranch.findMany({
      where: { salonId: +salonId },
      include: {
        address: true,
      },
    });
  }

  async update(id: number, updateSalonBranchDto: UpdateSalonBranchDto) {
    try {
      const item = await this.db.salonBranch.update({
        where: { id },
        data: {
          address: {
            update: {
              address: updateSalonBranchDto.address?.address,
              city: updateSalonBranchDto.address?.city,
            },
          },
        },
      });

      return item;
    } catch (error) {
      throw new BadRequestException(error.meta.cause);
    }
  }

  async remove(id: number) {
    try {
      const address = await this.db.address.delete({
        where: {
          salonBranchId: id,
        },
      });

      const data = await this.db.salonBranch.delete({
        where: {
          id: id,
        },
      });

      return {
        address,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.meta.cause);
    }
  }
}
