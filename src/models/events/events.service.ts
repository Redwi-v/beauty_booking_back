import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateEventDto,
  findAllParams,
  UpdateEventDto,
} from './dto/create-event.dto';
import { DbService } from 'src/db/db.service';
import { GetSessionInfoDto } from 'src/auth/dto/dto';

@Injectable()
export class EventsService {
  constructor(private readonly db: DbService) {}

  async create(createEventDto: CreateEventDto, session: GetSessionInfoDto) {
    const {
      clientComment,
      clientLastName,
      clientName,
      clientNumber,
      description,
      duration,
      masterId,
      servicesIdArr,
      start,
      title,
    } = createEventDto;

    const salonBranch = await this.db.salonBranch.findFirst({
      where: {
        masters: {
          some: {
            id: +masterId,
          },
        },
      },
      include: {
        salon: true,
      },
    });

    if (!salonBranch) throw new BadRequestException('Салон не найден');

    return this.db.events.create({
      data: {
        client: session?.id ? {
          connect: {
            id: session?.id 
          }
        }: undefined,
        clientComment: clientComment || '',
        clientLastName,
        clientName,
        clientNumber,
        description,
        duration: +duration,
        start,
        title,
        master: {
          connect: {
            id: +masterId,
          },
        },
        services: {
          connect: servicesIdArr.map((id) => ({ id: +id })),
        },
        salon: { connect: { id: salonBranch.salon?.id } },
        salonBranch: {
          connect: {
            id: salonBranch.id,
          },
        },
      },
    });
  }

  findAll(params: findAllParams) {
    const { salonBranchId, salonId, masterId } = params;

    return this.db.events.findMany({
      where: {
        salonId: +salonId,
        salonBranchId: +salonBranchId || undefined,
        masterAccountId: +masterId || undefined,
      },
      include: {
        salonBranch: true,
        master: true,
        services: true,
      },
    });
  }

  findOne(id: number) {
    return this.db.events.findUnique({
      where:{
        id: +id,
      },
      include: {
        master: true,
        services: true,
        salon: true,
        salonBranch: true
      }
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    const {
      clientComment,
      clientLastName,
      clientName,
      clientNumber,
      description,
      duration,
      masterId,
      salonBranch,
      servicesIdArr,
      start,
      title,
    } = updateEventDto;

    return this.db.events.update({
      where: {
        id: +id,
      },
      data: {
        clientComment,
        clientLastName,
        clientName,
        clientNumber,
        description,
        duration,
        start,
        title,
      },
    });
  }

  remove(id: number) {  
    return this.db.events.delete({
      where: {
        id: +id,
      },
    });
  }
}
