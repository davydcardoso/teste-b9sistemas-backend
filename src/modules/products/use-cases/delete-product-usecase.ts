import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/Logic/Either';

import { ProductMapper } from '../mapper/product-mapper';
import { ProductsRepository } from '../infra/repositories/product-repository';
import { ProductNotExistsInSystemError } from './errors/product-not-exists-in-system.error';

type DeleteProductUseCaseRequest = {
  id: string;
};

type DeleteProductUseCaseResponse = Either<Error, { message: string }>;

@Injectable()
export class DeleteProductUseCase {
  private readonly mapper: ProductMapper;

  constructor(private readonly productsRepository: ProductsRepository) {
    this.mapper = new ProductMapper();
  }

  async perform({
    id,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const existsProduct = await this.productsRepository.getById(id);

    if (!existsProduct) {
      return left(new ProductNotExistsInSystemError());
    }

    await this.productsRepository.delete(id);

    return right({ message: 'O produto foi excluido com sucesso' });
  }
}
