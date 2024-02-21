import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    const companies = [
      { name: 'Admin 1' },
      { name: 'Admin 2' },
      { name: 'Admin 3' },
    ];

    await prisma.companies.createMany({
      data: companies,
    });

    const companyIds = await prisma.companies.findMany({
      select: { id: true },
    });

    const users = [
      {
        name: 'Admin user 1',
        email: 'admin1@gmail.com',
        password: '11111111',
      },
      {
        name: 'Admin user 2',
        email: 'admin2@gmail.com',
        password: '22222222',
      },
      {
        name: 'Admin user 3',
        email: 'admin3@gmail.com',
        password: '33333333',
      },
    ];

    await prisma.users.createMany({
      data: users,
    });

    const userIds = await prisma.users.findMany({
      select: { id: true },
    });

    const prepared_data = [];

    for (let i = 0; i < companyIds.length; i++) {
      const { id: company_id } = companyIds[i];

      for (let j = 0; j < userIds.length; j++) {
        const { id: user_id } = userIds[j];

        prepared_data.push({ user_id, company_id });
      }
    }

    await prisma.users_in_companies.createMany({
      data: prepared_data,
    });

    console.log('Sucessfull seed!');
  } catch (error) {
    console.log(error);
  }
}

seed();
