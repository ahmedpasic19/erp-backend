import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesController } from './storages.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StoragesController],
  providers: [StoragesService, PrismaService],
})
export class StoragesModule {}
