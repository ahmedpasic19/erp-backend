import { Module } from '@nestjs/common';
import { InvoiceArticlesService } from './invoice-articles.service';
import { InvoiceArticlesController } from './invoice-articles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoicesService } from '../invoices/invoices.service';
import { FinancialService } from 'src/common/financial/financial.service';

@Module({
  controllers: [InvoiceArticlesController],
  providers: [
    InvoiceArticlesService,
    PrismaService,
    InvoicesService,
    FinancialService,
  ],
})
export class InvoiceArticlesModule {}
