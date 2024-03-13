import { Injectable } from '@nestjs/common';

import { Repository } from 'src/core/domain/repository';
import { ProductMapper } from '../../mapper/product-mapper';
import { ProductEntity } from '../../domain/entity/products';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsRepositoryPrisma implements Repository<ProductEntity> {
  private readonly mapper: ProductMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new ProductMapper();
  }

  async create(product: ProductEntity): Promise<void> {
    const data = await this.mapper.toPersistence(product);

    await this.prisma.products.create({ data });
  }

  async update(id: string, product: ProductEntity): Promise<void> {
    const data = await this.mapper.toPersistence(product);

    await this.prisma.products.update({ data, where: { id } });
  }

  async patch(): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<ProductEntity> {
    const product = await this.prisma.products.findUnique({ where: { id } });

    if (!product) {
      return null;
    }

    return this.mapper.toDomain(product);
  }

  async getAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.products.findMany();

    if (!products || products.length <= 0) {
      return null;
    }

    return products.map((product) => this.mapper.toDomain(product));
  }

  async getOne(): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.prisma.products.delete({ where: { id } });
  }
}
