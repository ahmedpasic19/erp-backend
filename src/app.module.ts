import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [UsersModule, CompaniesModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
