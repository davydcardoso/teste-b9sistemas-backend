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
            name: 'Pro',
            price: 10,
            stock: 20,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
