import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hash password with bcrypt

      const newUser = await this.prisma.client.users.create({
        data: {
          name: createUserDto.name,
          password: hashedPassword,
          email: createUserDto.email,
        },
      });

      // Relate to companies
      if (createUserDto.companies.length) {
        await this.prisma.client.users_in_companies.createMany({
          data: createUserDto.companies.map((relation) => ({
            company_id: relation.company_id,
            user_id: newUser.id,
          })),
        });
      }

      return { message: 'User created!', user: newUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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
      const allUsers = await this.prisma.client.users.findMany();

      return { users: allUsers };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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

      return { user: foundUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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

      return { user: foundUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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
      const newUser = await this.prisma.client.users.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          password: updateUserDto.password,
          email: updateUserDto.email,
        },
      });

      // Delete old relation
      await this.prisma.client.users_in_companies.deleteMany({
        where: { user_id: id },
      });

      // Set new relations and old relation
      await this.prisma.client.users_in_companies.createMany({
        data: updateUserDto.companies.map((relation) => ({
          user_id: relation.user_id,
          company_id: relation.company_id,
        })),
      });

      return { message: 'User updated!', user: newUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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
          error: 'Error accured!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
