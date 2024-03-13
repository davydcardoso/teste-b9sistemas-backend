import { Injectable } from '@nestjs/common';

import { Repository } from 'src/core/domain/repository';
import { ProductEntity } from '../../domain/entity/products';

import { Name } from '../../domain/entity/name';
import { Price } from '../../domain/entity/price';
import { Stock } from '../../domain/entity/stock';

import { PRODUCT_TEST_ID } from '../../constants';

@Injectable()
export class ProductsRepositoryInMemory implements Repository<ProductEntity> {
  public items: ProductEntity[];

  constructor() {
    this.items = [];

    this.items.push(
      ProductEntity.create(
        {
          name: Name.create('Produto de Teste 1').value as Name,
          price: Price.create(400.64).value as Price,
          stock: Stock.create(40).value as Stock,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        PRODUCT_TEST_ID,
      ).value as ProductEntity,
    );
  }

  async create(data: ProductEntity): Promise<void> {
    this.items.push(data);
  }

  async update(id: string, data: ProductEntity): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === id);

    this.items[productIndex] = data;
  }

  async patch(): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<ProductEntity> {
    const product = this.items.find((item) => item.id === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async getAll(): Promise<ProductEntity[]> {
    return this.items;
  }

  async getOne(): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    this.items = [];

    for (const item of this.items) {
      if (item.id !== id) {
        this.items.push(item);
      }
    }
  }
}
