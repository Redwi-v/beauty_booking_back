import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    example: 'yandex.com',
  })
  returnUrl: string;
}

@Controller('payment')
@ApiTags('PAY')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post('pay')
  pay(@Body() body: AddressDto) {
    return this.paymentService.pay(body.returnUrl);
  } 
}
