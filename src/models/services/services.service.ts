import { Injectable } from '@nestjs/common';
import {
  CreateServiceDto,
  FindManyServicesDto,
} from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ServicesService {
  constructor(private readonly db: DbService) {}

  create(createServiceDto: CreateServiceDto) {
    const { duration, masterAccountsId, name, price, serviceTagId } =
      createServiceDto;

    return this.db.service.create({
      data: {
        duration,
        name,
        price,
        masterAccounts: {
          connect: Array.isArray(masterAccountsId)
            ? masterAccountsId.map((id) => ({ id }))
            : [masterAccountsId],
        },
        serviceTag: {
          connect: {
            id: serviceTagId,
          },
        },
      },
    });
  }

  async findAll(params: FindManyServicesDto) {
    const { salonId, search, skip, take, tagId , masterId } = params;

    const count = await this.db.service.count({
      where: {
        
        masterAccounts: {

          some: {
            id: +masterId || undefined,
            salonBranch: {
              salonId: +salonId,
            },
          },
        },
        serviceTag: {
          id: +tagId || undefined,
        },
        name: { contains: search, mode: 'insensitive' },
      },
      
    });

    const list = await this.db.service.findMany({
      skip: +skip || undefined,
      take: +take || undefined,
      where: {
        masterAccounts: {
          
          some: {
            id: +masterId || undefined,
            salonBranch: salonId ?  {
              salonId: +salonId,
            }: undefined,
          },
        },
        serviceTag: {
          id: +tagId || undefined,
        },
        name: { contains: search, mode: 'insensitive' },
      },
      include: {
        bookingList: true,
        masterAccounts: true,
        serviceTag: {
          include: {
            services: true
          }
        },

      },
    });

    return {
      count,
      list,
    };
  }

  findOne(id: number) {
    return this.db.service.findUnique({
      where: {
        id: +id,
      },
      include: {  
        bookingList: true,
        masterAccounts: true,
        serviceTag: true,
      },
    });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const { masterAccountsId } = updateServiceDto;
    const service = await this.db.service.findUnique({
      where: {
        id,
      },
      include: {
        masterAccounts: true,
      },
    });

    const mastersArrId = Array.isArray(masterAccountsId)
      ? masterAccountsId
      : [masterAccountsId];

    const disconnectId = service?.masterAccounts
      .filter((account) => !masterAccountsId?.includes(account.id))
      .map((master) => master.id);

    return this.db.service.update({
      where: {
        id,
      },
      data: {
        duration: updateServiceDto.duration,
        name: updateServiceDto.name,
        price: updateServiceDto.price,
        masterAccounts: {
          disconnect: disconnectId?.map((id) => ({ id })),
          connect: mastersArrId?.map((id) => ({ id })),
        },
        serviceTag: {
          connect: {
            id: updateServiceDto?.serviceTagId || undefined,
          },
        },
      },
    });
  }

  remove(idArr: number[]) {
    return this.db.service.deleteMany({
      where: {
        id: {
          in: idArr,
        },
      },
    });
  }
}
