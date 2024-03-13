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

  afterAll(async () => {
    await app.close();
  });
});
