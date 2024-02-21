import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './basic/users/users.module';
import { CompaniesModule } from './basic/companies/companies.module';
import { ArticlesModule } from './basic/articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './basic/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { StoragesModule } from './basic/storages/storages.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CompaniesModule,
    ArticlesModule,
    PrismaModule,
    StoragesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService, JwtService],
})
export class AppModule {}
