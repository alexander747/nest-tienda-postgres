import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule //para poder usar todo lo del modulo de productos y puedo hacer la inyeccion de dependencias
  ]
})
export class SeedModule { }
