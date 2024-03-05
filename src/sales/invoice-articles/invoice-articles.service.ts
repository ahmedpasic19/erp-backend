import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoiceArticleDto } from './dto/create-invoice-article.dto';
import { UpdateInvoiceArticleDto } from './dto/update-invoice-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FinancialService } from 'src/common/financial/financial.service';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class InvoiceArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financial: FinancialService,
    private readonly invoiceService: InvoicesService,
  ) {}

  async create(createInvoiceArticleDto: CreateInvoiceArticleDto) {
    try {
      // Calculate article values
      const [selling_price, selling_price_with_vat, vat_value, discount_value] =
        this.calculateTotals(
          createInvoiceArticleDto.base_price,
          createInvoiceArticleDto.amount,
          createInvoiceArticleDto.vat,
          createInvoiceArticleDto.discount,
        );

      // POST new article
      const newInvoiceArticle =
        await this.prisma.client.invoice_articles.create({
          data: {
            invoices_id: createInvoiceArticleDto.invoices_id,
            articles_id: createInvoiceArticleDto.articles_id,
            base_price: createInvoiceArticleDto.base_price,
            base_price_with_vat: createInvoiceArticleDto.base_price_with_vat,
            name: createInvoiceArticleDto.name,
            code: createInvoiceArticleDto.code,
            amount: createInvoiceArticleDto.amount,
            discount: createInvoiceArticleDto.discount,
            discount_value,
            vat: createInvoiceArticleDto.vat,
            vat_value,
            selling_price,
            selling_price_with_vat,
          },
        });

      // Update the invoice totals
      await this.invoiceService.updateInvoiceTotals(
        createInvoiceArticleDto.invoices_id,
      );

      return {
        message: 'Invoice article added!',
        invoice_article: newInvoiceArticle,
      };
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

  async findAllInvoicesArticles(id: number) {
    try {
      const invoiceArticles =
        await this.prisma.client.invoice_articles.findMany({
          where: { invoices_id: id },
        });

      return { invoice_articles: invoiceArticles };
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
      const invoiceArticle =
        await this.prisma.client.invoice_articles.findUniqueOrThrow({
          where: { id },
        });

      return { invoice_article: invoiceArticle };
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

  async update(id: number, updateInvoiceArticleDto: UpdateInvoiceArticleDto) {
    try {
      // Calculate article values
      const [selling_price, selling_price_with_vat, vat_value, discount_value] =
        this.calculateTotals(
          updateInvoiceArticleDto.base_price,
          updateInvoiceArticleDto.amount,
          updateInvoiceArticleDto.vat,
          updateInvoiceArticleDto.discount,
        );

      const updatedInvoiceArticle =
        await this.prisma.client.invoice_articles.update({
          where: { id },
          data: {
            articles_id: updateInvoiceArticleDto.articles_id,
            base_price: updateInvoiceArticleDto.base_price,
            base_price_with_vat: updateInvoiceArticleDto.base_price_with_vat,
            name: updateInvoiceArticleDto.name,
            code: updateInvoiceArticleDto.code,
            amount: updateInvoiceArticleDto.amount,
            discount: updateInvoiceArticleDto.discount,
            discount_value,
            vat: updateInvoiceArticleDto.vat,
            vat_value,
            selling_price,
            selling_price_with_vat,
          },
        });

      // Update the invoice totals
      await this.invoiceService.updateInvoiceTotals(
        updateInvoiceArticleDto.invoices_id,
      );

      return {
        message: 'Invoice article updated!',
        invoice_article: updatedInvoiceArticle,
      };
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
      const deletedInvoiceArticle =
        await this.prisma.client.invoice_articles.delete({
          where: { id },
        });

      // Update the invoice totals
      await this.invoiceService.updateInvoiceTotals(
        deletedInvoiceArticle.invoices_id,
      );

      return {
        message: 'Invoice article deleted!',
        invoice_article: deletedInvoiceArticle,
      };
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

  // Use to calculate invoice article totals each POST & PUT
  private calculateTotals(
    base_price: number,
    amount: number,
    vat: number,
    discount: number,
  ): [number, number, number, number] {
    // Calculate the selling_price
    const selling_price = this.financial.applyDiscount(
      base_price * amount,
      discount,
    );

    // Calculate the selling_price_with_vat
    const selling_price_with_vat = this.financial.calculateTotalWithTax(
      selling_price,
      vat,
    );

    // Calculate the total VAT value for the article
    const vat_value = selling_price_with_vat - selling_price;

    // Calculate the discount value in the article
    // Has to be calculated from the NON-discounted price
    const discount_value = this.financial.calculatePercentageValue(
      base_price * amount,
      discount,
    );

    return [selling_price, selling_price_with_vat, vat_value, discount_value];
  }
}
