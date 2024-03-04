import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    try {
      const newArticle = await this.prisma.client.articles.create({
        data: {
          code: createArticleDto.code,
          name: createArticleDto.name,
          price_without_vat: createArticleDto.price_without_vat,
          price_with_vat: createArticleDto.price_with_vat,
          company: {
            connect: {
              id: createArticleDto.companies_id,
            },
          },
        },
      });

      return { message: 'Article created!', article: newArticle };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(id: number) {
    try {
      const articles = await this.prisma.client.articles.findMany({
        where: {
          companies_id: id,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { articles };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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
      const article = await this.prisma.client.articles.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { article };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findByName(name: string, companies_id: number) {
    try {
      const articles = await this.prisma.client.articles.findMany({
        where: {
          // Return any 5 clients if name provided as "ANY_ARTICLES"
          // This simbolizes user hasnt searched for any clients yet
          ...(name === 'ANY_ARTICLES'
            ? {}
            : {
                name: {
                  contains: name.toLocaleLowerCase().trim(),
                },
              }),
          AND: {
            companies_id,
          },
        },
        take: name === 'ANY_CLIENTS' ? 5 : 10,
      });

      return { articles };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      const updatedArticle = await this.prisma.client.articles.update({
        where: { id },
        data: {
          code: updateArticleDto.code,
          name: updateArticleDto.name,
          companies_id: updateArticleDto.companies_id,
          price_without_vat: updateArticleDto.price_without_vat,
          price_with_vat: updateArticleDto.price_with_vat,
        },
      });

      return { message: 'Article updated!', article: updatedArticle };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
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
      const deletedArticle = await this.prisma.client.articles.delete({
        where: { id },
      });

      return { message: 'Article deleted!', article: deletedArticle };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error accured!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
