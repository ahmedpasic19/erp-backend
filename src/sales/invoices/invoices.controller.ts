import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateInvoiceDto)) createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get('by-company/:id')
  findAllCompanies(@Param('id') id: string) {
    return this.invoiceService.findAllCompanies(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateInvoiceDto)) updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
