import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOfferArticleDto } from './dto/create-offer-article.dto';
import { UpdateOfferArticleDto } from './dto/update-offer-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FinancialService } from 'src/common/financial/financial.service';
import { OffersService } from '../offers/offers.service';

@Injectable()
export class OfferArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financial: FinancialService,
    private readonly offerService: OffersService,
  ) {}

  async create(createOfferArticleDto: CreateOfferArticleDto) {
    try {
      // Calculate article values
      const [selling_price, selling_price_with_vat, vat_value, discount_value] =
        this.calculateTotals(
          createOfferArticleDto.base_price,
          createOfferArticleDto.amount,
          createOfferArticleDto.vat,
          createOfferArticleDto.discount,
        );

      // POST new article
      const newOfferArticle = await this.prisma.client.offer_articles.create({
        data: {
          offers_id: createOfferArticleDto.offers_id,
          articles_id: createOfferArticleDto.articles_id,
          base_price: createOfferArticleDto.base_price,
          base_price_with_vat: createOfferArticleDto.base_price_with_vat,
          name: createOfferArticleDto.name,
          code: createOfferArticleDto.code,
          amount: createOfferArticleDto.amount,
          discount: createOfferArticleDto.discount,
          discount_value,
          vat: createOfferArticleDto.vat,
          vat_value,
          selling_price,
          selling_price_with_vat,
        },
      });

      // Update the offer totals
      await this.offerService.updateOfferTotals(
        createOfferArticleDto.offers_id,
      );

      return {
        message: 'Offer article added!',
        offer_article: newOfferArticle,
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

  async findAllOffersArticles(id: number) {
    try {
      const offerArticles = await this.prisma.client.offer_articles.findMany({
        where: { offers_id: id },
      });

      return { offer_articles: offerArticles };
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
      const offerArticle =
        await this.prisma.client.offer_articles.findUniqueOrThrow({
          where: { id },
        });

      return { offer_article: offerArticle };
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

  async update(id: number, updateOfferArticleDto: UpdateOfferArticleDto) {
    try {
      // Calculate article values
      const [selling_price, selling_price_with_vat, vat_value, discount_value] =
        this.calculateTotals(
          updateOfferArticleDto.base_price,
          updateOfferArticleDto.amount,
          updateOfferArticleDto.vat,
          updateOfferArticleDto.discount,
        );

      const updatedOfferArticle =
        await this.prisma.client.offer_articles.update({
          where: { id },
          data: {
            articles_id: updateOfferArticleDto.articles_id,
            base_price: updateOfferArticleDto.base_price,
            base_price_with_vat: updateOfferArticleDto.base_price_with_vat,
            name: updateOfferArticleDto.name,
            code: updateOfferArticleDto.code,
            amount: updateOfferArticleDto.amount,
            discount: updateOfferArticleDto.discount,
            discount_value,
            vat: updateOfferArticleDto.vat,
            vat_value,
            selling_price,
            selling_price_with_vat,
          },
        });

      // Update the offer totals
      await this.offerService.updateOfferTotals(
        updateOfferArticleDto.offers_id,
      );

      return {
        message: 'Offer article updated!',
        offer_article: updatedOfferArticle,
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
      const deletedOfferArticle =
        await this.prisma.client.offer_articles.delete({
          where: { id },
        });

      // Update the offer totals
      await this.offerService.updateOfferTotals(deletedOfferArticle.offers_id);

      return {
        message: 'Offer article deleted!',
        offer_article: deletedOfferArticle,
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

  // Use to calculate offer article totals each POST & PUT
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
