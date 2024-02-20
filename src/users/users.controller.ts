import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { SetCurrenctCompanyDto } from './dto/set-company.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ZodPipe(CreateUserDto)) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateUserDto)) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('set-current-company')
  setCurrentCompany(
    @Body(new ZodPipe(SetCurrenctCompanyDto))
    setCurrentCompanyDto: SetCurrenctCompanyDto,
  ) {
    return this.usersService.setCurrentCompany(setCurrentCompanyDto);
  }

  @Patch('remove-current-company/:id')
  removeCurrentCompany(@Param('id') id: string) {
    return this.usersService.removeCurrentCompany(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
