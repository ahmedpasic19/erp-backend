import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.client.users.create({
        data: {
          name: createUserDto.name,
          password: createUserDto.password,
          email: createUserDto.email,
          companies: createUserDto.companies_id
            ? { connect: { id: +createUserDto.companies_id } }
            : undefined,
        },
      });

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

  async findOne(id: number) {
    try {
      const foundUser = await this.prisma.client.users.findUnique({
        where: { id },
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const newUser = await this.prisma.client.users.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          password: updateUserDto.password,
          email: updateUserDto.email,
          companies: updateUserDto.companies_id
            ? { connect: { id: +updateUserDto.companies_id } }
            : undefined,
        },
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

  async remove(id: number) {
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
