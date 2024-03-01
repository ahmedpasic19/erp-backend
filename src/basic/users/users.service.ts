import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SetCurrenctCompanyDto } from './dto/set-company.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hash password with bcrypt

      const { companies, ...userData } = createUserDto;

      const newUser = await this.prisma.client.users.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      // Relate to companies
      if (companies && companies.length) {
        await this.prisma.client.users_in_companies.createMany({
          data: companies.map((relation) => ({
            company_id: relation.company_id,
            user_id: newUser.id,
          })),
        });
      }

      return { message: 'User created!', user: newUser };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async createClient(createClientDto: CreateUserDto) {
    try {
      const { user } = await this.create({
        ...createClientDto,
        password: Math.random().toString().slice(0, 8), // Set random pass cuz clients can't signin anyway
      });

      return { message: 'Client created!', user };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findAllCompanyClients(id: number) {
    try {
      const clients = await this.prisma.client.users.findMany({
        where: {
          type: 'CLIENT',
          AND: {
            current_company_id: id,
          },
        },
      });

      return { clients };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findAll() {
    try {
      const allUsers = await this.prisma.client.users.findMany({
        where: { type: 'USER' },
      });

      return { users: allUsers };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: string) {
    try {
      const foundUser = await this.prisma.client.users.findUnique({
        where: { id },
        include: {
          companies: {
            select: {
              company: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      delete foundUser.password;

      return { user: foundUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findOneByName(name: string) {
    try {
      const foundUser = await this.prisma.client.users.findFirstOrThrow({
        where: { name },
        include: {
          companies: {
            select: {
              company: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      /**
       * Should return password here
       * because this is used in the auth service
       */
      return { user: foundUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findCompanyClientsByName(companies_id: number, name: string) {
    try {
      const clients = await this.prisma.client.users.findMany({
        where: {
          // Return any 5 clients if name provided as "ANY_CLIENTS"
          // This simbolizes user hasnt searched for any clients yet
          ...(name === 'ANY_CLIENTS'
            ? {}
            : {
                name: {
                  contains: name.toLocaleLowerCase().trim(),
                },
              }),
          AND: {
            type: 'CLIENT',
            current_company_id: companies_id,
          },
        },
        select: {
          name: true,
          id: true,
          email: true,
          image: true,
          current_company_id: true,
          password: false, // just in case hehe
        },
        take: name === 'ANY_CLIENTS' ? 5 : 10,
      });

      /**
       * Should NOT return password here
       * because this is used in the auth service
       */
      return { clients };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { companies, ...userData } = updateUserDto;

      // If password is sent in the body check if it is changes
      // If password is changed make a new hash
      let newHash = '';
      let isChanged = true; // if TRUE then password has NOT been changed
      if (updateUserDto.password) {
        // Get user password for compare
        const founduser = await this.prisma.client.users.findUnique({
          where: { id },
          select: { password: true },
        });

        // Compare passwords
        // Will return "false" if passwords do not match
        // Meaning it has been changesd
        isChanged = await this.comparePasswords(
          userData.password,
          founduser.password,
        );
      }

      if (!isChanged) {
        newHash = await bcrypt.hash(userData.password, 10); // Hash password with bcrypt
      }

      const updatedUser = await this.prisma.client.users.update({
        where: { id },
        data: { ...userData, ...(!isChanged ? { password: newHash } : {}) },
      });

      if (companies) {
        // Delete old relation
        await this.prisma.client.users_in_companies.deleteMany({
          where: { user_id: id },
        });

        // Set new relations and old relation
        await this.prisma.client.users_in_companies.createMany({
          data: companies.map((relation) => ({
            user_id: id,
            company_id: relation.company_id,
          })),
        });
      }

      return { message: 'User updated!', user: updatedUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.prisma.client.users.delete({
        where: { id },
      });

      return { message: 'User deleted!', user: deletedUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  // User selects what company he wants to sign in to
  // On sign out relation should be removed
  async setCurrentCompany(setCurrentCompanyDto: SetCurrenctCompanyDto) {
    try {
      const updatedUser = await this.prisma.client.users.update({
        where: { id: setCurrentCompanyDto.user_id },
        data: { current_company_id: setCurrentCompanyDto.company_id },
      });

      return { message: 'User updated', user: updatedUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  // Run this API on sign out
  async removeCurrentCompany(id: string) {
    try {
      const updatedUser = await this.prisma.client.users.update({
        where: { id },
        data: { current_company_id: null },
      });

      return { message: 'Company removed!', user: updatedUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
