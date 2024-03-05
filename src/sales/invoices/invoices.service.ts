import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      // On POST invoice minimal data should be required
      const newInvoice = await this.prisma.client.invoices.create({
        data: {
          date_of_order: createInvoiceDto.date_of_order,
          delivery_due_date: createInvoiceDto.delivery_due_date,
          payment_due_date: createInvoiceDto.payment_due_date,
          vat: createInvoiceDto.vat,
          worker_id: createInvoiceDto.worker_id,
          companies_id: createInvoiceDto.companies_id,
          client_id: createInvoiceDto.client_id,
          currencies_id: createInvoiceDto.currencies_id,
        },
      });

      return { message: 'Invoice created!', invoice: newInvoice };
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

  async findAllCompanies(id: number) {
    try {
      const companiesInvoices = await this.prisma.client.invoices.findMany({
        where: { companies_id: id, AND: { valid: true } },
        include: {
          worker: {
            select: { name: true },
          },
          client: {
            select: { name: true },
          },
        },
      });

      return { invoices: companiesInvoices };
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

  async findOne(id: number) {
    try {
      const invoice = await this.prisma.client.invoices.findUniqueOrThrow({
        where: { id },
        include: {
          invoice_articles: true,
        },
      });

      return { invoice };
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

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const updatedInvoice = await this.prisma.client.invoices.update({
        where: { id },
        data: updateInvoiceDto,
      });

      return { message: 'Invoice updated!', invoice: updatedInvoice };
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

  async remove(id: number) {
    try {
      const deletedInvoice = await this.prisma.client.invoices.delete({
        where: { id },
      });

      return { message: 'Invoice deleted!', invoice: deletedInvoice };
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

  // GET all invoices articles and sum values to update invoice
  // This method should be used after POST & PUT of invoice-article
  // So invoice would keep up with correct total amounts
  async updateInvoiceTotals(id: number) {
    try {
      const invoiceArticles =
        await this.prisma.client.invoice_articles.findMany({
          where: {
            invoices_id: id,
          },
          select: {
            selling_price_with_vat: true,
            vat_value: true,
            discount_value: true,
          },
        });

      // Sum invoice-article values
      const { selling_price_with_vat, vat_value, discount_value } =
        invoiceArticles.reduce(
          (prev, curr) => ({
            discount_value: prev.discount_value + curr.discount_value,
            selling_price_with_vat:
              prev.selling_price_with_vat + curr.selling_price_with_vat,
            vat_value: prev.vat_value + curr.vat_value,
          }),
          {
            selling_price_with_vat: 0,
            vat_value: 0,
            discount_value: 0,
          },
        );

      // Update invoice with new summed values
      const updatedInvoice = await this.prisma.client.invoices.update({
        where: { id },
        data: {
          invoice_total: selling_price_with_vat,
          vat_value,
          total_discount: discount_value,
        },
      });

      return { message: 'Invoice totals updated!', invoice: updatedInvoice };
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
}
