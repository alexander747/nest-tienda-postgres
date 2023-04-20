import { Module } from '@nestjs/common';

//importar para variables de entorno
import { ConfigModule } from '@nestjs/config';

//para typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),//para que lea las variables de entorno
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,

      autoLoadEntities: true, //carga las entidades automaticamente en la base de datos
      synchronize: true //en produccion en false


    }),//para typeorm
  ],
})
export class AppModule { }
