import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsRepository } from './modules/products/infra/repositories/product-repository';
import { ProductsRepositoryPrisma } from './modules/products/infra/repositories/products-repository.prisma';
import { ProductModule } from './modules/products/products.module';

@Module({
  imports: [ProductModule, PrismaModule],
  controllers: [],
  providers: [
    PrismaModule,
    {
      provide: ProductsRepository,
      useClass: ProductsRepositoryPrisma,
    },
  ],
})
export class AppModule {}
