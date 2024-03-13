import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../mapper/product-mapper';
import { ProductsRepository } from '../infra/repositories/product-repository';
import { Either, left, right } from 'src/core/Logic/Either';
import { Products } from '@prisma/client';
import { Name } from '../domain/entity/name';
import { ProductEntity } from '../domain/entity/products';
import { Price } from '../domain/entity/price';
import { Stock } from '../domain/entity/stock';
import { ProductNotExistsInSystemError } from './errors/product-not-exists-in-system.error';

type EditProductDataUseCaseRequest = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type EditProductDataUseCaseResponse = Either<Error, Products>;

@Injectable()
export class EditProductDataUseCase {
  private readonly mapper: ProductMapper;

  constructor(private readonly productRepository: ProductsRepository) {
    this.mapper = new ProductMapper();
  }

  async perform({
    id,
    name,
    price,
    stock,
  }: EditProductDataUseCaseRequest): Promise<EditProductDataUseCaseResponse> {
    const nameOrError = Name.create(name);
    const priceOrError = Price.create(price);
    const stockOrError = Stock.create(stock);

    const existsProduct = await this.productRepository.getById(id);

    if (!existsProduct) {
      return left(new ProductNotExistsInSystemError());
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (priceOrError.isLeft()) {
      return left(priceOrError.value);
    }

    if (stockOrError.isLeft()) {
      return left(stockOrError.value);
    }

    const productOrError = ProductEntity.create(
      {
        name: nameOrError.value,
        price: priceOrError.value,
        stock: stockOrError.value,
        createdAt: existsProduct.createdAt,
        updatedAt: new Date(),
      },
      existsProduct.id,
    );

    if (productOrError.isLeft()) {
      return left(productOrError.value);
    }

    const product = productOrError.value;

    await this.productRepository.update(id, product);

    return right({ ...(await this.mapper.toPersistence(product)) });
  }
}
