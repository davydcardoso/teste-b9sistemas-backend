import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/Logic/Either';

import { Products } from '@prisma/client';
import { ProductsRepository } from '../infra/repositories/product-repository';

import { Name } from '../domain/entity/name';
import { Price } from '../domain/entity/price';
import { Stock } from '../domain/entity/stock';

import { ProductEntity } from '../domain/entity/products';
import { ProductMapper } from '../mapper/product-mapper';

type CreateNewProductUseCaseRequest = {
  name: string;
  price: number;
  stock: number;
};

type CreateNewProductUseCaseResponse = Either<Error, Products>;

@Injectable()
export class CreateNewProductUseCase {
  private readonly mapper: ProductMapper;

  constructor(private readonly productRepository: ProductsRepository) {
    this.mapper = new ProductMapper();
  }

  async perform({
    name,
    price,
    stock,
  }: CreateNewProductUseCaseRequest): Promise<CreateNewProductUseCaseResponse> {
    const nameOrError = Name.create(name);
    const priceOrError = Price.create(price);
    const stockOrError = Stock.create(stock);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (priceOrError.isLeft()) {
      return left(priceOrError.value);
    }

    if (stockOrError.isLeft()) {
      return left(stockOrError.value);
    }

    const productOrError = ProductEntity.create({
      name: nameOrError.value,
      price: priceOrError.value,
      stock: stockOrError.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (productOrError.isLeft()) {
      return left(productOrError.value);
    }

    const product = productOrError.value;

    await this.productRepository.create(product);

    return right({ ...(await this.mapper.toPersistence(product)) });
  }
}
