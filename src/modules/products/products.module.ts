import { Module } from '@nestjs/common';
import { ProductsRepository } from './infra/repositories/product-repository';
import { ProductsRepositoryPrisma } from './infra/repositories/products-repository.prisma';
import { ProductsController } from './infra/controllers/products-controller';
import { CreateNewProductUseCase } from './use-cases/create-new-product-usecase';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: ProductsRepository,
      useClass: ProductsRepositoryPrisma,
    },
    CreateNewProductUseCase,
  ],
})
export class ProductModule {}
