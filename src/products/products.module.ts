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
  ]
})
export class ProductsModule { }
