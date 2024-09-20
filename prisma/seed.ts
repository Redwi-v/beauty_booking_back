import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const salonData: Prisma.SalonCreateInput[] = [
  {
    name: 'Salon1',
    logoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBIePbmKx1aWZNHFJkvrMOvxW1j56hK3MyHw&s',
  },
  {
    name: 'Salon1',
    logoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBIePbmKx1aWZNHFJkvrMOvxW1j56hK3MyHw&s',
  },
  {
    name: 'Salon1',
    logoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBIePbmKx1aWZNHFJkvrMOvxW1j56hK3MyHw&s',
  },
];

const branchData: Prisma.SalonBranchCreateInput[] = [
  {
    address: {
      create: {
        address: 'шоссе Гоголя, 57',
        city: 'г.Домодедово',
      },
    },
  },
  {
    address: {
      create: {
        address: 'спуск Космонавтов, 13',
        city: 'г. Волоколамск',
      },
    },
  },
  {
    address: {
      create: {
        address: 'проезд Ломоносова, 98',
        city: 'г. Люберцы',
      },
    },
  },
];

async function main() {
  const ownerAccount = await prisma.salonOwnerAccount.findFirst();

  for (const salonItem of salonData) {
    const salon = await prisma.salon.create({
      data: {
        ...salonItem,
        SalonOwnerAccount: {
          connect: {
            id: ownerAccount?.id,
          },
        },
      },
    });

    await prisma.salonBranch.createManyAndReturn({
      data: [
        {
          salonId: salon.salonId,
        },
        {
          salonId: salon.salonId,
        },
      ],
    });
  }
  console.log(`Seeding finished.`);
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
