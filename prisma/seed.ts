import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionType.createMany({
    data: [
      {
        durationDays: 7,
        durationMouths: 0,
        price: 10000000,
        subTitle: 'Подарочная подписка 7 дней',
        title: 'Подарочная подписка',
        isStartingSubscription: true,
      },
      {
        durationDays: 0,
        durationMouths: 1,
        price: 1900,
        subTitle: 'При подключении доступ на 1 месяц',
        title: 'Минимальный',
      },
      {
        durationDays: 0,
        durationMouths: 4,
        price: 5700,
        subTitle: '3 месяца + 1 месяц в подарок',
        title: 'Стандартный',
      },
      {
        durationDays: 0,
        durationMouths: 6,
        price: 11400,
        subTitle: '6 месяцев + 4 месяца в подарок',
        title: 'Оптимальный',
      },
      {
        durationDays: 0,
        durationMouths: 24,
        price: 22800,
        subTitle: '12 месяцев + 12 месяцев в подарок',
        title: 'Максимальный',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
