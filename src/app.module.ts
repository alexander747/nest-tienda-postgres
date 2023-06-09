import { Module } from '@nestjs/common';

//importar para variables de entorno
import { ConfigModule } from '@nestjs/config';

//para typeorm
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

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
    }), //para typeorm

    //para servir una carpeta publica npm i @nestjs/serve-static
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public') //public la carpeta que vamos a servir como publica
    }),

    //modulos de mi app 
    ProductsModule, CommonModule, SeedModule, FilesModule, AuthModule,
  ],
})
export class AppModule { }
