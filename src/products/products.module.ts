import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

//para sincronizar los modelos a la bd
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities'

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage])
  ],
  //para que se pueda importar en otros modulos
  exports: [
    ProductsService,
    TypeOrmModule // para poder usar las entidades de Product y ProductImage desde otro modulo
  ]
})
export class ProductsModule { }
