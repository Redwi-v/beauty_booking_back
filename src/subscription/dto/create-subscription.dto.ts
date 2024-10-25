import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    default: 0,
  })
  durationMouths: number;

  @ApiProperty({
    default: 7,
  })
  durationDays: number;

  @ApiProperty({
    default: 100,
  })
  price: number;

  @ApiProperty({
    default: 'Подарочная подписка',
  })
  title: string;

  @ApiProperty({
    default: 'Подарок',
    required: false,
  })
  subTitle: string;

  @ApiProperty({
    default: false,
    required: false,
  })
  isStartingSubscription?: boolean;
}
