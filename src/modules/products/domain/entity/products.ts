import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/Logic/Either';

import { Name } from './name';
import { Price } from './price';
import { Stock } from './stock';

import { ProductNameInvalidError } from './errors/product-name-invalid.error';
import { ProductPriceInvalidError } from './errors/product-price-invalid.error';
import { ProductStockInvalidError } from './errors/product-stock-invalid.error';

type ProductsProps = {
  name: Name;
  price: Price;
  stock: Stock;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ProductEntity extends Entity<ProductsProps> {
  get name() {
    return this.props.name;
  }

  get price() {
    return this.props.price;
  }

  get stock() {
    return this.props.stock;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: ProductsProps, id?: string) {
    super(props, id);
  }

  static create(
    props: ProductsProps,
    id?: string,
  ): Either<
    | ProductNameInvalidError
    | ProductPriceInvalidError
    | ProductStockInvalidError,
    ProductEntity
  > {
    const product = new ProductEntity(props, id);

    return right(product);
  }
}
