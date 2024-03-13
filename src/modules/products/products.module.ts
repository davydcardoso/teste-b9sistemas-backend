import { Module } from '@nestjs/common';
import { ProductsRepository } from './infra/repositories/product-repository';
import { ProductsRepositoryPrisma } from './infra/repositories/products-repository.prisma';
import { ProductsController } from './infra/controllers/products-controller';
import { CreateNewProductUseCase } from './use-cases/create-new-product-usecase';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GetAllProductsUseCase } from './use-cases/get-all-products-usecase';
import { DeleteProductUseCase } from './use-cases/delete-product-usecase';
import { EditProductDataUseCase } from './use-cases/edit-product-data-usecase';

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
    DeleteProductUseCase,
    EditProductDataUseCase,
  ],
})
export class ProductModule {}
