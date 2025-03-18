import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookeParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export enum appTypesEnum {
  'ADMIN' = 'ADMIN',
  'MASTER' = 'MASTER',
  'CLIENT' = 'CLIENT',
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const theme = new SwaggerTheme();

  const config = new DocumentBuilder()
    .setTitle('BeautyBooking')
    .addGlobalParameters({
      in: 'header',
      required: true,
      name: 'appType',
      schema: {
        example: 'ADMIN',
        enum: Object.values(appTypesEnum),
        default: 'ADMIN',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  

  SwaggerModule.setup('doc', app, document, {explorer: true, customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)});
  app.enableCors({ origin: true, credentials: true });

  app.use(cookeParser());
  app.useGlobalPipes(new ValidationPipe({}));

  await app.listen(8888);
}
bootstrap();
 