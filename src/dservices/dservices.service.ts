import { Injectable } from '@nestjs/common';
import { CreateDserviceDto } from './dto/create-dservice.dto';
import { UpdateDserviceDto } from './dto/update-dservice.dto';

@Injectable()
export class DservicesService {
  create(createDserviceDto: CreateDserviceDto) {
    return 'This action adds a new dservice';
  }

  findAll() {
    return `This action returns all dservices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dservice`;
  }

  update(id: number, updateDserviceDto: UpdateDserviceDto) {
    return `This action updates a #${id} dservice`;
  }

  remove(id: number) {
    return `This action removes a #${id} dservice`;
  }
}
