import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { StoragesService } from './storages.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';

@Controller('storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateStorageDto)) createStorageDto: CreateStorageDto,
  ) {
    return this.storagesService.create(createStorageDto);
  }

  @Get('by-company/:id')
  findAllByCompany(@Param('id') id: string) {
    return this.storagesService.findAllByCompany(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storagesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateStorageDto)) updateStorageDto: UpdateStorageDto,
  ) {
    return this.storagesService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storagesService.remove(+id);
  }
}
