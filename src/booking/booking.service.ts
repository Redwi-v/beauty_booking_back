import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DbService } from 'src/db/db.service';
import { connect } from 'http2';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { AppService } from 'src/app.service';

@Injectable()
export class BookingService {
  constructor(
    private db: DbService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const {
        clientPhone,
        clientName,
        masterId,
        clientComment,
        salonBranchId,
        clientTelegramId,
        servicesIdArray,
        salonId,
        time,
      } = createBookingDto;

      const servicesMap = servicesIdArray.map((serviceId) => ({
        id: serviceId,
      }));

      return this.db.booking.create({
        data: {
          clientComment,
          clientName,
          clientPhone,
          clientTelegramId,
          time: time,
          master: {
            connect: {
              id: masterId,
            },
          },
          salon: {
            connect: {
              salonId,
            },
          },
          salonBranch: {
            connect: {
              id: salonBranchId,
            },
          },
          services: {
            connect: servicesMap,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll(telegramId: string) {
    try {
      return this.db.booking.findMany({
        where: {
          clientTelegramId: telegramId,
        },
        include: {
          master: true,
          salon: true,
          salonBranch: true,
          services: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return this.db.booking.delete({
      where: {
        id,
      },
    });
  }
}
