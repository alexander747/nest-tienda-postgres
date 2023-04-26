import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //para anteponer prefijos a los endpoints
  app.setGlobalPrefix('api/v1')

  //para poder usar los dto con las clases validadoras
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT);

  console.log("API WORK ON PORT ", process.env.PORT);

}
bootstrap();
