import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService') //para ver el error en que clase

  constructor(
    @InjectRepository(Product) //para conectarnos a la base de datos
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const p = this.productRepository.create(createProductDto)
      await this.productRepository.save(p)

      return p;

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  //TODO: PAGINAR
  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
      //TODO: relaciones
    })
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      // product = await this.productRepository.findOneBy({ slug: term })
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where(`UPPER(title)=:title or slug=:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne()
    }

    // const p = await this.productRepository.findOneBy({ id: id });
    if (!product) throw new NotFoundException(`Producto ${product} no encontrado.`)
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //preload busca del producto por id 
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })

    if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`)
    try {
      await this.productRepository.save(product)
    } catch (error) {
      this.handleExceptions(error)
    }
    return product

  }

  async remove(id: string) {
    const p = await this.findOne(id)
    await this.productRepository.remove(p)
  }

  private handleExceptions(error: any) {
    // console.log(error)
    this.logger.error(error)
    if (error.code == '23505') throw new BadRequestException(error.detail)
    throw new InternalServerErrorException('Error verifique sus logs')
  }
}
