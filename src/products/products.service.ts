import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

    //datasource sabe todo lo de la base de datos
    private readonly dataSource: DataSource,

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

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term)
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    //preload busca del producto por id 
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
      images: []
    })

    if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`)


    //crear query runner para transacciones 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //conectamos a la bd
    await queryRunner.startTransaction(); //iniciamos la transaccion


    try {
      // si hay imagenes o un array vacio 
      // primero eliminamos las de la bd
      if (images) {
        //elimina las imagenes donde la columna product sea igual al id 
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        //insertamos las nuevas imagenes
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }


      //intenta guardarlo , no impacta a la bd aun 
      await queryRunner.manager.save(product)

      //aplicamos los cambios
      await queryRunner.commitTransaction();

      //cerramos el queryRunner
      await queryRunner.release()

      return this.findOnePlain(id)

      // await this.productRepository.save(product)
    } catch (error) {
      // si algo salio mal en las transacciones 
      await queryRunner.rollbackTransaction();
      //cerramos el queryRunner
      await queryRunner.release()
      this.handleExceptions(error)
    }

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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')
    try {
      return await query.delete()
        .where({})
        .execute()
    } catch (error) {
      this.handleExceptions(error)
    }
  }


}
