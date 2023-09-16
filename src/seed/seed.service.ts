import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {

  }

  async runSeed() {
    await this.deleteTables()
    const firstUser = await this.insertUsers()
    await this.insertNewProducts(firstUser)
    return `Seed execute`;
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    //eliminar los usuarios
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute()

  }

  private async insertUsers() {
    const usersSeed = initialData.users;
    const users: User[] = [];
    usersSeed.forEach(user => {
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(users)

    return dbUsers[0]
  }

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts()

    // inserto productos
    const products = initialData.products;

    const insertPromises = []
    products.forEach(product => {
      insertPromises.push(this.productService.create(product, user))
    })

    await Promise.all(insertPromises)

    return true
  }

}
