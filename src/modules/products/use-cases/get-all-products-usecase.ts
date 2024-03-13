import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { Either, right } from 'src/core/Logic/Either';
import { ProductMapper } from '../mapper/product-mapper';
import { ProductsRepository } from '../infra/repositories/product-repository';

type GetAllProductsUseCaseResponse = Either<Error, { products: Products[] }>;

@Injectable()
export class GetAllProductsUseCase {
  private readonly mapper: ProductMapper;

  constructor(private readonly productsRepository: ProductsRepository) {
    this.mapper = new ProductMapper();
  }

  async perform(): Promise<GetAllProductsUseCaseResponse> {
    const products = await this.productsRepository.getAll();

    const _products: Products[] = [];

    if (products) {
      for await (const row of products) {
        _products.push(await this.mapper.toPersistence(row));
      }
    }

    return right({ products: _products });
  }
}
