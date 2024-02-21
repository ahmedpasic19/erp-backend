import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodFilter } from './common/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodFilter());
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(5001);
}
bootstrap();
