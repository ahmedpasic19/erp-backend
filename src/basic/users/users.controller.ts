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
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { SetCurrenctCompanyDto } from './dto/set-company.dto';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ZodPipe(CreateUserDto)) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('create-client')
  createClient(
    @Body(new ZodPipe(CreateClientDto)) createClientDto: CreateClientDto,
  ) {
    return this.usersService.createClient(createClientDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('companies-clients/:id')
  findAllCompanyClients(@Param('id') id: string) {
    return this.usersService.findAllCompanyClients(+id);
  }

  @Get('companies-clients/by-name/:companies_id/:name')
  findCompanyClientsByName(
    @Param('companies_id') companies_id: string,
    @Param('name') name: string,
  ) {
    return this.usersService.findCompanyClientsByName(+companies_id, name);
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
