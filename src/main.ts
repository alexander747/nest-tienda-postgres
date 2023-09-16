import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { log } from 'console';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  /**
   * documentacion con swagger https://docs.nestjs.com/openapi/introduction
   */
  const config = new DocumentBuilder()
    .setTitle('Rest api')
    .setDescription('Documentación api tienda')
    .setVersion('1.0')
    // .addTag('cats') son agrupadores como auth, products, seed pero lo vamos hacer de otra manera
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  /**
 * documentacion con swagger https://docs.nestjs.com/openapi/introduction end
 */

  await app.listen(process.env.PORT);

  console.log("API WORK ON PORT ", process.env.PORT);

}
bootstrap();
