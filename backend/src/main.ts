import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //Se habilita el cors para que el front pueda consumir la API
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HAED,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //Habilita el class-validator globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  //remueve todo lo extra que no esté en el DTO
      forbidNonWhitelisted: true, //Si se llegan a enviar campos no permitidos lanza error
      transform: true, //transforma los payloads a tipos de clases de DTO 
    }),
  )

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
