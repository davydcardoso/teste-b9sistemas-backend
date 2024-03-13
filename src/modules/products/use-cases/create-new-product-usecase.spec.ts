import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';

import { Products } from '@prisma/client';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateNewProductUseCase } from './create-new-product-usecase';

import { ProductsRepository } from '../infra/repositories/product-repository';
import { ProductsRepositoryInMemory } from '../infra/repositories/products-repository.in-memory';

import { ProductNameInvalidError } from '../domain/entity/errors/product-name-invalid.error';
import { ProductPriceInvalidError } from '../domain/entity/errors/product-price-invalid.error';
import { ProductStockInvalidError } from '../domain/entity/errors/product-stock-invalid.error';

describe('CreateNewProductUseCase', () => {
  let useCase: CreateNewProductUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateNewProductUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: ProductsRepository,
          useClass: ProductsRepositoryInMemory,
        },
      ],
    }).compile();

    useCase = module.get<CreateNewProductUseCase>(CreateNewProductUseCase);
  });

  it('Tests whether the use case was built', () => {
    expect(useCase).toBeDefined();
  });

  const newProduct: Products = {
    id: randomUUID(),
    name: 'Produto de testes2',
    price: 30,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('Should return success (Right) if CreateNewProductUseCase', async () => {
    const result = await useCase.perform({ ...newProduct });

    expect(result.isRight()).toBe(true);
    expect(typeof result.value).toEqual(typeof newProduct);
  });

  it('should return error (ProductNameInvalidError) if product name is invalid', async () => {
    const result = await useCase.perform({ ...newProduct, name: '' });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(typeof new ProductNameInvalidError());
  });

  it('should return error (ProductPriceInvalidError) if product price is invalid', async () => {
    const result = await useCase.perform({ ...newProduct, price: -2 });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(typeof new ProductPriceInvalidError());
  });

  it('Should return error (ProductStockInvalidError) if product stock is invalid', async () => {
    const result = await useCase.perform({ ...newProduct, stock: -2 });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(typeof new ProductStockInvalidError());
  });
});
