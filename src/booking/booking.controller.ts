import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
@ApiTags('Booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'telegramId', required: false })
  findAll(@Query('telegramId') telegramId: string) {
    return this.bookingService.findAll(telegramId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Post('find/byIdArray')
  findAllById(@Body() Body: { idArray: number[] }) {
    return this.bookingService.findAllById(Body.idArray);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
