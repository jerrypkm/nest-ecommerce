import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CryptAdapter } from 'src/common/adapters';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cryptAdapter: CryptAdapter,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'SEED EXCECUTED';
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = seedUsers.map(({ password, ...rest }) =>
      this.userRepository.create({
        ...rest,
        password: this.cryptAdapter.hashSync(password, 10),
      }),
    );

    await this.userRepository.save(users);

    return users[0];
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;

    const insertPromises = [];
    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
