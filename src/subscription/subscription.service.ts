import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { DbService } from 'src/db/db.service';

import { YooCheckout } from '@a2seven/yoo-checkout';
import { INotification } from './types';
import * as moment from 'moment';

const yooCheckout = new YooCheckout({
  shopId: process.env.SHOP_ID!,
  secretKey: process.env.PAYMENT_TOKEN!,
});

@Injectable()
export class SubscriptionService {
  constructor(private readonly db: DbService) {}

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.db.subscriptionType.create({
      data: createSubscriptionDto,
    });
  }

  async notificationHandler(body: INotification) {
    console.log('GOOD');


    if (body.event === 'payment.waiting_for_capture') {
      const payment = await yooCheckout.capturePayment(body.object.id, {
        amount: body.object.amount,
      });
      return payment;
    }

    if (body.event === 'payment.succeeded') {

      
      const transaction = await this.db.userTransactions.findUnique({
        where: {
          payId: body.object.id,
        },
        include: {
          SalonOwnerAccount: true,
          product: true,
        },
      });

      if ( !transaction  || !transaction.adminAccountUserId) throw new BadRequestException()

      const product = await this.db.adminAccount.update({
        where: {
          userId: transaction.adminAccountUserId,
        },
        data: {
          subscription: {
            connect: transaction?.product,
          },
          subscriptionStartDate: new Date(),
          subscriptionEndDate: moment(new Date())
            .add({
              days: transaction?.product.durationDays,
              months: transaction?.product.durationMouths,
            })
            .toDate(),
        },
      });

      console.log(product);
      

      console.log(transaction?.product.durationDays);
      console.log(transaction?.product.durationMouths);
      
      console.log(moment()
      .add({
        days: transaction?.product.durationDays,
        months: transaction?.product.durationMouths,
      }).format('HH:mm DD MMMM YYYY'));
      
    }
  }

  async buyProduct(productId: number, userId: number, returnUrl?: string) {
    const product = await this.db.subscriptionType.findUnique({
      where: {
        id: +productId,
      },
    });

    const buyer = await this.db.adminAccount.findUnique({
      where: {
        userId: userId,
      },
      include: {
        subscription: true
      }
    });

    if (!product || !buyer)
      throw new BadRequestException('Подписка не найдена');

    const payment = await yooCheckout.createPayment({
      amount: {
        value: String(product.price),
        currency: 'RUB',
      },
      save_payment_method: true,
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      description: `Оплата подписки BeutyBooking ${product.title}`,
    });

    console.log(product);
    

    await this.db.userTransactions.create({
      data: {
        amount: payment.amount.value,
        payId: payment.id,
        product: {
          connect: product,
        },
        SalonOwnerAccount: {
          connect: buyer,
        },
      },
    });

    return payment;
  }

  findAll() {
    return this.db.subscriptionType.findMany({
      where: {
        isStartingSubscription: {
          not: true,
        },
      },
    });
  }

  async findOne(id: number) {}

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
