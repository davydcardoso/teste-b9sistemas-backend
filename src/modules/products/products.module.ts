import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsRepository } from './infra/repositories/product-repository';
import { ProductsRepositoryPrisma } from './infra/repositories/products-repository.prisma';

@Module({
  controllers: [],
  imports: [PrismaService],
  providers: [
    {
      provide: ProductsRepository,
      useClass: ProductsRepositoryPrisma,
    },
  ],
})
export class ProductModule {}
