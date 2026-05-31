import {ValidationPipe,} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      'http://localhost:5173',

    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  const config = new DocumentBuilder()
    .setTitle('DenunciApp API')
    .setDescription('API para gestion de reportes')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(3000);
}

bootstrap();