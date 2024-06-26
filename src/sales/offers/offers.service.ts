import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto) {
    try {
      // On POST offer minimal data should be required
      const newOffer = await this.prisma.client.offers.create({
        data: {
          date_of_order: createOfferDto.date_of_order,
          delivery_due_date: createOfferDto.delivery_due_date,
          payment_due_date: createOfferDto.payment_due_date,
          vat: createOfferDto.vat,
          worker_id: createOfferDto.worker_id,
          companies_id: createOfferDto.companies_id,
          client_id: createOfferDto.client_id,
          currencies_id: createOfferDto.currencies_id,
        },
      });

      return { message: 'Offer created!', offer: newOffer };
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
      const companiesOffers = await this.prisma.client.offers.findMany({
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

      return { offers: companiesOffers };
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
      const offer = await this.prisma.client.offers.findUniqueOrThrow({
        where: { id },
        include: {
          offer_articles: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          currency: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { offer };
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

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    try {
      const updatedOffer = await this.prisma.client.offers.update({
        where: { id },
        data: updateOfferDto,
      });

      return { message: 'Offer updated!', offer: updatedOffer };
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
      // DELETE all offer-articles
      await this.prisma.client.offer_articles.deleteMany({
        where: { offers_id: id },
      });

      const deletedOffer = await this.prisma.client.offers.delete({
        where: { id },
      });

      return { message: 'Offer deleted!', offer: deletedOffer };
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

  // GET all offers articles and sum values to update offer
  // This method should be used after POST & PUT of offer-article
  // So offer would keep up with correct total amounts
  async updateOfferTotals(id: number) {
    try {
      const offerArticles = await this.prisma.client.offer_articles.findMany({
        where: {
          offers_id: id,
        },
        select: {
          selling_price_with_vat: true,
          vat_value: true,
          discount_value: true,
        },
      });

      // Sum offer-article values
      const { selling_price_with_vat, vat_value, discount_value } =
        offerArticles.reduce(
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

      // Update offer with new summed values
      const updateOffer = await this.prisma.client.offers.update({
        where: { id },
        data: {
          offer_total: selling_price_with_vat,
          vat_value,
          total_discount: discount_value,
        },
      });

      return { message: 'Offer totals updated!', offer: updateOffer };
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
