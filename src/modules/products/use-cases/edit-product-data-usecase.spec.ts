import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsRepository } from '../infra/repositories/product-repository';
import { ProductsRepositoryInMemory } from '../infra/repositories/products-repository.in-memory';
import { EditProductDataUseCase } from './edit-product-data-usecase';
import { randomUUID } from 'crypto';
import { Products } from '@prisma/client';
import { PRODUCT_TEST_ID } from '../constants';
import { ProductNotExistsInSystemError } from './errors/product-not-exists-in-system.error';
import { ProductNameInvalidError } from '../domain/entity/errors/product-name-invalid.error';
import { ProductPriceInvalidError } from '../domain/entity/errors/product-price-invalid.error';
import { ProductStockInvalidError } from '../domain/entity/errors/product-stock-invalid.error';

describe('EditProductDataUseCase', () => {
  let useCase: EditProductDataUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditProductDataUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: ProductsRepository,
          useClass: ProductsRepositoryInMemory,
        },
      ],
    }).compile();

    useCase = module.get<EditProductDataUseCase>(EditProductDataUseCase);
  });

  const product: Products = {
    id: PRODUCT_TEST_ID,
    name: 'Produto de testes 4',
    price: 30,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('Tests whether the use case was built', () => {
    expect(useCase).toBeDefined();
  });

  it('Should return error (ProductNotExistsInSystemError) if product not exists', async () => {
    const result = await useCase.perform({ ...product, id: randomUUID() });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(
      typeof new ProductNotExistsInSystemError(),
    );
  });

  it('should return error (ProductNameInvalidError) if product name is invalid', async () => {
    const result = await useCase.perform({ ...product, name: '' });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(typeof new ProductNameInvalidError());
  });

  it('should return error (ProductPriceInvalidError) if product price is invalid', async () => {
    const result = await useCase.perform({ ...product, price: -2 });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(typeof new ProductPriceInvalidError());
  });

  it('Should return error (ProductStockInvalidError) if product stock is invalid', async () => {
    const result = await useCase.perform({ ...product, stock: -2 });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(typeof new ProductStockInvalidError());
  });

  it('Should return success if the product has been edited', async () => {
    const result = await useCase.perform({ ...product });

    expect(result.isRight()).toBe(true);
  });
});
