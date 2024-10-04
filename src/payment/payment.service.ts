import { Injectable } from '@nestjs/common';
import * as YooKassa from 'yookassa';

const yooKassa = new YooKassa({
  shopId: '461771',
  secretKey: 'test_pM-AaqtfWdx92P6UAlLvCIyhUJScv8dwLLsm2RKB9Y4',
});

@Injectable()
export class PaymentService {
  async pay(returnUrl: string) {
    const payment = await yooKassa.createPayment({
      amount: {
        value: '2.00',
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      description: 'Оплата подписки BeutyBooking',
    });

    return payment.confirmation.confirmation_url;
  }
}
