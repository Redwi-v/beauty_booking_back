import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto, FindAllServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DbService } from 'src/db/db.service';
import { connect } from 'http2';

@Injectable()
export class ServicesService {
  constructor(private db: DbService) {}

  create(createServiceDto: CreateServiceDto) {
    const { price, time, salonId, tagName, name } = createServiceDto;

    try {
      return this.db.masterService.create({
        data: {
          price,
          time: +time,
          name,
          Tag: {
            connectOrCreate: {
              where: { tagName },
              create: { tagName },
            },
          },
          salon: {
            connect: {
              salonId,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Не удалось добавить услугу');
    }
  }

  createTag(tagName: string) {
    try {
      return this.db.tag.create({
        data: {
          tagName,
        },
      });
    } catch (error) {
      throw new BadRequestException('Не удалось добавить тег');
    }
  }

  async deleteTag(tagName: string) {
    try {
      const res = await this.db.tag.findUnique({
        where: {
          tagName,
        },
        include: {
          services: true,
        },
      });

      if (res?.services.length !== 0)
        throw new BadRequestException(
          'Перед удалением тега очистите все услуги',
        );
      return this.db.tag.delete({
        where: { tagName },
      });
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Не удалось удалить тег');
    }
  }

  findAllTags() {
    try {
      return this.db.tag.findMany();
    } catch (error) {
      throw new BadRequestException('Не удалось получить список тегов');
    }
  }

  async findAll({ tagName, search, masterId }: FindAllServiceDto) {
    let searchParams: any = {};
    if (search) {
      searchParams = {
        services: {
          some: {
            name: { contains: search },
          },
        },
      };
    }

    let tagParams: any = {};
    if (tagName) {
      tagParams = {
        tagName: {
          equals: tagName,
        },
      };
    }

    let masterParams: any = {};
    if (masterId) {
      masterParams = { some: { id: { equals: Number(masterId) } } };
    }

    try {
      const res = await this.db.tag.findMany({
        where: {
          AND: [
            {
              services: {
                some: {
                  masters: masterParams,
                },
              },
            },
            {
              OR: [searchParams, tagParams],
            },
          ],
        },
        include: {
          services: {
            where: {
              AND: [
                { masters: masterParams },
                { name: search ? { contains: search } : {} },
              ],
            },
          },
        },
      });

      return { list: res };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Не удалось получить список услуг');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      return this.db.masterService.update({
        where: { id },
        data: {
          ...updateServiceDto,
          time: +updateServiceDto.time!,
        },
      });
    } catch (error) {
      throw new BadRequestException('Не удалось обновить услугу');
    }
  }

  remove(id: number) {
    try {
      return this.db.masterService.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Не удалось удалить услугу');
    }
  }
}
