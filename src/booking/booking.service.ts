import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DbService } from 'src/db/db.service';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import * as moment from 'moment';

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
        adminComment,
        masterComment,
        clientId,
      } = createBookingDto;

      const servicesMap = servicesIdArray.map((serviceId) => ({
        id: serviceId,
      }));

      const salon = await this.db.salon.findUnique({
        where: {
          salonId,
        },
      });

      const res = await this.db.booking.create({
        data: {
          clientComment,
          clientName,
          clientPhone,
          clientTelegramId,
          adminComment,
          masterComment,
          client: {
            connect: {
              userId: clientId,
            },
          },
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
        include: {
          master: true,
          client: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!res.masterComment) {
        this?.bot?.telegram
          .sendMessage(
            res.master.telegramId,
            `
            Привет, тебе назначена запись на ${moment(res.time).locale('ru').format('DD MMMM YYYY HH:mm')}
            Клиент: ${res.clientName}
            Номер клиента: ${res.clientPhone}
            Коментарий: ${res.adminComment || res.clientComment}

            Хрошего Дня ❤
          `,
          )
          .catch((err) => {
            console.log(err);
          });
      }

      return res;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  findAll(telegramId: string) {
    try {
      return this.db.booking.findMany({
        where: {
          client: {
            userId: +telegramId,
          },
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

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const {
      adminComment,
      clientComment,
      masterComment,
      masterId,
      clientName,
      clientPhone,
      clientTelegramId,
      salonBranchId,
      salonId,
      servicesIdArray,
      time,
    } = updateBookingDto;

    const bookingInDb = await this.db.booking.findUnique({
      where: {
        id: +id,
      },
      include: {
        services: true,
      },
    });

    if (!bookingInDb) throw new BadRequestException('Запись не найдена');

    const servicesInDb = await this.db.masterService.findMany({
      where: {
        id: {
          in: servicesIdArray,
        },
      },
    });

    return this.db.booking.update({
      where: {
        id: +id,
      },
      data: {
        adminComment,
        clientComment,
        clientName,
        clientPhone,
        masterComment,
        time,
        services: {
          disconnect: bookingInDb.services,
          connect: servicesInDb,
        },
        master: {
          connect: {
            id: masterId,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const res = await this.db.booking.delete({
      where: {
        id,
      },
      include: {
        master: true,
      },
    });

    this?.bot?.telegram
      .sendMessage(
        res.master.telegramId,
        `
          Привет, Запись ${moment(res.time).locale('ru').format('DD MMMM YYYY HH:mm')} Удалена💥
          Клиент: ${res.clientName}
          Номер клиента: ${res.clientPhone}
          Коментарий: ${res.adminComment || res.clientComment}

          Хрошего Дня ❤
        `,
      )
      .catch((err) => {
        console.log(err);
      });

    if (res.clientTelegramId) {
      this?.bot?.telegram
        .sendMessage(
          res.clientTelegramId,
          `
            Привет, Запись ${moment(res.time).locale('ru').format('DD MMMM YYYY HH:mm')} Удалена💥
            Мастер: ${res.master.name}
            Коментарий: ${res.adminComment || res.masterComment}
  
            Хрошего Дня ❤
          `,
        )
        .catch((err) => {
          console.log(err);
        });
    }

    return res;
  }
}
