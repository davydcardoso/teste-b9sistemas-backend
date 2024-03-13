import { Module } from '@nestjs/common';
import { ProductsRepository } from './infra/repositories/product-repository';
import { ProductsRepositoryPrisma } from './infra/repositories/products-repository.prisma';
import { ProductsController } from './infra/controllers/products-controller';
import { CreateNewProductUseCase } from './use-cases/create-new-product-usecase';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GetAllProductsUseCase } from './use-cases/get-all-products-usecase';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: ProductsRepository,
      useClass: ProductsRepositoryPrisma,
    },
    CreateNewProductUseCase,
    GetAllProductsUseCase,
  ],
})
export class ProductModule {}
