import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService') //para ver el error en que clase

  constructor(
    @InjectRepository(Product) //para conectarnos a la base de datos
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage) //para conectarnos a la base de datos
    private readonly productImageRepository: Repository<ProductImage>,

  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const p = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      })
      await this.productRepository.save(p)

      return { ...p, images };

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  //TODO: PAGINAR
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // relaciones
      relations: {
        images: true //nombre de la relacion que esta en la entity
      }
    })

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      // findOneBy no permite poner las relaciones por eso toca habilitar el eagger en la entidad
      product = await this.productRepository.findOneBy({ id: term })

      // este codigo sirve para las relaciones pero no es tan elegante
      // product = await this.productRepository.findOne({ where:{ id: term}, relations:{images:true} })

    } else {
      // product = await this.productRepository.findOneBy({ slug: term })
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where(`UPPER(title)=:title or slug=:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      })
        .leftJoinAndSelect('prod.images', 'prodImages') //esta me carga la relacion usando el queryBuilder y debo especificar el campo y ponerle un alias
        .getOne()
    }

    // const p = await this.productRepository.findOneBy({ id: id });
    if (!product) throw new NotFoundException(`Producto ${product} no encontrado.`)
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //preload busca del producto por id 
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
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
