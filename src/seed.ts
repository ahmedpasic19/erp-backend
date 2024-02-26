import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    const password = await bcrypt.hash('user1243', 10);

    const users = [
      {
        name: 'Admin1',
        email: 'admin1@hotmail.com',
        password,
      },
      {
        name: 'Admin2',
        email: 'admin2@hotmail.com',
        password,
      },
      {
        name: 'Admin3',
        email: 'admin3@hotmail.com',
        password,
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

    const currencies = [
      { id: 1, name: 'BAM', course: 1.0, symbol: 'BAM' },
      { id: 2, name: 'Euro', course: 0.51129, symbol: '€' },
      { id: 3, name: 'USD', course: 0.61768, symbol: '$' },
      { id: 4, name: 'GBP', course: 0.43647, symbol: '£' },
      { id: 5, name: 'JPY', course: 69.031, symbol: '¥' },
    ];

    await prisma.currencies.createMany({
      data: currencies,
    });

    console.log('Sucessfull seed!');
  } catch (error) {
    console.log(error);
  }
}

seed();
