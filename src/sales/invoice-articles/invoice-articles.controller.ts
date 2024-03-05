import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoiceArticlesService } from './invoice-articles.service';
import { CreateInvoiceArticleDto } from './dto/create-invoice-article.dto';
import { UpdateInvoiceArticleDto } from './dto/update-invoice-article.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';

@Controller('invoice-articles')
export class InvoiceArticlesController {
  constructor(
    private readonly invoiceArticlesService: InvoiceArticlesService,
  ) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateInvoiceArticleDto))
    createInvoiceArticleDto: CreateInvoiceArticleDto,
  ) {
    return this.invoiceArticlesService.create(createInvoiceArticleDto);
  }

  @Get('by-invoice/:id')
  findAllInvoicesArticles(@Param('id') id: string) {
    return this.invoiceArticlesService.findAllInvoicesArticles(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceArticlesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateInvoiceArticleDto))
    updateInvoiceArticleDto: UpdateInvoiceArticleDto,
  ) {
    return this.invoiceArticlesService.update(+id, updateInvoiceArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceArticlesService.remove(+id);
  }
}
