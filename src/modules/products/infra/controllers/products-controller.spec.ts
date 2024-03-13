import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ProductsController } from './products-controller';
import { ProductsRepository } from '../repositories/product-repository';
import { ProductsRepositoryInMemory } from '../repositories/products-repository.in-memory';
import { CreateNewProductUseCase } from '../../use-cases/create-new-product-usecase';
import { GetAllProductsUseCase } from '../../use-cases/get-all-products-usecase';
import { DeleteProductUseCase } from '../../use-cases/delete-product-usecase';
import { PRODUCT_TEST_ID } from '../../constants';
import { randomUUID } from 'crypto';
import { EditProductDataUseCase } from '../../use-cases/edit-product-data-usecase';

describe('ProductController (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      imports: [PrismaModule],
      providers: [
        {
          provide: ProductsRepository,
          useClass: ProductsRepositoryInMemory,
        },
        CreateNewProductUseCase,
        GetAllProductsUseCase,
        DeleteProductUseCase,
        EditProductDataUseCase,
      ],
    }).compile();

    prisma = new PrismaClient();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('Should be defined', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('/POST - Create Products', () => {
    it('should erro 400 if product name is not valid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/products',
          payload: {
            name: '',
            price: 10,
            stock: 20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should error 400 if product price is not valid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: -2,
            stock: 20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should error 400 if product stock is not valid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: 20,
            stock: -20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should success 201 if all products information is valid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: 20,
            stock: 200,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(201);
        });
    });
  });

  describe('/PUT - Edit Product', () => {
    it('should erro 400 if product name is not valid', async () => {
      return app
        .inject({
          method: 'PUT',
          path: '/products',
          payload: {
            name: '',
            price: 10,
            stock: 20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should error 400 if product price is not valid', async () => {
      return app
        .inject({
          method: 'PUT',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: -2,
            stock: 20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should error 400 if product stock is not valid', async () => {
      return app
        .inject({
          method: 'PUT',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: 20,
            stock: -20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should error if product not exists', async () => {
      return app
        .inject({
          method: 'PUT',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: 20,
            stock: -20,
          },
          headers: {
            product_id: randomUUID(),
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should success 200 if product has been edited', async () => {
      return app
        .inject({
          method: 'PUT',
          path: '/products',
          payload: {
            name: 'Producto de testes 2',
            price: 20,
            stock: 200,
          },
          headers: {
            product_id: PRODUCT_TEST_ID,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(200);
        });
    });
  });

  describe('/DELETE - Delete Product', () => {
    it('Should error if product not exists', async () => {
      return app
        .inject({
          method: 'DELETE',
          path: '/products',
          headers: {
            product_id: randomUUID(),
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('Should success 200 if product has been delete', async () => {
      return app
        .inject({
          method: 'DELETE',
          path: '/products',
          headers: {
            product_id: PRODUCT_TEST_ID,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(200);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
