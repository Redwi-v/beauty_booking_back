import { Injectable } from '@nestjs/common';
import {
  CreateServiceTagDto,
  FindAllServiceTagDto,
} from './dto/create-service-tag.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ServiceTagsService {
  constructor(private readonly db: DbService) {}

  create(createServiceTagDto: CreateServiceTagDto) {
    return this.db.serviceTag.create({
      data: createServiceTagDto,
    });
  }

  findAll({ salonId, skip, take, takeServices, search }: FindAllServiceTagDto) {
    return this.db.serviceTag.findMany({
      take: +take,
      skip: +skip,
      where: {
        salonId: +salonId,
        name: { contains: search, mode: 'insensitive' },
      },

      include: {
        //@ts-ignore
        services: takeServices === 'true' ? true : false,
      },
    });
  }

  findOne(id: number) {
    return this.db.serviceTag.findUnique({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.db.serviceTag.delete({
      where: {
        id,
      },
    });
  }
}
