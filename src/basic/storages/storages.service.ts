import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoragesService {
  constructor(private prisma: PrismaService) {}

  async create(createStorageDto: CreateStorageDto) {
    try {
      const newStorage = await this.prisma.client.storages.create({
        data: {
          name: createStorageDto.name,
          company: {
            connect: { id: +createStorageDto.companies_id },
          },
        },
      });

      return { message: 'Storage created!', storage: newStorage };
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

  async findAllByCompany(companies_id: number) {
    try {
      const companiesStorage = await this.prisma.client.storages.findMany({
        where: { companies_id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { storages: companiesStorage };
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
      const storage = await this.prisma.client.storages.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { storage };
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

  async update(id: number, updateStorageDto: UpdateStorageDto) {
    try {
      const updatedStorage = await this.prisma.client.storages.update({
        where: { id },
        data: {
          name: updateStorageDto.name,
          companies_id: +updateStorageDto.companies_id,
        },
      });

      return { message: 'Storage updated!', storage: updatedStorage };
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
      const deletedStorage = await this.prisma.client.storages.delete({
        where: { id },
      });

      return { message: 'Storage deleted!', storage: deletedStorage };
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
