import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookeParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('BeautyBooking').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);
  app.enableCors({ origin: true, credentials: true });

  app.use(cookeParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8888);
}
bootstrap();
 