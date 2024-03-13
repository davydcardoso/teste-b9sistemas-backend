import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsRepository } from '../infra/repositories/product-repository';
import { ProductsRepositoryInMemory } from '../infra/repositories/products-repository.in-memory';
import { DeleteProductUseCase } from './delete-product-usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PRODUCT_TEST_ID } from '../constants';
import { ProductNotExistsInSystemError } from './errors/product-not-exists-in-system.error';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteProductUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: ProductsRepository,
          useClass: ProductsRepositoryInMemory,
        },
      ],
    }).compile();

    useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
  });

  it('Tests whether the use case was built', () => {
    expect(useCase).toBeDefined();
  });

  it('Should return error (ProductNotExistsInSystemError) if product not found', async () => {
    const result = await useCase.perform({ id: randomUUID() });

    expect(result.isLeft()).toBe(true);
    expect(typeof result.value).toEqual(
      typeof new ProductNotExistsInSystemError(),
    );
  });

  it('Should return success if product has been deleted', async () => {
    const result = await useCase.perform({ id: PRODUCT_TEST_ID });

    expect(result.isRight()).toBe(true);
    expect(typeof result.value).toEqual(typeof { message: '' });
  });
});
