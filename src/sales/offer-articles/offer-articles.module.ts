import { Module } from '@nestjs/common';
import { OfferArticlesService } from './offer-articles.service';
import { OfferArticlesController } from './offer-articles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FinancialService } from 'src/common/financial/financial.service';
import { OffersService } from '../offers/offers.service';

@Module({
  controllers: [OfferArticlesController],
  providers: [
    OfferArticlesService,
    PrismaService,
    FinancialService,
    OffersService,
  ],
})
export class OfferArticlesModule {}
