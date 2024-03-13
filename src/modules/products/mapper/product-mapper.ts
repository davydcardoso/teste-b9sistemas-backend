import { Mapper } from 'src/core/domain/mapper';
import { Products } from '@prisma/client';
import { ProductEntity } from '../domain/entity/products';

import { Name } from '../domain/entity/name';
import { Price } from '../domain/entity/price';
import { Stock } from '../domain/entity/stock';

export class ProductMapper extends Mapper<ProductEntity, Products> {
  toDomain(raw: Products): ProductEntity {
    const nameOrError = Name.create(raw.name);
    const priceOrError = Price.create(raw.price);
    const stockOrError = Stock.create(raw.stock);

    if (nameOrError.isLeft()) {
      throw nameOrError.value;
    }

    if (priceOrError.isLeft()) {
      throw priceOrError.value;
    }

    if (stockOrError.isLeft()) {
      throw priceOrError.value;
    }

    const productOrError = ProductEntity.create(
      {
        name: nameOrError.value,
        price: priceOrError.value,
        stock: stockOrError.value,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );

    if (productOrError.isRight()) {
      return productOrError.value;
    }

    return null;
  }

  async toPersistence(raw: ProductEntity): Promise<Products> {
    return {
      id: raw.id,
      name: raw.name.value,
      price: raw.price.value,
      stock: raw.price.value,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
