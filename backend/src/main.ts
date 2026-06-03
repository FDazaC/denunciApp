import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  console.log('DATABASE_URL:', process.env.DATABASE_URL); //  este log verifica que la variable de entorno se está leyendo correctamente

  const app = await NestFactory.create(AppModule);
  
  
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
