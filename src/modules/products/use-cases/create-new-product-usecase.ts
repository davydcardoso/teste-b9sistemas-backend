import { Injectable } from '@nestjs/common';
import { Either, right } from 'src/core/Logic/Either';

import { Products } from '@prisma/client';
import { ProductsRepository } from '../infra/repositories/product-repository';

type CreateNewProductUseCaseRequest = {
  name: string;
  price: number;
  stock: number;
};

type CreateNewProductUseCaseResponse = Either<Error, Products>;

@Injectable()
export class CreateNewProductUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async perform({}: CreateNewProductUseCaseRequest): Promise<CreateNewProductUseCaseResponse> {
    return right({} as Products);
  }
}
