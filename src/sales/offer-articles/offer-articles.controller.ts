import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { OfferArticlesService } from './offer-articles.service';
import { CreateOfferArticleDto } from './dto/create-offer-article.dto';
import { UpdateOfferArticleDto } from './dto/update-offer-article.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';

@Controller('offer-articles')
export class OfferArticlesController {
  constructor(private readonly offerArticlesService: OfferArticlesService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateOfferArticleDto))
    createOfferArticleDto: CreateOfferArticleDto,
  ) {
    return this.offerArticlesService.create(createOfferArticleDto);
  }

  @Get('by-offer/:id')
  findAllOffersArticles(@Param('id') id: string) {
    return this.offerArticlesService.findAllOffersArticles(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerArticlesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateOfferArticleDto))
    updateOfferArticleDto: UpdateOfferArticleDto,
  ) {
    return this.offerArticlesService.update(+id, updateOfferArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerArticlesService.remove(+id);
  }
}
