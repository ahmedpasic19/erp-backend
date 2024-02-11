import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateArticleDto)) createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.create(createArticleDto);
  }

  @Get('by-company/:id')
  findAll(@Param('id') id: string) {
    return this.articlesService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateArticleDto)) updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
